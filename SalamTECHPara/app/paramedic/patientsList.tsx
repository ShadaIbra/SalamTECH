import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Patient } from './types';
import { patients } from './data';

export default function PatientsList() {
  const router = useRouter();

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
        {patients.map((patient) => (
          <View key={patient.id} style={styles.patientListItem}>
            <TouchableOpacity 
              style={styles.patientItem}
              onPress={() => {
                router.push({
                  pathname: "/paramedic/route",
                  params: { 
                    patientId: patient.id,
                    patientName: patient.name,
                    latitude: patient.coordinates.latitude,
                    longitude: patient.coordinates.longitude
                  }
                });
              }}
            >
              <View style={[styles.statusDot, { backgroundColor: getMarkerColor(patient.status) }]} />
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>
                  {patient.name}, {patient.age}
                </Text>
                <Text style={styles.patientDistance}>
                  {patient.distance.toFixed(1)} km away
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