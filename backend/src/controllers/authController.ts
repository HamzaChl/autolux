import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { getRandomPastelColor } from "../utils/generateColor";

// 📌 Inscription
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // On accepte aussi `firstname` et `lastname` si envoyés par erreur
    const finalFirstName = firstName || req.body.firstname;
    const finalLastName = lastName || req.body.lastname;

    if (!finalFirstName || !finalLastName || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    // Vérif si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création utilisateur
    const user = new User({
      firstName: finalFirstName,
      lastName: finalLastName,
      email,
      password: hashedPassword,
      avatarColor: getRandomPastelColor(),
    });

    await user.save();

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarColor: user.avatarColor,
      },
    });
  } catch (err: any) {
    console.error("Erreur registerUser:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

// 📌 Connexion
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    // Vérif user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Utilisateur non trouvé" });
    }

    // Vérif mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Mot de passe incorrect" });
    }

    // JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarColor: user.avatarColor,
      },
    });
  } catch (err: any) {
    console.error("Erreur loginUser:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};
