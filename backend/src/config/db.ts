import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  try {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DBNAME;

    if (!uri || !dbName) {
      throw new Error("❌ MONGO_URI ou MONGO_DBNAME manquant dans .env");
    }

    await mongoose.connect(uri, {
      dbName,
    });

    console.log(`✅ Connecté à MongoDB: ${dbName}`);
  } catch (error: any) {
    console.error("❌ Erreur de connexion MongoDB:", error.message);
    process.exit(1);
  }
}
