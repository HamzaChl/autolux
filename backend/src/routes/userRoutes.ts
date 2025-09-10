// backend/src/routes/userRoutes.ts
import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { getMe, updateMe } from "../controllers/userController";
import { protect } from "../middlewares/autMiddleware";

const router = express.Router();

// 📌 Inscription
router.post("/register", registerUser);

// 📌 Connexion
router.post("/login", loginUser);

// 📌 Profil utilisateur (JWT obligatoire)
router.get("/me", protect, getMe);

// 📌 Mise à jour profil utilisateur (JWT obligatoire)
router.put("/me", protect, updateMe);

export default router;
