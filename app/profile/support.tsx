import React from "react";
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
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { useTranslation } from "react-i18next";

export default function SupportScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const openMail = () => {
    Linking.openURL(
      "mailto:support@taxiluxe.com?subject=Assistance%20TaxiLuxe"
    );
  };

  const openPhone = () => {
    Linking.openURL("tel:+32470000000"); // ⚠️ Mets ton vrai numéro ici
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

            {/* Bloc Email */}
            <View style={styles.outterCard}>
              <View style={styles.card}>
                <Text style={styles.title}>{t("support.emailTitle")}</Text>
                <Text style={styles.text}>{t("support.emailDesc")}</Text>
                <TouchableOpacity style={styles.button} onPress={openMail}>
                  <View style={styles.buttonContent}>
                    <AntDesign
                      name="mail"
                      size={20}
                      color={theme.colors.text}
                    />
                    <Text style={styles.buttonText}>
                      {t("support.emailButton")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bloc Téléphone */}
            <View style={styles.outterCard}>
              <View style={styles.card}>
                <Text style={styles.title}>{t("support.phoneTitle")}</Text>
                <Text style={styles.text}>{t("support.phoneDesc")}</Text>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#a5f8c4" }]}
                  onPress={openPhone}
                >
                  <View style={styles.buttonContent}>
                    <AntDesign
                      name="phone"
                      size={20}
                      color={theme.colors.text}
                    />
                    <Text style={styles.buttonText}>
                      {t("support.phoneButton")}
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
  scrollContainer: {
    paddingTop: 90,
    paddingBottom: 60,
  },
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
  card: {
    padding: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: theme.colors.muted,
    margin: 5,
    borderRadius: 10,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 10,
  },
  text: {
    color: theme.colors.muted,
    marginBottom: 18,
    lineHeight: 22,
    fontSize: 15,
    fontWeight: "300",
  },
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.muted,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: theme.colors.text,
    fontWeight: "400",
    fontSize: 16,
    marginLeft: 10,
  },
  outterCard: {
    marginHorizontal: 10,
    marginBottom: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
