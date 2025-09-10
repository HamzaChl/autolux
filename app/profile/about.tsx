import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "@/constants/theme";

export default function AboutScreen() {
  const router = useRouter();

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
              <Text style={styles.backText}>Retour</Text>
            </TouchableOpacity>

            <View style={styles.outterCard}>
              <View style={styles.card}>
                <Text style={styles.title}>À propos de Taxis Autolux</Text>
                <Text style={styles.text}>
                  Avec Taxis Autolux, commander un taxi n’a jamais été aussi
                  simple, rapide et convivial. Disponible 24h/24 et 7j/7, votre
                  taxi est toujours à portée de main, et en moyenne à 5 minutes
                  seulement de votre position.
                </Text>
                <Text style={styles.text}>
                  Dès l’ouverture de l’application, vous pouvez effectuer une
                  commande en quelques clics. Une fois votre demande validée,
                  vous suivez en temps réel l’approche de votre chauffeur. Vous
                  visualisez immédiatement :
                </Text>
                <Text style={styles.text}>
                  -le nom et la photo de votre chauffeur, -le véhicule qui
                  viendra vous chercher, -ainsi que sa plaque d’immatriculation.
                </Text>
                <Text style={styles.text}>
                  Vous pouvez communiquer directement avec le chauffeur via un
                  message intégré, obtenir une estimation du prix et de la durée
                  du trajet, ou encore choisir de planifier une réservation à
                  l’avance. Une fois le trajet terminé, vous avez la possibilité
                  d’évaluer votre chauffeur et de partager votre expérience pour
                  contribuer à l’amélioration continue de notre service.
                </Text>
                <Text style={styles.text}>
                  Grâce à son intégration au réseau taxi.eu, l’application Taxis
                  Autolux vous accompagne dans plus de 100 villes européennes.
                  Où que vous soyez, vous bénéficiez de la même simplicité et de
                  la même fiabilité.
                </Text>
                <Text style={styles.text}>
                  Enfin, votre carnet de bord personnalisé conserve l’historique
                  de toutes vos commandes, ainsi que vos reçus dématérialisés,
                  accessibles à tout moment.
                </Text>
              </View>
            </View>
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
  card: {
    padding: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: theme.colors.muted,
    margin: 5,
    borderRadius: 10,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "400",
    marginBottom: 10,
  },
  text: {
    color: theme.colors.muted,
    marginBottom: 18,
    lineHeight: 22,
    fontSize: 15,
    fontWeight: "300",
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  outterCard: {
    marginHorizontal: 10,
    marginBottom: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
