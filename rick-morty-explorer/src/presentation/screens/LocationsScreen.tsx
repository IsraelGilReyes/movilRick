import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { Location } from "../../domain/entities/Location";
import { GetLocations } from "../../application/useCases/GetLocations";
import { LocationRepositoryImpl } from "../../infrastructure/repositories/LocationRepositoryImpl";
import LocationCard from "../components/LocationCard";

export default function LocationsScreen() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLocations = async () => {
    try {
      const locationRepository = new LocationRepositoryImpl();
      const locationsUseCase = new GetLocations(locationRepository);

      const result = await locationsUseCase.execute();

      setLocations(result);
    } catch (error) {
      console.error("No se pudieron cargar las ubicaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#39FF14"
        />

        <Text style={styles.loadingText}>
          Cargando ubicaciones...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.heading}>
          Rick and Morty
        </Text>

        <Text style={styles.sectionTitle}>
          Ubicaciones
        </Text>

        <View style={styles.line} />
      </View>

      <FlatList
        data={locations}
        keyExtractor={(location) => String(location.id)}
        renderItem={({ item }) => (
          <LocationCard location={item} />
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
