// app/_layout.tsx
import { Stack, useRouter } from "expo-router";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { theme } from "@/constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { API_URL } from "@/config/api";
import { StripeProvider } from "@stripe/stripe-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";
import HistoryModal from "./(modals)/history";

type User = {
  firstName: string;
  lastName: string;
  avatarColor: string;
};

export default function RootLayout() {
  return (
    <StripeProvider
      publishableKey="pk_test_51S4OfYFG8hG493BVAr5jl2OTaZjhQevhSGqkwXCeGwXaLgwHce9HF0TxcASkPRX2LdZSNWlvtj8G0rTDBhZOeVU800KTIErKxH"
      merchantIdentifier="test.mills-production.be"
      urlScheme="autolux"
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            header: () => <CustomHeader />,
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="(modals)"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          {/* ⛔ PAS de "history" ici → géré par (modals) */}
        </Stack>
      </GestureHandlerRootView>
    </StripeProvider>
  );
}

function CustomHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<string>("Chargement...");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (!token) return;

        const response = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
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

  // 📍 Récupérer l'adresse actuelle
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Permission localisation refusée");
          setAddress("Localisation désactivée");
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        let geo = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (geo.length > 0) {
          const place = geo[0];
          const addr = `${place.name || ""} ${place.street || ""}, ${
            place.city || ""
          }`;
          setAddress(addr.trim() || "Adresse introuvable");
        }
      } catch (err) {
        console.error("Erreur localisation:", err);
        setAddress("Adresse introuvable");
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={["rgba(0,0,0,0.95)", "transparent"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.header}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={["rgba(0,0,0,0.95)", "transparent"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.header}>
          <Text style={{ color: "red" }}>Erreur utilisateur</Text>
        </View>
      </View>
    );
  }

  const initials =
    (user.firstName?.charAt(0).toUpperCase() || "?") +
    (user.lastName?.charAt(0).toUpperCase() || "?");

  return (
    <View style={styles.headerWrapper}>
      <LinearGradient
        colors={["rgba(0,0,0,0.95)", "transparent"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.header}>
        {/* Avatar gauche */}
        <Pressable
          style={styles.userContainer}
          onPress={() => router.push("/profile")}
        >
          <View style={[styles.avatar, { backgroundColor: user.avatarColor }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </Pressable>

        <View style={styles.addressBox}>
          <Text style={styles.addressText} numberOfLines={1}>
            {address}
          </Text>
        </View>

        <HistoryModal></HistoryModal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    height: 130,
    zIndex: 4,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: "transparent",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  addressBox: {
    flex: 1,
    marginHorizontal: 45,
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addressText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  historyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
});
