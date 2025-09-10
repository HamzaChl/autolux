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
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import ServicesBox from "@/components/ServicesBox";
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

export default function HomeScreen() {
  const { t } = useTranslation();
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [destination, setDestination] = useState<Coordinates | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [extras, setExtras] = useState<
    { label: string; price: number; selected: boolean }[]
  >([
    { label: "Eau", price: 300, selected: false },
    { label: "Champagne", price: 3000, selected: false },
    { label: "Vito", price: 4000, selected: false },
  ]);

  const mapRef = useRef<MapView>(null);

  const pricePerKm = 153; // en centimes

  const totalAmount = (() => {
    const base = distance ? distance * pricePerKm : 0;
    const extrasTotal = (extras ?? [])
      .filter((e) => e.selected)
      .reduce((sum, e) => sum + e.price, 0);
    return Math.round(base + extrasTotal);
  })();

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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.redBackground} />
          <View style={styles.formWrapper}>
            <BlurView intensity={50} tint="dark" style={styles.formContainer}>
              <Text style={styles.title}>{t("home.title")}</Text>

              {/* Input départ */}
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
                    onChangeText={setPickup}
                  />
                </View>

                {/* Points */}
                <View style={styles.dotsContainer}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>

                {/* Input arrivée */}
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
                    onChangeText={setDropoff}
                  />
                </View>
              </View>

              {/* Bouton recherche */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleFindDrivers}
              >
                <Text style={styles.buttonText}>
                  {t("home.findRide", "Rechercher")}
                </Text>
              </TouchableOpacity>

              {/* Résultats */}
              {distance && duration && (
                <>
                  <View style={styles.resultBox}>
                    <Text style={styles.resultText}>
                      {t("home.distanceDuration", { distance, duration })}
                    </Text>
                    <Text style={styles.resultText}>
                      Prix de base: {((distance * pricePerKm) / 100).toFixed(2)}{" "}
                      €
                    </Text>
                  </View>

                  {/* Bouton continuer */}
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { marginTop: 15, backgroundColor: "#f0ad4e" },
                    ]}
                    onPress={() => setShowModal(true)}
                  >
                    <Text style={styles.buttonText}>Continuer</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Carte */}
              <View style={styles.mapBox}>
                <MapView
                  userInterfaceStyle="light"
                  ref={mapRef}
                  style={styles.miniMap}
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
              </View>
            </BlurView>
          </View>

          <ServicesBox />
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Modal Options */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Options</Text>

            {extras.map((extra, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.extraItem,
                  extra.selected && { backgroundColor: theme.colors.primary },
                ]}
                onPress={() =>
                  setExtras((prev) =>
                    prev.map((e, j) =>
                      j === i ? { ...e, selected: !e.selected } : e
                    )
                  )
                }
              >
                <Text
                  style={[
                    styles.extraText,
                    extra.selected && { color: "#fff" },
                  ]}
                >
                  {extra.label} (+{(extra.price / 100).toFixed(2)} €)
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.totalText}>
              Total: {(totalAmount / 100).toFixed(2)} €
            </Text>

            <Payment amount={totalAmount} currency="eur" />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "red", marginTop: 10 }]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 120, paddingTop: 130 },
  formWrapper: { marginTop: 40, marginHorizontal: 10, position: "relative" },
  redBackground: {
    position: "absolute",
    top: -100,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: theme.colors.tabsColor,
    zIndex: 0,
  },
  formContainer: {
    borderRadius: 18,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    zIndex: 1,
    overflow: "hidden",
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 18 },
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
    marginBottom: 0,
  },
  inputIcon: { marginRight: 8, opacity: 0.5 },
  input: { flex: 1, color: "#fff", paddingVertical: 12 },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
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
  mapBox: {
    borderRadius: 18,
    overflow: "hidden",
    height: 230,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  miniMap: { flex: 1 },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  extraItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 6,
    alignItems: "center",
  },
  extraText: { fontSize: 15, color: "#333" },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
  },
});
