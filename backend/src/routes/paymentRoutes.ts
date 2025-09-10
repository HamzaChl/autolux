import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20" as any,
});

// ⚡ Simple stockage en mémoire pour la démo
// ➡️ Dans ton vrai projet, mets ça dans une DB
let rideHistory: any[] = [];

// Créer un PaymentIntent
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: "Montant et devise requis" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    // Enregistre le trajet dans rideHistory (⚠️ seulement pour les nouveaux paiements)
    rideHistory.push({
      id: paymentIntent.id,
      amount,
      currency,
      status: paymentIntent.status,
      created: new Date(),
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("Erreur paiement:", err);
    res.status(500).json({ error: err.message });
  }
});

// Récupérer l’historique des trajets
router.get("/history", (req, res) => {
  res.json(rideHistory);
});

export default router;
