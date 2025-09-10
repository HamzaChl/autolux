import express, { Application } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import userRoutes from "./routes/userRoutes";
import routeRoutes from "./routes/routeRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import paymentMethodsRoutes from "./routes/paymentMethodsRoutes";

dotenv.config();

const app: Application = express();
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
  res.send("🚖 API TaxiLuxe est en ligne !");
});

// Routes principales
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payment-methods", paymentMethodsRoutes);
app.use("/api/route", routeRoutes);

const PORT: number = parseInt(process.env.PORT || "4000", 10);

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  });
});
