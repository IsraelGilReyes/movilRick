import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { Character } from "../../domain/entities/Character";
import { GetCharacters } from "../../application/useCases/GetCharacters";
import { CharacterRepositoryImpl } from "../../infrastructure/repositories/CharacterRepositoryImpl";
import CharacterCard from "../components/CharacterCard";

export default function CharactersScreen() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCharacters = async () => {
    try {
      const characterRepository = new CharacterRepositoryImpl();
      const charactersUseCase = new GetCharacters(characterRepository);

      const result = await charactersUseCase.execute();
      setCharacters(result);
    } catch (error) {
      console.error("No se pudieron cargar los personajes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#39FF14"
        />

        <Text style={styles.loadingText}>
          Cargando personajes...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.heading}>Rick and Morty</Text>

        <Text style={styles.sectionTitle}>
          Personajes
        </Text>

        <View style={styles.line} />
      </View>

      <FlatList
        data={characters}
        keyExtractor={(character) => String(character.id)}
        renderItem={({ item }) => (
          <CharacterCard character={item} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 25,
  },

  header: {
    marginBottom: 15,
  },

  heading: {
    fontSize: 30,
    fontWeight: "900",
    color: "#20B800",
    letterSpacing: 0.5,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#D4A900",
    marginTop: 4,
  },

  line: {
    width: 75,
    height: 4,
    borderRadius: 5,
    backgroundColor: "#39FF14",
    marginTop: 8,
  },

  list: {
    paddingBottom: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#20B800",
  },
});

