import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenue dans TaxiLuxe 🚖</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  text: { fontSize: 22, color: theme.colors.text },
});
