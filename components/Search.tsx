import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { theme } from "@/constants/theme";

const Search = ({ onSelect }: { onSelect?: (place: any) => void }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const searchPlaces = async (text: string) => {
    setQuery(text);
    if (text.length < 3) {
      setResults([]);
      return;
    }

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
        text
      )}&limit=5&countrycodes=be`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "TaxiLuxeApp/1.0 (hamza@example.com)",
        },
      });

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Erreur recherche:", err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={searchPlaces}
        placeholder="Où voulez-vous aller en Belgique ?"
        placeholderTextColor={theme.colors.muted}
        style={styles.input}
      />

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => {
                setResults([]);
                setQuery(item.display_name);
                onSelect?.(item);
              }}
            >
              <Text style={styles.resultText}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    color: theme.colors.text,
  },
  resultItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultText: {
    fontSize: 14,
    color: theme.colors.text,
  },
});

export default Search;
