import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { useStripe } from "@stripe/stripe-react-native";
import { API_URL } from "@/config/api";

type PaymentMethod = {
  id: string;
  card?: { brand: string; last4: string };
};

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = "user_123"; // ⚠️ remplace par ton vrai userId depuis ton auth

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/payment-methods/list?userId=${userId}`
      );
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        setPaymentMethods(data);
      } catch {
        console.error("Réponse serveur non JSON:", text);
        Alert.alert("Erreur", "Impossible de charger vos moyens de paiement");
      }
    } catch (err) {
      console.error("Erreur récupération PM:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const addPaymentMethod = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/payment-methods/init-payment-sheet`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const { setupIntentClientSecret, ephemeralKey, customerId, error } =
        await res.json();

      if (error) {
        Alert.alert("Erreur", error);
        return;
      }

      const { error: initError } = await initPaymentSheet({
        customerId,
        customerEphemeralKeySecret: ephemeralKey,
        setupIntentClientSecret,
        merchantDisplayName: "TaxiLuxe 🚖",
      });

      if (initError) {
        Alert.alert("Erreur", initError.message);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        Alert.alert("Erreur", presentError.message);
      } else {
        Alert.alert("✅ Succès", "Moyen de paiement ajouté !");
        fetchPaymentMethods();
      }
    } catch (err) {
      console.error("Erreur ajout PM:", err);
    }
  };

  const removePaymentMethod = async (pmId: string) => {
    Alert.alert("Supprimer", "Voulez-vous supprimer ce moyen de paiement ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await fetch(`${API_URL}/api/payment-methods/remove/${pmId}`, {
            method: "DELETE",
          });
          fetchPaymentMethods();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* Bouton retour */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <AntDesign name="arrowleft" size={20} color={theme.colors.text} />
              <Text style={styles.backText}>{t("profile.back")}</Text>
            </TouchableOpacity>

            {/* Liste des moyens de paiement */}
            <View style={styles.outterCard}>
              <View style={styles.card}>
                <Text style={styles.title}>{t("profile.paymentMethods")}</Text>

                {loading ? (
                  <ActivityIndicator
                    size="large"
                    color={theme.colors.primary}
                  />
                ) : paymentMethods.length === 0 ? (
                  <Text style={styles.text}>
                    {t("profile.noPaymentMethods")}
                  </Text>
                ) : (
                  paymentMethods.map((pm) => (
                    <View key={pm.id} style={styles.pmRow}>
                      <AntDesign
                        name="creditcard"
                        size={20}
                        color={theme.colors.text}
                      />
                      <Text style={styles.pmText}>
                        {pm.card
                          ? `${pm.card.brand.toUpperCase()} •••• ${
                              pm.card.last4
                            }`
                          : "Méthode inconnue"}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removePaymentMethod(pm.id)}
                      >
                        <AntDesign name="delete" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={addPaymentMethod}
                >
                  <View style={styles.buttonContent}>
                    <AntDesign
                      name="plus"
                      size={20}
                      color={theme.colors.text}
                    />
                    <Text style={styles.buttonText}>
                      {t("profile.addPaymentMethod")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { paddingTop: 90, paddingBottom: 60 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 8,
  },
  outterCard: {
    marginHorizontal: 10,
    marginBottom: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  card: {
    padding: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: theme.colors.muted,
    borderRadius: 10,
  },
  title: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
  },
  text: {
    color: theme.colors.muted,
    fontSize: 15,
    marginBottom: 15,
  },
  pmRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pmText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginLeft: 10,
  },
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.muted,
    marginTop: 15,
  },
  buttonContent: { flexDirection: "row", alignItems: "center" },
  buttonText: {
    color: theme.colors.text,
    fontWeight: "500",
    fontSize: 16,
    marginLeft: 10,
  },
});
