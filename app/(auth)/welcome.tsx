import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/constants/theme";
import { VERSION } from "@/config/api";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ImageBackground
      source={require("@/assets/images/welcome3.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.95)"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.container}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.buttonsContainer}>
          <Text style={styles.titleText}>{t("welcome.title")}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.buttonText}>{t("welcome.login")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.buttonText2}>{t("welcome.create")}</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>{VERSION}</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
  },
  logo: {
    width: 180,
    height: 80,
    marginTop: 40,
    opacity: 0,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    width: "100%",
    backgroundColor: theme.colors.background,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: "rgba(153,124,73,1)",
  },
  buttonText: {
    color: theme.colors.text,
    fontWeight: "400",
    fontSize: 16,
  },
  buttonText2: {
    color: theme.colors.invertText,
    fontWeight: "400",
    fontSize: 16,
  },
  titleText: {
    color: theme.colors.invertText,
    fontWeight: "200",
    fontSize: 40,
    marginBottom: 30,
    textAlign: "left",
    paddingHorizontal: 5,
  },
  footer: {
    fontSize: 13,
    color: "#fff",
    opacity: 0.4,
    textAlign: "center",
    marginTop: 20,
  },
});
