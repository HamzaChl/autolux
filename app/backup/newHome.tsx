// app/(tabs)/home.tsx
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
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Location from "expo-location";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import ServicesBox from "@/components/ServicesBox";
import { API_URL } from "@/config/api";
import React from "react";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient"; // ✅ import gradient
import Payment from "@/components/Payment";
import { useTranslation } from "react-i18next";
import "../../i18n";
import Airports from "@/components/Airports";

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

  const mapRef = useRef<MapView>(null);

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
      style={{ flex: 1, backgroundColor: theme.colors.background }} // ✅ fond noir global
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ✅ dégradé */}
          <View style={styles.redBackground}>
            <LinearGradient
              colors={["rgba(153,124,73,1)", "transparent"]} // dégradé rouge semi-transparent → transparent
              style={StyleSheet.absoluteFillObject}
            />
          </View>

          <View style={styles.formWrapper}>
            <BlurView intensity={50} tint="dark" style={styles.formContainer}>
              <Text style={styles.title}>{t("home.title")}</Text>

              {/* Input destination */}
              <View style={styles.inputWrapper}>
                <AntDesign
                  name="search1"
                  size={18}
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

              {/* Bouton recherche */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => setShowModal(true)}
              >
                <Text style={styles.buttonText}>{t("home.findRide")}</Text>
              </TouchableOpacity>
            </BlurView>
          </View>

          {/* Section favoris */}
          <View style={styles.favContainer}>
            <TouchableOpacity
              style={styles.favItem}
              onPress={() => setDropoff("Maison")}
            >
              <FontAwesome
                name="home"
                size={18}
                color={theme.colors.invertText}
              />
              <Text style={styles.favText}>Maison</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.favItem}
              onPress={() => setDropoff("Travail")}
            >
              <FontAwesome
                name="briefcase"
                size={18}
                color={theme.colors.invertText}
              />
              <Text style={styles.favText}>Travail</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.favItem}
              onPress={() => setDropoff("Autre")}
            >
              <FontAwesome
                name="bookmark-o"
                size={18}
                color={theme.colors.invertText}
              />
              <Text style={styles.favText}>Autre</Text>
            </TouchableOpacity>
          </View>

          <Airports />
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Modal recherche */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {t("home.title")}
            </Text>

            <View style={styles.inputWrapper}>
              <AntDesign
                name="enviromento"
                size={20}
                color={theme.colors.text}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder={t("home.pickup")}
                placeholderTextColor="#999"
                value={pickup}
                onChangeText={setPickup}
              />
            </View>

            <View style={styles.inputWrapper}>
              <AntDesign
                name="flag"
                size={20}
                color={theme.colors.text}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder={t("home.dropoff")}
                placeholderTextColor="#999"
                value={dropoff}
                onChangeText={setDropoff}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setShowModal(false);
                handleFindDrivers();
              }}
            >
              <Text style={styles.buttonText}>
                {t("home.findRide", "Rechercher")}
              </Text>
            </TouchableOpacity>

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
    top: -200,
    left: 0,
    right: 0,
    height: "90%",
    backgroundColor: theme.colors.tabsColor, // ✅ fond noir
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
  title: { color: "#fff", fontSize: 21, fontWeight: 300, marginBottom: 18 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  inputIcon: { marginRight: 8, opacity: 0.6 },
  input: { flex: 1, color: "#fff", paddingVertical: 12 },
  button: {
    backgroundColor: theme.colors.accent,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: { color: "#fff", fontWeight: 400, fontSize: 16 },
  favContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginTop: 20,
  },
  favItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.tabsColor,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  favText: {
    marginLeft: 6,
    color: theme.colors.invertText,
    fontSize: 14,
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
});
