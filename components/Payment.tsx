import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { API_URL } from "@/config/api";
import { theme } from "@/constants/theme";
import { useTranslation } from "react-i18next";

type PaymentProps = {
  amount: number; // en centimes (ex: 5000 = 50,00€)
  currency?: string; // ex: "eur"
};

export default function Payment({ amount, currency = "eur" }: PaymentProps) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { t } = useTranslation();

  const handlePayment = async () => {
    try {
      // 1️⃣ Créer un PaymentIntent sur le backend
      const response = await fetch(
        `${API_URL}/api/payment/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, currency }),
        }
      );

      const { clientSecret, error } = await response.json();
      if (error || !clientSecret) {
        Alert.alert(t("payment.errorTitle"), error || t("payment.errorInit"));
        return;
      }

      // 2️⃣ Initialiser la Payment Sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "TaxiLuxe 🚖",
        returnURL: "myapp://payment-return", // obligatoire iOS
      });

      if (initError) {
        Alert.alert(t("payment.errorTitle"), initError.message);
        return;
      }

      // 3️⃣ Ouvrir la Payment Sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Alert.alert(t("payment.errorTitle"), presentError.message);
      } else {
        Alert.alert(t("payment.successTitle"), t("payment.successMessage"));
      }
    } catch (err) {
      console.error("Erreur paiement:", err);
      Alert.alert(t("payment.errorTitle"), t("payment.errorServer"));
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>
          {t("payment.payButton", {
            amount: (amount / 100).toFixed(2),
            currency: currency.toUpperCase(),
          })}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20, alignItems: "center" },
  button: {
    backgroundColor: "#8fce00",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
