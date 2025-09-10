import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { API_URL } from "@/config/api";
import React from "react";
import { BlurView } from "expo-blur";
import Payment from "@/components/Payment";
import { useTranslation } from "react-i18next";
import "../../i18n";

type Coordinates = {
  latitude: number;
  longitude: number;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = 150; // ajuste selon ton header

export default function HomeScreen() {
  const { t } = useTranslation();
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [destination, setDestination] = useState<Coordinates | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);

  const pricePerKm = 153; // en centimes

  const animatedHeight = useRef(
    new Animated.Value(SCREEN_HEIGHT * 0.35)
  ).current;
  const [isExpanded, setIsExpanded] = useState(false);

  // Gestion clavier
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardWillShow", (e) => {
      Animated.timing(animatedHeight, {
        toValue: SCREEN_HEIGHT - HEADER_HEIGHT - e.endCoordinates.height,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsExpanded(true));
    });

    const hideSub = Keyboard.addListener("keyboardWillHide", () => {
      collapseSheet();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission localisation refusée");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  const handleFindDrivers = async () => {
    if (!pickup || !dropoff) {
      Alert.alert(t("home.error"), t("home.enterAddresses"));
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup, dropoff }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert(t("home.error"), data.error || t("home.routeError"));
        return;
      }

      const distKm = parseFloat(data.distance.replace(",", "."));
      setDistance(distKm);
      setDuration(data.duration);

      if (data.pickupCoords && data.dropoffCoords) {
        const pickupLatLng = {
          latitude: data.pickupCoords[1],
          longitude: data.pickupCoords[0],
        };
        const dropoffLatLng = {
          latitude: data.dropoffCoords[1],
          longitude: data.dropoffCoords[0],
        };

        setDestination(dropoffLatLng);

        mapRef.current?.fitToCoordinates([pickupLatLng, dropoffLatLng], {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        });
      }
    } catch (err) {
      console.error("Erreur frontend:", err);
      Alert.alert(t("home.error"), t("home.serverError"));
    }
  };

  const collapseSheet = () => {
    Animated.timing(animatedHeight, {
      toValue: SCREEN_HEIGHT * 0.35,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIsExpanded(false));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* MAP plein écran */}
          <MapView
            userInterfaceStyle="light"
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: location?.latitude || 50.8503,
              longitude: location?.longitude || 4.3517,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {location && (
              <Marker
                coordinate={location}
                title={t("home.youAreHere")}
                pinColor={theme.colors.primary}
              />
            )}
            {destination && (
              <Marker
                coordinate={destination}
                title={t("home.destination")}
                pinColor="blue"
              />
            )}
          </MapView>

          <Animated.View
            style={[styles.bottomContainer, { height: animatedHeight }]}
          >
            <BlurView intensity={50} tint="dark" style={styles.sheetContent}>
              <View style={styles.header}>
                <Text style={styles.title}></Text>
                {isExpanded && (
                  <TouchableOpacity onPress={collapseSheet}>
                    <AntDesign name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.innerBox}>
                <View style={styles.inputWrapper}>
                  <AntDesign
                    name="enviromento"
                    size={20}
                    color="#fff"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={t("home.pickup")}
                    placeholderTextColor="#ccc"
                    value={pickup}
                    onFocus={() => setIsExpanded(true)}
                    onChangeText={setPickup}
                  />
                </View>

                <View style={styles.dotsContainer}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>

                <View style={styles.inputWrapper}>
                  <AntDesign
                    name="flag"
                    size={20}
                    color="#fff"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={t("home.dropoff")}
                    placeholderTextColor="#ccc"
                    value={dropoff}
                    onFocus={() => setIsExpanded(true)}
                    onChangeText={setDropoff}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleFindDrivers}
              >
                <Text style={styles.buttonText}>
                  {t("home.findRide", "Rechercher")}
                </Text>
              </TouchableOpacity>

              {distance && duration && (
                <View style={styles.resultBox}>
                  <Text style={styles.resultText}>
                    {t("home.distanceDuration", { distance, duration })}
                  </Text>
                  <Text style={styles.resultText}>
                    Prix de base: {((distance * pricePerKm) / 100).toFixed(2)} €
                  </Text>
                  <Payment amount={distance * pricePerKm} currency="eur" />
                </View>
              )}
            </BlurView>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
  },
  sheetContent: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(0,0,0,1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  innerBox: {
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 15,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  inputIcon: { marginRight: 8, opacity: 0.5 },
  input: { flex: 1, color: "#fff", paddingVertical: 12 },
  button: {
    backgroundColor: theme.colors.card,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: theme.colors.text, fontWeight: 500, fontSize: 16 },
  resultBox: {
    marginTop: 15,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  resultText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  dotsContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginVertical: 6,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 3,
    backgroundColor: theme.colors.muted,
    marginVertical: 3,
  },
});
