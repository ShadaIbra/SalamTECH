import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { Patient } from './types';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface MapComponentProps {
  onPinPress: (patientId: string) => void;
}

// Add this function to assess and update triage color
const assessAndUpdateTriageColor = async (emergency: any) => {
  if (!emergency.medicalAssessment) return;
  
  const ma = emergency.medicalAssessment;
  let triageColor = 'green'; // default color

  // RED conditions (highest priority)
  if (
    ma.breathing === false || 
    ma.seizure === 'current' || 
    ma.burn === 'face' || 
    ma.cardiacArrest === true
  ) {
    triageColor = 'red';
  }
  // ORANGE conditions
  else if (
    ma.breathing === 'acute' ||
    ma.seizure === 'post' ||
    ma.burn === 'electrical' ||
    ma.burn === 'chemical' ||
    ma.fever === true ||
    ma.dislocation === 'largeJoint' ||
    ma.fracture === 'compound' ||
    ma.haemorrhage === 'uncontrolled' ||
    ma.vomitingBlood === true ||
    ma.coughingBlood === true ||
    ma.someUnconsciousness === true ||
    ma.chestPain === true ||
    ma.stabbedNeck === true ||
    ma.facialDropping === true ||
    ma.aggression === true ||
    ma.eyeInjury === true ||
    ma.poisoningOverdose === true ||
    ma.limbCyanosis === true ||
    ma.pregnant === true ||
    ma.scalePain === 'severe'
  ) {
    triageColor = 'orange';
  }
  // YELLOW conditions
  else if (
    ma.burn === 'other' ||
    ma.dislocation === 'fingerToe' ||
    ma.fracture === 'closed' ||
    ma.haemorrhage === 'controlled' ||
    ma.vomitingPersistent === true ||
    ma.scalePain === 'moderate'
  ) {
    triageColor = 'yellow';
  }

  // Update the emergency document if triage color has changed
  if (emergency.triageColor !== triageColor) {
    try {
      await updateDoc(doc(db, 'emergencies', emergency.id), {
        triageColor: triageColor
      });
    } catch (error) {
      console.error('Error updating triage color:', error);
    }
  }

  return triageColor;
};

export default function MapComponent({ onPinPress }: Omit<MapComponentProps, 'getMarkerColor'>) {
  const [emergencies, setEmergencies] = useState<any[]>([]);

  const getMarkerColor = (triageColor: string) => {
    switch (triageColor) {
      case "red": return "red";
      case "orange": return "orange";
      case "yellow": return "#FFD700";
      case "green": return "green";
      default: return "blue";
    }
  };

  // Update the useEffect to include triage assessment
  useEffect(() => {
    console.log('Attempting to connect to Firestore collection: emergencies');
    const unsubscribe = onSnapshot(collection(db, 'emergencies'), async (snapshot) => {
      console.log('Raw snapshot data:', snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const emergencyData = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = {
          id: doc.id,
          ...doc.data()
        };
        console.log('Emergency data:', data); // Check if latitude/longitude exist
        await assessAndUpdateTriageColor(data);
        return data;
      }));
      setEmergencies(emergencyData);
    });

    return () => unsubscribe();
  }, []);

  // Add this to check if markers should render
  console.log('Current emergencies:', emergencies);

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 25.3139,
        longitude: 51.4374,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      minZoomLevel={10}
      maxZoomLevel={20}
    >
      {emergencies.map((emergency) => {
        console.log('Rendering marker for:', emergency.id, emergency.location?.latitude, emergency.location?.longitude);
        if (!emergency.location?.latitude || !emergency.location?.longitude) return null;
        
        return (
          <Marker
            key={emergency.id}
            coordinate={{
              latitude: emergency.location.latitude,
              longitude: emergency.location.longitude
            }}
            pinColor={getMarkerColor(emergency.triageColor || 'green')}
          >
            <Callout
              onPress={() => onPinPress(emergency.id)}
              style={styles.calloutContainer}
            >
              <View style={styles.calloutContent}>
                <View style={[styles.statusBadge, { backgroundColor: getMarkerColor(emergency.triageColor || 'green') }]}>
                  <Text style={styles.statusText}>
                    {emergency.triageColor === 'red' ? 'Red' : emergency.triageColor === 'orange' ? 'Orange' : emergency.triageColor === 'yellow' ? 'Yellow' : 'Green'}
                  </Text>
                </View>
                <Text style={styles.calloutTitle}>{emergency.name || 'Unknown'}</Text>
                <Text style={styles.calloutAge}>{emergency.age || 'N/A'} years old</Text>
                <Text style={styles.calloutDistance}>Location recorded</Text>
                <View style={styles.calloutButton}>
                  <Ionicons name="information-circle-outline" size={20} color="white" />
                  <Text style={styles.calloutButtonText}>More Info</Text>
                </View>
              </View>
            </Callout>
          </Marker>
        );
      })}
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