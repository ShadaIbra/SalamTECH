import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Scanner() {
  const [scanned, setScanned] = useState(false);

  return (
    <View style={styles.container}>
      {/* Camera placeholder */}
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.placeholderText}>Camera View</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.overlay}>
        <View style={styles.frame} />
        <Text style={styles.text}>Scan Patient QR Code</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 18,
  },
  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
  },
}); 