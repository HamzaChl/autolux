// components/HistoryModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { theme } from "@/constants/theme";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { API_URL } from "@/config/api";

type Ride = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: string;
};

export default function HistoryModal() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState<Ride[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/payment/history`);
      const data = await res.json();
      setRides(data.reverse());
    } catch (err) {
      console.error("Erreur récupération historique:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchHistory();
    }
  }, [visible]);

  return (
    <>
      {/* Bouton à importer dans le header */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setVisible(true)}
      >
        <AntDesign name="clockcircleo" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
        onSwipeComplete={() => setVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t("history.title")}</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <AntDesign name="close" size={26} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Contenu */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : rides.length === 0 ? (
              <Text style={styles.text}>{t("history.empty")}</Text>
            ) : (
              rides.slice(0, visibleCount).map((ride) => (
                <View key={ride.id} style={styles.rideCard}>
                  <AntDesign name="car" size={20} color={theme.colors.text} />
                  <View style={styles.rideInfo}>
                    <Text style={styles.rideText}>
                      {new Date(ride.created).toLocaleDateString()} •{" "}
                      {(ride.amount / 100).toFixed(2)}{" "}
                      {ride.currency.toUpperCase()}
                    </Text>
                    <Text
                      style={[
                        styles.status,
                        {
                          color:
                            ride.status === "succeeded"
                              ? "green"
                              : ride.status === "processing"
                              ? "orange"
                              : "red",
                        },
                      ]}
                    >
                      {ride.status}
                    </Text>
                  </View>
                </View>
              ))
            )}

            {rides.length > visibleCount && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={() => setVisibleCount((prev) => prev + 4)}
              >
                <Text style={styles.loadMoreText}>{t("history.loadMore")}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    height: "90%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "600",
  },
  scrollContainer: {
    paddingBottom: 60,
    paddingTop: 10,
  },
  text: {
    color: theme.colors.muted,
    fontSize: 15,
    marginBottom: 15,
  },
  rideCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    borderBottomWidth: 1,
    borderColor: theme.colors.muted,
    paddingBottom: 10,
  },
  rideInfo: {
    marginLeft: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rideText: {
    fontSize: 16,
    color: "#333",
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
  },
  loadMoreButton: {
    marginTop: 15,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.muted,
    alignItems: "center",
  },
  loadMoreText: {
    fontSize: 15,
    fontWeight: "500",
    color: theme.colors.text,
  },
});
