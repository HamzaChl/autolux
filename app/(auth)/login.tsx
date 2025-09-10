import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { theme } from "@/constants/theme";
import { API_URL } from "@/config/api";
import Back from "@/components/Back";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t("login.errorTitle"), t("login.errorFields"));
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          t("login.errorTitle"),
          data.message || t("login.errorDefault")
        );
        return;
      }

      await SecureStore.setItemAsync("token", data.token);
      router.replace("/(tabs)/home");
    } catch (err) {
      Alert.alert(t("login.errorTitle"), t("login.errorServer"));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Bouton retour */}
        <View style={styles.backContainer}>
          <Back />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{t("login.title")}</Text>
          <Text style={styles.subtitle}>{t("login.subtitle")}</Text>
        </View>

        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder={t("login.email")}
          placeholderTextColor={theme.colors.muted}
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Password avec œil */}
        <View style={styles.passwordWrapper}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
            placeholder={t("login.password")}
            placeholderTextColor={theme.colors.muted}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <AntDesign
              name={showPassword ? "eye" : "eyeo"}
              size={20}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>{t("login.forgotPassword")}</Text>
        </TouchableOpacity>

        {/* <View style={styles.keepSignedIn}>
            <Switch
              value={keepSignedIn}
              onValueChange={setKeepSignedIn}
              thumbColor={keepSignedIn ? theme.colors.primary : "#ccc"}
            />
            <Text style={styles.keepSignedText}>{t("login.keepSignedIn")}</Text>
          </View> */}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>{t("login.loginButton")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          style={styles.createAccount}
        >
          <Text style={styles.createText}>{t("login.createAccount")}</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
  backContainer: {
    position: "absolute",
    top: 80,
    left: 20,
    zIndex: 10,
  },

  textContainer: {
    position: "absolute",
    top: 200,
    left: 20,
  },
  titleText: {
    color: theme.colors.text,
    fontWeight: "300",
    fontSize: 40,
    marginBottom: 30,
    textAlign: "left",
    paddingHorizontal: 0,
  },
  subtitle: {
    color: theme.colors.text,
    opacity: 0.6,
    textAlign: "left",
    marginBottom: 125,
    fontWeight: "300",
    fontSize: 17,
  },
  input: {
    height: 50,
    borderColor: theme.colors.muted,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: theme.colors.muted,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  eyeButton: {
    paddingHorizontal: 8,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  forgotText: {
    color: theme.colors.primary,
    fontSize: 14,
    marginBottom: 20,
  },
  keepSignedIn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  keepSignedText: {
    marginLeft: 10,
    color: theme.colors.text,
    fontSize: 14,
  },
  button: {
    backgroundColor: theme.colors.tabsColor,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  createAccount: {
    marginTop: 20,
    alignItems: "center",
  },
  createText: {
    color: theme.colors.primary,
    fontSize: 15,
  },
});
