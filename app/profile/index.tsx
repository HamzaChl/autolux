import { theme } from "@/constants/theme";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { API_URL, VERSION } from "@/config/api";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import ProfileOptions from "@/components/ProfileOptions";
import ProfileOptions2 from "@/components/ProfileOptions2";
import { BlurView } from "expo-blur";
import EditProfile from "@/components/EditProfile";
import { useTranslation } from "react-i18next";

type User = {
  firstName: string;
  lastName: string;
  avatarColor: string;
  email: string;
};

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (!token) return;

        const response = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur de récupération utilisateur");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert(t("profile.logoutTitle"), t("profile.logoutConfirm"), [
      { text: t("profile.cancel"), style: "cancel" },
      {
        text: t("profile.logout"),
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("token");
          router.replace("/(auth)/welcome");
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <AntDesign name="arrowleft" size={20} color={theme.colors.text} />
              <Text style={styles.backText}>{t("misc.back")}</Text>
            </TouchableOpacity>
            <BlurView intensity={50} tint="dark" style={styles.formContainer}>
              {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
              ) : user ? (
                <>
                  <Text style={styles.subTitle}>{t("profile.hello")}</Text>
                  <View style={styles.userRow}>
                    <Text style={styles.title}>
                      {user.firstName} {user.lastName}
                    </Text>
                    <View
                      style={[
                        styles.avatar,
                        { backgroundColor: user.avatarColor },
                      ]}
                    >
                      <Text style={styles.avatarText}>
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </Text>
                    </View>
                  </View>

                  <EditProfile user={user} onUpdated={setUser} />
                </>
              ) : (
                <Text style={{ color: "red" }}>
                  {t("profile.userNotFound")}
                </Text>
              )}
            </BlurView>

            <ProfileOptions />
            <ProfileOptions2 />

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>{t("profile.logout")}</Text>
            </TouchableOpacity>
            <Text style={styles.footer}>{VERSION}</Text>
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
  formContainer: {
    marginHorizontal: 10,
    borderRadius: 18,
    padding: 20,
    backgroundColor: theme.colors.tabsColor,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    filter: "blur(0)",
    zIndex: 1,
    overflow: "hidden",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  subTitle: {
    color: theme.colors.muted,
    fontSize: 15,
    fontWeight: "300",
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    top: 20,
    fontSize: 13,
    color: "#000",
    opacity: 0.2,
    textAlign: "center",
  },
});
