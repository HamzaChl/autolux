import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export default function ProfileOptions2() {
  const router = useRouter();
  const { t } = useTranslation();

  const options = [
    {
      id: 1,
      title: t("profile.support"),
      icon: "customerservice",
      route: "/profile/support" as const,
    },
    {
      id: 2,
      title: t("profile.about"),
      icon: "exclamationcircleo",
      route: "/profile/about" as const,
    },
  ];

  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          style={styles.item}
          onPress={() => router.push(opt.route)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 10,
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
});
