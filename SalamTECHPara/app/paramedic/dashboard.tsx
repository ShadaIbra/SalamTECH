import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MapComponent from './Map';
import { patients } from './data';
import { useState } from 'react';
import { Patient } from './types';

export default function Dashboard() {
  const router = useRouter();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientInfo, setShowPatientInfo] = useState(false);

  const getMarkerColor = (status: string) => {
    switch (status) {
      case "critical": return "red";
      case "needAssist": return "#FFD700";
      case "stable": return "green";
      default: return "blue";
    }
  };

  const handlePinPress = (patientId: string) => {
    const patient = patients.find((p: Patient) => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setShowPatientInfo(true);
    }
  };

  return (
    <View style={styles.container}>
      <MapComponent 
        patients={patients}
        onPinPress={handlePinPress}
        getMarkerColor={getMarkerColor}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => router.push("/paramedic/patientsList")}
        >
          <Ionicons name="people-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Patients</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => router.push("/paramedic/scanner")}
        >
          <Ionicons name="qr-code-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Scan QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
  },
  tabButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    marginTop: 5,
  },
}); 