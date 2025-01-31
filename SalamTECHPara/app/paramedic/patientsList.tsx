import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface Emergency {
  id: string;
  name?: string;
  status?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  age?: string;
  timestamp?: any;
  triageColor?: string;
}


export default function PatientsList() {
  const router = useRouter();
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);

  useEffect(() => {
    // Set up real-time listener for emergencies collection
    const emergenciesRef = collection(db, 'emergencies');
    const unsubscribe = onSnapshot(emergenciesRef, (snapshot) => {
      const emergencyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Emergency[];
      
      // Sort emergencies by timestamp if available
      const sortedEmergencies = emergencyData.sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        return b.timestamp.seconds - a.timestamp.seconds;
      });
      
      setEmergencies(sortedEmergencies);
    }, (error) => {
      console.error("Error fetching emergencies:", error);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const getMarkerColor = (status: string) => {
    switch (status) {
      case "critical": return "red";
      case "needAssist": return "#FFD700";
      case "stable": return "green";
      default: return "blue";
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {emergencies.map((emergency) => (
          <View key={emergency.id} style={styles.patientListItem}>
            <TouchableOpacity 
              style={styles.patientItem}
              onPress={() => {
                router.push({
                  pathname: "/paramedic/route",
                  params: { 
                    patientId: emergency.id,
                    patientName: emergency.name || 'Unknown',
                    latitude: emergency.latitude,
                    longitude: emergency.longitude,
                    triageColor: emergency.triageColor,
                  }
                });
              }}

            >
              <View style={[styles.statusDot, { backgroundColor: emergency.triageColor }]} />
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>
                  {emergency.name || 'Unknown'}, {emergency.age || 'N/A'}
                </Text>
                <Text style={styles.patientDistance}>
                  Location recorded
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  patientListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  patientItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '500',
  },
  patientDistance: {
    fontSize: 14,
    color: '#666',
  },
}); 