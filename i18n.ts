import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import fr from "./app/locales/fr.json";
import en from "./app/locales/en.json";
import nl from "./app/locales/nl.json";

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  nl: { translation: nl },
};

// clé pour stocker la langue
const STORAGE_KEY = "appLanguage";

async function getSavedLanguage() {
  try {
    const lang = await AsyncStorage.getItem(STORAGE_KEY);
    return lang || "fr"; // défaut : français
  } catch (e) {
    return "fr";
  }
}

(async () => {
  const lng = await getSavedLanguage();

  i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: "fr",
    interpolation: { escapeValue: false },
  });
})();

// Quand la langue change, on sauvegarde
i18n.on("languageChanged", async (lng) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, lng);
  } catch (e) {
    console.error("Erreur sauvegarde langue:", e);
  }
});

export default i18n;
