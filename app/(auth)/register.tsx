import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { theme } from "@/constants/theme";
import { API_URL } from "@/config/api";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import Back from "@/components/Back";

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Erreur", "Tous les champs sont requis");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Erreur", data.error || "Inscription échouée");
        return;
      }

      await SecureStore.setItemAsync("token", data.token);

      Alert.alert("Succès", "Compte créé avec succès !");
      router.replace("/(tabs)/home");
    } catch (err) {
      console.error("Erreur frontend register:", err);
      Alert.alert("Erreur", "Impossible de créer le compte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.backContainer}>
            <Back></Back>
          </View>

          <Text style={styles.title}>Connexion TaxiLuxe</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.colors.muted}
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor={theme.colors.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  centerBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  formContainer: {
    borderRadius: 18,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    width: "100%",
    maxWidth: 380,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    color: "#fff",
    marginBottom: 12,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: {
    color: theme.colors.muted,
    fontSize: 14,
    textAlign: "center",
    marginTop: 15,
  },
});
