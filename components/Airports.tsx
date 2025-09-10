import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "@/constants/theme";

const { width } = Dimensions.get("window");

type Airport = {
  code: string;
  name: string;
  image: any;
  coords: { lat: number; lng: number };
};

const airports: Airport[] = [
  {
    code: "BRU",
    name: "Brussels Airport",
    image: require("@/assets/images/airports/bru.jpg"),
    coords: { lat: 50.901, lng: 4.484 },
  },
  {
    code: "CRL",
    name: "Brussels South Charleroi",
    image: require("@/assets/images/airports/crl.jpg"),
    coords: { lat: 50.459, lng: 4.453 },
  },
  {
    code: "LGG",
    name: "Liège Airport",
    image: require("@/assets/images/airports/lgg.jpg"),
    coords: { lat: 50.637, lng: 5.443 },
  },
  {
    code: "ANR",
    name: "Antwerp Airport",
    image: require("@/assets/images/airports/anr.jpg"),
    coords: { lat: 51.189, lng: 4.46 },
  },
  {
    code: "OST",
    name: "Ostend-Bruges Airport",
    image: require("@/assets/images/airports/ost.jpg"),
    coords: { lat: 51.199, lng: 2.862 },
  },
];

const getDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function AirportsBox() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let loc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        });
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Airports</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {airports.map((airport) => {
          const distance = userLocation
            ? getDistanceKm(
                userLocation.lat,
                userLocation.lng,
                airport.coords.lat,
                airport.coords.lng
              ).toFixed(1)
            : "…";

          return (
            <View key={airport.code} style={styles.card}>
              <Image source={airport.image} style={styles.image} />

              <Text style={styles.airportName}>{airport.name}</Text>
              <Text style={styles.airportCode}>{airport.code}</Text>

              <View style={styles.distanceRow}>
                <AntDesign
                  name="enviromento"
                  size={14}
                  color={theme.colors.muted}
                />
                <Text style={styles.distanceText}>{distance} km</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderColor: theme.colors.muted,
    borderRadius: 12,
    backgroundColor: theme.colors.card,
    padding: 15,
  },
  title: { color: "#000", fontSize: 22, fontWeight: 300, marginBottom: 18 },

  scrollContent: {
    paddingRight: 10,
  },
  card: {
    width: width * 0.6,
    height: 200,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    marginRight: 12,
    padding: 10,
    borderWidth: 0.5,
    borderColor: theme.colors.muted,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  airportName: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "400",
  },
  airportCode: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    marginLeft: 4,
    color: theme.colors.muted,
    fontSize: 12,
  },
});
