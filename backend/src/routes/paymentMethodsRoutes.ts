import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20" as any,
});

// Middleware pour récupérer ou créer un Customer Stripe
async function getOrCreateCustomer(userId: string) {
  // ⚠️ Ici tu dois lier ton user (DB) avec un stripeCustomerId
  // Exemple basique : imaginons que tu stockes ça en mémoire
  // Dans ton vrai projet => sauvegarde stripeCustomerId dans ta table `users`
  let customerId = FAKE_DB[userId]; // remplace par ta DB
  if (!customerId) {
    const customer = await stripe.customers.create({
      metadata: { userId },
    });
    customerId = customer.id;
    FAKE_DB[userId] = customerId; // sauvegarde
  }
  return customerId;
}

// 1️⃣ Initier la PaymentSheet (SetupIntent + EphemeralKey)
router.post("/init-payment-sheet", async (req, res) => {
  try {
    const { userId } = req.body; // fourni par ton auth
    if (!userId) return res.status(400).json({ error: "User ID manquant" });

    const customerId = await getOrCreateCustomer(userId);

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: "2024-06-20" }
    );

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card", "sepa_debit"], // Autorise cartes + SEPA
    });

    res.json({
      setupIntentClientSecret: setupIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customerId,
    });
  } catch (err: any) {
    console.error("Erreur init PaymentSheet:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2️⃣ Lister les moyens de paiement du client
router.get("/list", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID manquant" });

    const customerId = await getOrCreateCustomer(userId as string);

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card", // tu peux aussi récupérer "sepa_debit"
    });

    res.json(paymentMethods.data);
  } catch (err: any) {
    console.error("Erreur liste PaymentMethods:", err);
    res.status(500).json({ error: err.message });
  }
});

// 3️⃣ Supprimer un moyen de paiement
router.delete("/remove/:pmId", async (req, res) => {
  try {
    const pmId = req.params.pmId;
    const detached = await stripe.paymentMethods.detach(pmId);
    res.json(detached);
  } catch (err: any) {
    console.error("Erreur suppression PaymentMethod:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

// ⚠️ Exemple FAKE_DB juste pour la démo
const FAKE_DB: Record<string, string> = {};
