// backend/src/controllers/userController.ts
import { Request, Response } from "express";
import User from "../models/User";

// ✅ Récupération du profil connecté
export const getMe = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    res.json({
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      avatarColor: req.user.avatarColor,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMe = async (req: any, res: Response) => {
  try {
    const { firstName, lastName, email } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email déjà utilisé" });
      }
      user.email = email;
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      avatarColor: updatedUser.avatarColor,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
