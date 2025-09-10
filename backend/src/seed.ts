import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User";
import { getRandomPastelColor } from "./utils/generateColor";

dotenv.config();

const seedUser = async () => {
  try {
    console.log("🔌 Connexion à Mongo:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ Connecté à MongoDB");

    await User.deleteMany();
    console.log("🗑️ Utilisateurs existants supprimés");

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    // Création de l’utilisateur
    const user = await User.create({
      firstName: "Hamza",
      lastName: "Benz",
      email: "hamza@example.com",
      password: hashedPassword,
      avatarColor: getRandomPastelColor(),
    });

    console.log("🌱 Utilisateur inséré:", user);
    process.exit();
  } catch (error) {
    console.error("❌ Erreur seed:", error);
    process.exit(1);
  }
};

seedUser();
