import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';

export default function HospitalScanner() {
  const [scanned, setScanned] = useState(false);

  const handleLogout = () => {
    router.replace("/hospital/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.fakeCamera}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Hospital Scanner</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanText}>Position QR Code within frame</Text>
          {scanned && (
            <TouchableOpacity
              style={styles.rescanButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.rescanText}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fakeCamera: {
    flex: 1,
    backgroundColor: 'black',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 20,
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  rescanButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
  },
  rescanText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 