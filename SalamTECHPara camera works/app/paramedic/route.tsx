import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useState } from "react";

export default function Route() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { patientName, latitude, longitude, onComplete } = params;
  const [showDirections, setShowDirections] = useState(false);

  const patientLocation = {
    latitude: parseFloat(latitude as string),
    longitude: parseFloat(longitude as string),
  };

  const currentLocation = {
    latitude: 25.2869,
    longitude: 51.5353,
  };

  const directions = [
    "Head north on Al Corniche St",
    "Turn right onto Majlis Al Taawon St",
    "Continue for 2.5 km",
    "Destination will be on your right"
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            if (onComplete) {
              // @ts-ignore
              onComplete();
            }
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Route to {patientName}</Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          ...patientLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={currentLocation}
          pinColor="blue"
          title="Your Location"
        />
        <Marker
          coordinate={patientLocation}
          pinColor="red"
          title={patientName as string}
        />
        <Polyline
          coordinates={[currentLocation, patientLocation]}
          strokeColor="#FF3B30"
          strokeWidth={3}
        />
      </MapView>

      <View style={styles.bottomContainer}>
        <View style={styles.routeInfo}>
          <View style={styles.timeInfo}>
            <Ionicons name="time-outline" size={24} color="#666" />
            <Text style={styles.routeText}>Estimated arrival: 5 mins</Text>
          </View>
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => setShowDirections(!showDirections)}
          >
            <Ionicons name="navigate" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {showDirections && (
          <View style={styles.directionsContainer}>
            {directions.map((direction, index) => (
              <View key={index} style={styles.directionItem}>
                <Ionicons name="arrow-forward" size={20} color="#666" />
                <Text style={styles.directionText}>{direction}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF3B30',
    padding: 20,
    paddingTop: 60,
    zIndex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionsButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
  },
  directionsContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  directionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  directionText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  routeText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
}); 