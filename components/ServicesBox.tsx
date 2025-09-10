import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "@/constants/theme";

export default function ServicesBox() {
  const services = [
    { id: 1, name: "Taxi", icon: "car" },
    { id: 2, name: "Livraison", icon: "dropbox" },
    { id: 3, name: "VIP", icon: "staro" },
    { id: 4, name: "Navette", icon: "rocket1" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Services</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {services.map((service) => (
          <TouchableOpacity key={service.id} style={styles.card}>
            <AntDesign
              name={service.icon as any}
              size={30}
              color={theme.colors.text}
            />
            <Text style={styles.cardText}>{service.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderColor: "#ffffff85",
    borderRadius: 12,
    backgroundColor: theme.colors.card,
    padding: 15,
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  scrollContent: {
    paddingRight: 10,
  },
  card: {
    width: 130,
    height: 100,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardText: {
    color: theme.colors.text,
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },
});
