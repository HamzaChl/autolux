import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { theme } from "@/constants/theme";
import { BlurView } from "expo-blur";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: theme.colors.active,
          tabBarInactiveTintColor: theme.colors.inactive,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "400",
          },
          tabBarStyle: {
            display: "none",
            height: 110,
            position: "absolute",
            paddingTop: 20,
            left: 20,
            right: 20,
            borderRadius: 25,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowOffset: { width: 0, height: -3 },
            shadowRadius: 10,
            elevation: 6,
            paddingBottom: Platform.OS === "ios" ? 25 : 10,
            borderWidth: 1,
            borderColor: "#000",
            overflow: "hidden",
            backgroundColor: "rgba(0,0,0,0.1)",
          },
          tabBarBackground: () => (
            <BlurView
              intensity={80}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Accueil",
            tabBarIcon: ({ color }) => (
              <AntDesign name="home" size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Réglages",
            tabBarIcon: ({ color }) => (
              <AntDesign name="setting" size={26} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

function CustomHeader() {
  return (
    <View style={styles.header}>
      <Pressable
        style={styles.iconButton}
        onPress={() => alert("Notifications")}
      >
        <AntDesign name="bells" size={24} color={theme.colors.text} />
      </Pressable>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Taxi</Text>
        <Text style={styles.titleAccent}>Luxe</Text>
      </View>

      <Pressable style={styles.iconButton} onPress={() => alert("Paramètres")}>
        <AntDesign name="setting" size={24} color={theme.colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  titleAccent: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginLeft: 5,
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
});
