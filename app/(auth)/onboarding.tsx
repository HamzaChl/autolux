import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Page</Text>
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
  text: { fontSize: 20, color: theme.colors.text },
});
