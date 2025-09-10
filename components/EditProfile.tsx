import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/config/api";
import { theme } from "@/constants/theme";
import { useTranslation } from "react-i18next";

type EditProfileProps = {
  user: { firstName: string; lastName: string; email: string };
  onUpdated: (updatedUser: any) => void;
};

export default function EditProfile({ user, onUpdated }: EditProfileProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);

  const handleUpdate = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName, email }),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Erreur", data.message || "Mise à jour échouée");
        return;
      }

      onUpdated(data); // ✅ renvoyer le user mis à jour
      Alert.alert("✅ Succès", "Profil mis à jour");
      setVisible(false);
    } catch (err) {
      Alert.alert("Erreur", "Impossible de mettre à jour le profil");
    }
  };

  return (
    <>
      {/* Bouton */}
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>{t("misc.edit")}</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
        onSwipeComplete={() => setVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.title}>Modifier mon profil</Text>

          <TextInput
            style={styles.input}
            placeholder="Prénom"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
            <Text style={styles.saveText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    marginHorizontal: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "70%",
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 10,
    color: "#000",
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
