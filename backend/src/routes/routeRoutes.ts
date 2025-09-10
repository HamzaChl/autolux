import express from "express";
import dotenv from "dotenv";

import fetch from "node-fetch";

const router = express.Router();
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY as string;

async function geocodeAddress(address: string) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${GOOGLE_API_KEY}`;
  console.log("Geocode URL:", url);

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK" || !data.results.length) {
    console.error("Réponse Google:", data);
    throw new Error("Adresse introuvable");
  }

  return data.results[0].geometry.location;
}

router.post("/", async (req, res) => {
  try {
    const { pickup, dropoff } = req.body;

    if (!pickup || !dropoff) {
      return res
        .status(400)
        .json({ error: "Adresse départ et arrivée requises" });
    }

    const pickupLoc = await geocodeAddress(pickup);
    const dropoffLoc = await geocodeAddress(dropoff);

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${pickupLoc.lat},${pickupLoc.lng}&destination=${dropoffLoc.lat},${dropoffLoc.lng}&mode=driving&key=${GOOGLE_API_KEY}`;
    console.log("Directions URL:", url);

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Directions échoué:", data);
      return res
        .status(400)
        .json({ error: "Impossible de calculer l’itinéraire" });
    }

    const leg = data.routes[0].legs[0];

    res.json({
      distance: leg.distance.text,
      duration: leg.duration.text,
      pickupCoords: [pickupLoc.lng, pickupLoc.lat],
      dropoffCoords: [dropoffLoc.lng, dropoffLoc.lat],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
