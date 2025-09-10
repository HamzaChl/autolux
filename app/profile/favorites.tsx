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
import Back from "@/components/Back";

type PaymentMethod = {
  id: string;
  card?: { brand: string; last4: string };
};

export default function FavoritesScreen() {
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
            <Back></Back>

            <View style={styles.outterCard}>
              <View style={styles.card}>$</View>
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
