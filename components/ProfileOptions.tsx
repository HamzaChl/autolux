import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export default function ProfileOptions() {
  const { t } = useTranslation();
  const [showLangModal, setShowLangModal] = useState(false);
  const router = useRouter();

  const options = [
    { id: 1, title: t("profile.messages"), icon: "mail" },
    { id: 2, title: t("profile.payment"), icon: "creditcard" },
    { id: 3, title: t("profile.favorites"), icon: "hearto" },
    { id: 4, title: t("profile.promotions"), icon: "tagso" },
    { id: 5, title: t("profile.language"), icon: "earth" },
  ];

  const handlePress = (id: number) => {
    if (id === 2) {
      router.push("/profile/payment-methods");
    } else if (id === 5) {
      setShowLangModal(true);
    } else if (id === 3) {
      router.push("/profile/favorites");
    }
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setShowLangModal(false);
  };

  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          style={styles.item}
          onPress={() => handlePress(opt.id)}
        >
          <View style={styles.itemLeft}>
            <AntDesign
              name={opt.icon as any}
              size={20}
              color={theme.colors.text}
            />
            <Text style={styles.itemText}>{opt.title}</Text>
          </View>
          <AntDesign name="right" size={18} color="#999" />
        </TouchableOpacity>
      ))}

      {/* Modal pour choisir la langue */}
      <Modal
        transparent
        visible={showLangModal}
        animationType="fade"
        onRequestClose={() => setShowLangModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("profile.selectLanguage")}</Text>

            <TouchableOpacity
              style={styles.langButton}
              onPress={() => changeLanguage("fr")}
            >
              <Text style={styles.langText}>Français</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.langButton}
              onPress={() => changeLanguage("en")}
            >
              <Text style={styles.langText}>English</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.langButton}
              onPress={() => changeLanguage("nl")}
            >
              <Text style={styles.langText}>Nederlands</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langButton, { marginTop: 10 }]}
              onPress={() => setShowLangModal(false)}
            >
              <Text style={[styles.langText, { color: "red" }]}>
                {t("profile.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
    padding: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: theme.colors.muted,
    margin: 5,
    borderRadius: 10,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  langButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  langText: {
    fontSize: 16,
    color: "#333",
  },
});
