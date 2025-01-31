import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { Patient } from './types';

interface MapComponentProps {
  patients: Patient[];
  onPinPress: (patientId: string) => void;
  getMarkerColor: (status: string) => string;
}

export default function MapComponent({ patients, onPinPress, getMarkerColor }: MapComponentProps) {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 25.2869,
        longitude: 51.5353,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
      minZoomLevel={16}
      maxZoomLevel={20}
    >
      {patients.map((patient) => (
        <Marker
          key={patient.id}
          coordinate={patient.coordinates}
          pinColor={getMarkerColor(patient.status)}
        >
          <Callout
            onPress={() => onPinPress(patient.id)}
            style={styles.calloutContainer}
          >
            <View style={styles.calloutContent}>
              <View style={[styles.statusBadge, { backgroundColor: getMarkerColor(patient.status) }]}>
                <Text style={styles.statusText}>
                  {patient.status === "needAssist" ? "Needs Assist" : 
                   patient.status === "critical" ? "Critical" : "Stable"}
                </Text>
              </View>
              <Text style={styles.calloutTitle}>{patient.name}</Text>
              <Text style={styles.calloutAge}>{patient.age} years old</Text>
              <Text style={styles.calloutDistance}>{patient.distance.toFixed(1)} km away</Text>
              <View style={styles.calloutButton}>
                <Ionicons name="information-circle-outline" size={20} color="white" />
                <Text style={styles.calloutButtonText}>More Info</Text>
              </View>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  calloutContainer: {
    width: 200,
    padding: 10,
  },
  calloutContent: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 5,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  calloutAge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  calloutDistance: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  calloutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 15,
    alignItems: 'center',
  },
  calloutButtonText: {
    color: 'white',
    marginLeft: 5,
  },
}); 