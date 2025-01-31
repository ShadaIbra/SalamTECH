import { Modal, View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Patient } from './types';

interface PatientInfoModalProps {
  visible: boolean;
  onClose: () => void;
  patient: Patient | null;
  activeTab: 'assessment' | 'info';
  setActiveTab: (tab: 'assessment' | 'info') => void;
  onScanQR: () => void;
}

export default function PatientInfoModal({
  visible,
  onClose,
  patient,
  activeTab,
  setActiveTab,
  onScanQR
}: PatientInfoModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { maxHeight: '80%' }]}>
          <Text style={styles.modalTitle}>
            {patient?.name}'s Information
          </Text>

          <View style={styles.tabContainer}>
            {/* ... Tab buttons ... */}
          </View>

          <ScrollView style={styles.scanContent}>
            {activeTab === 'assessment' ? (
              <View style={styles.assessmentContainer}>
                {/* ... Assessment content ... */}
              </View>
            ) : (
              <View style={styles.patientInfoContainer}>
                {/* ... Patient info content ... */}
              </View>
            )}
          </ScrollView>

          <View style={styles.qrCodeContainer}>
            <View style={styles.qrPlaceholder}>
              {patient?.name === "Yusuf Qahtani" ? (
                <Image
                  source={require('../../assets/images/599FF3D2-E099-4740-9C47-332B3C85DB46.jpeg')}
                  style={styles.qrImage}
                />
              ) : (
                <TouchableOpacity
                  style={[styles.qrButton, { backgroundColor: '#f5f5f5' }]}
                  onPress={onScanQR}
                >
                  <Ionicons name="qr-code-outline" size={40} color="#666" />
                  <Text style={[styles.qrPlaceholderText, { color: '#666' }]}>Scan QR Code</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  scanContent: {
    maxHeight: '60%',
  },
  assessmentContainer: {
    padding: 10,
  },
  patientInfoContainer: {
    padding: 10,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  qrPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
  qrButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrPlaceholderText: {
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 