import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { t } from "i18next";

const Back = () => {
  return (
    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <AntDesign name="arrowleft" size={20} color={theme.colors.text} />
      <Text style={styles.backText}>{t("misc.back")}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backText: { marginLeft: 8, fontSize: 16, color: theme.colors.text },
});

export default Back;
