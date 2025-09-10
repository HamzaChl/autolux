import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import "../i18n";
import "react-native-reanimated";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("token");

      if (token) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/welcome");
      }
    };

    checkAuth();
  }, []);

  return null;
}
