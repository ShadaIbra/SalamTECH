import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Animated, Image } from "react-native";
import { useState, useRef, useEffect } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Patient {
  id: string;
  name: string;
  age: number;
  distance: number; // in kilometers
  status: "critical" | "needAssist" | "stable";
  coordinates: {
    latitude: number;
    longitude: number;
  };
  info: PatientInfo;
  assessment: Assessment;
}

// Add new interfaces for patient info and assessment
interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  allergies: string[];
  emergencyContact: string;
  medicalHistory: string[];
}

interface Assessment {
  consciousness: string;
  breathing: string;
  circulation: string;
  disability: string;
  exposure: string;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenSaturation: number;
  };
}

export default function Dashboard() {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showPatientsList, setShowPatientsList] = useState(false);
  const [activeTab, setActiveTab] = useState<'assessment' | 'info'>('assessment');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const mapRef = useRef<MapView>(null);
  const [showCameraView, setShowCameraView] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Patient | null>(null);
  const router = useRouter();
  const [completedRoutes, setCompletedRoutes] = useState<string[]>([]);

  // Updated patients data with info and assessment for each patient
  const patients: Patient[] = [
    {
      id: "1",
      name: "Ahmed Al-Sayed",
      age: 45,
      distance: 0.1,
      status: "critical",
      coordinates: { latitude: 25.2869, longitude: 51.5353 },
      info: {
        id: "1",
        name: "Ahmed Al-Sayed",
        age: 45,
        gender: "Male",
        bloodType: "O+",
        allergies: ["Penicillin"],
        emergencyContact: "+974 5555-1111",
        medicalHistory: ["Diabetes", "Hypertension"]
      },
      assessment: {
        consciousness: "Semi-conscious",
        breathing: "Labored",
        circulation: "Weak pulse",
        disability: "Responsive to pain",
        exposure: "Multiple injuries",
        vitals: {
          bloodPressure: "90/60",
          heartRate: 120,
          temperature: 38.5,
          oxygenSaturation: 92
        }
      }
    },
    {
      id: "2",
      name: "Fatima Hassan",
      age: 32,
      distance: 0.15,
      status: "critical",
      coordinates: { latitude: 25.2872, longitude: 51.5355 },
      info: {
        id: "2",
        name: "Fatima Hassan",
        age: 32,
        gender: "Female",
        bloodType: "A+",
        allergies: ["None"],
        emergencyContact: "+974 5555-2222",
        medicalHistory: ["Asthma"]
      },
      assessment: {
        consciousness: "Alert but confused",
        breathing: "Wheezing",
        circulation: "Rapid pulse",
        disability: "Moving all limbs",
        exposure: "Burns on arms",
        vitals: {
          bloodPressure: "100/70",
          heartRate: 110,
          temperature: 37.8,
          oxygenSaturation: 94
        }
      }
    },
    {
      id: "3",
      name: "Mohammed Ali",
      age: 28,
      distance: 0.2,
      status: "needAssist",
      coordinates: { latitude: 25.2867, longitude: 51.5357 },
      info: {
        id: "3",
        name: "Mohammed Ali",
        age: 28,
        gender: "Not specified",
        bloodType: "Unknown",
        allergies: ["None reported"],
        emergencyContact: "Not provided",
        medicalHistory: ["Under assessment"]
      },
      assessment: {
        consciousness: "Under assessment",
        breathing: "Under assessment",
        circulation: "Under assessment",
        disability: "Under assessment",
        exposure: "Under assessment",
        vitals: {
          bloodPressure: "Not measured",
          heartRate: 0,
          temperature: 0,
          oxygenSaturation: 0
        }
      }
    },
    {
      id: "4",
      name: "Sara Ahmad",
      age: 52,
      distance: 0.25,
      status: "critical",
      coordinates: { latitude: 25.2871, longitude: 51.5351 },
      info: {
        id: "4",
        name: "Sara Ahmad",
        age: 52,
        gender: "Female",
        bloodType: "Unknown",
        allergies: ["None reported"],
        emergencyContact: "Not provided",
        medicalHistory: ["Under assessment"]
      },
      assessment: {
        consciousness: "Under assessment",
        breathing: "Under assessment",
        circulation: "Under assessment",
        disability: "Under assessment",
        exposure: "Under assessment",
        vitals: {
          bloodPressure: "Not measured",
          heartRate: 0,
          temperature: 0,
          oxygenSaturation: 0
        }
      }
    },
    {
      id: "5",
      name: "Khalid Al-Thani",
      age: 63,
      distance: 0.3,
      status: "needAssist",
      coordinates: { latitude: 25.2865, longitude: 51.5354 },
      info: {
        id: "5",
        name: "Khalid Al-Thani",
        age: 63,
        gender: "Male",
        bloodType: "Unknown",
        allergies: ["None reported"],
        emergencyContact: "Not provided",
        medicalHistory: ["Under assessment"]
      },
      assessment: {
        consciousness: "Under assessment",
        breathing: "Under assessment",
        circulation: "Under assessment",
        disability: "Under assessment",
        exposure: "Under assessment",
        vitals: {
          bloodPressure: "Not measured",
          heartRate: 0,
          temperature: 0,
          oxygenSaturation: 0
        }
      }
    },
    {
      id: "6",
      name: "Noura Rahman",
      age: 29,
      distance: 0.35,
      status: "stable",
      coordinates: { latitude: 25.2873, longitude: 51.5356 },
      info: {
        id: "6",
        name: "Noura Rahman",
        age: 29,
        gender: "Female",
        bloodType: "Unknown",
        allergies: ["None reported"],
        emergencyContact: "Not provided",
        medicalHistory: ["Under assessment"]
      },
      assessment: {
        consciousness: "Under assessment",
        breathing: "Under assessment",
        circulation: "Under assessment",
        disability: "Under assessment",
        exposure: "Under assessment",
        vitals: {
          bloodPressure: "Not measured",
          heartRate: 0,
          temperature: 0,
          oxygenSaturation: 0
        }
      }
    },
    {
      id: "7",
      name: "Yusuf Qahtani",
      age: 41,
      distance: 0.4,
      status: "critical",
      coordinates: { latitude: 25.2868, longitude: 51.5359 },
      info: {
        id: "7",
        name: "Yusuf Qahtani",
        age: 41,
        gender: "Male",
        bloodType: "Unknown",
        allergies: ["None reported"],
        emergencyContact: "Not provided",
        medicalHistory: ["Under assessment"]
      },
      assessment: {
        consciousness: "Under assessment",
        breathing: "Under assessment",
        circulation: "Under assessment",
        disability: "Under assessment",
        exposure: "Under assessment",
        vitals: {
          bloodPressure: "Not measured",
          heartRate: 0,
          temperature: 0,
          oxygenSaturation: 0
        }
      }
    },
    {
      id: "8",
      name: "Aisha Mohammed",
      age: 35,
      distance: 0.45,
      status: "needAssist",
      coordinates: { latitude: 25.2874, longitude: 51.5352 },
      info: {
        id: "8",
        name: "Aisha Mohammed",
        age: 35,
        gender: "Female",
        bloodType: "Unknown",
        allergies: ["None reported"],
        emergencyContact: "Not provided",
        medicalHistory: ["Under assessment"]
      },
      assessment: {
        consciousness: "Under assessment",
        breathing: "Under assessment",
        circulation: "Under assessment",
        disability: "Under assessment",
        exposure: "Under assessment",
        vitals: {
          bloodPressure: "Not measured",
          heartRate: 0,
          temperature: 0,
          oxygenSaturation: 0
        }
      }
    },
    {
      id: "9",
      name: "Omar Jassim",
      age: 48,
      distance: 0.5,
      status: "stable",
      coordinates: { latitude: 25.2866, longitude: 51.5350 },
      info: {
        id: "9",
        name: "Omar Jassim",
        age: 48,
        gender: "Male",
        bloodType: "Unknown",
        allergies: ["None reported"],
        emergencyContact: "Not provided",
        medicalHistory: ["Under assessment"]
      },
      assessment: {
        consciousness: "Under assessment",
        breathing: "Under assessment",
        circulation: "Under assessment",
        disability: "Under assessment",
        exposure: "Under assessment",
        vitals: {
          bloodPressure: "Not measured",
          heartRate: 0,
          temperature: 0,
          oxygenSaturation: 0
        }
      }
    },
    {
      id: "10",
      name: "Maryam Al-Kuwari",
      age: 27,
      distance: 0.55,
      status: "critical",
      coordinates: { latitude: 25.2870, longitude: 51.5358 },
      info: {
        id: "10",
        name: "Maryam Al-Kuwari",
        age: 27,
        gender: "Female",
        bloodType: "Unknown",
        allergies: ["None reported"],
        emergencyContact: "Not provided",
        medicalHistory: ["Under assessment"]
      },
      assessment: {
        consciousness: "Under assessment",
        breathing: "Under assessment",
        circulation: "Under assessment",
        disability: "Under assessment",
        exposure: "Under assessment",
        vitals: {
          bloodPressure: "Not measured",
          heartRate: 0,
          temperature: 0,
          oxygenSaturation: 0
        }
      }
    }
  ];

  const getMarkerColor = (status: string) => {
    switch (status) {
      case "critical": return "red";
      case "needAssist": return "#FFD700"; // Brighter gold color
      case "stable": return "green";
      default: return "blue";
    }
  };

  const handlePinPress = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setShowQRScanner(true);
    }
  };

  const PatientsList = () => (
    <Modal
      visible={showPatientsList}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { maxHeight: '80%' }]}>
          <Text style={styles.modalTitle}>Nearby Patients</Text>
          <ScrollView>
            {[...patients]
              .sort((a, b) => a.distance - b.distance)
              .map((patient) => (
                <View key={patient.id} style={styles.patientListItem}>
                  <TouchableOpacity 
                    style={styles.patientItem}
                    onPress={() => {
                      setSelectedPatient(patient);
                      setShowPatientsList(false);
                      setShowQRScanner(true);
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
                  <TouchableOpacity
                    style={[
                      styles.goButton,
                      { backgroundColor: completedRoutes.includes(patient.id) ? '#8E8E93' : '#FF3B30' }
                    ]}
                    onPress={() => {
                      if (!completedRoutes.includes(patient.id)) {
                        setSelectedRoute(patient);
                        setShowPatientsList(false);
                        router.push({
                          pathname: "/paramedic/route",
                          params: { 
                            patientId: patient.id,
                            patientName: patient.name,
                            latitude: patient.coordinates.latitude,
                            longitude: patient.coordinates.longitude
                          }
                        });
                      }
                    }}
                  >
                    <Text style={styles.goButtonText}>
                      {completedRoutes.includes(patient.id) ? 'Done' : 'Go'}
                    </Text>
                  </TouchableOpacity>
                </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPatientsList(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const PatientInfoModal = () => (
    <Modal
      visible={showQRScanner}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { maxHeight: '80%' }]}>
          <Text style={styles.modalTitle}>
            {selectedPatient?.name}'s Information
          </Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'assessment' && styles.activeTab]}
              onPress={() => setActiveTab('assessment')}
            >
              <Text style={[styles.tabText, activeTab === 'assessment' && styles.activeTabText]}>
                Assessment
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'info' && styles.activeTab]}
              onPress={() => setActiveTab('info')}
            >
              <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
                Patient Info
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scanContent}>
            {activeTab === 'assessment' ? (
              <View style={styles.assessmentContainer}>
                <View style={styles.vitalSign}>
                  <Text style={styles.label}>Consciousness:</Text>
                  <Text style={styles.value}>{selectedPatient?.assessment.consciousness}</Text>
                </View>
                <View style={styles.vitalSign}>
                  <Text style={styles.label}>Breathing:</Text>
                  <Text style={styles.value}>{selectedPatient?.assessment.breathing}</Text>
                </View>
                <View style={styles.vitalSign}>
                  <Text style={styles.label}>Circulation:</Text>
                  <Text style={styles.value}>{selectedPatient?.assessment.circulation}</Text>
                </View>
                <View style={styles.vitalSign}>
                  <Text style={styles.label}>Blood Pressure:</Text>
                  <Text style={styles.value}>{selectedPatient?.assessment.vitals.bloodPressure}</Text>
                </View>
                <View style={styles.vitalSign}>
                  <Text style={styles.label}>Heart Rate:</Text>
                  <Text style={styles.value}>{selectedPatient?.assessment.vitals.heartRate} bpm</Text>
                </View>
                <View style={styles.vitalSign}>
                  <Text style={styles.label}>Temperature:</Text>
                  <Text style={styles.value}>{selectedPatient?.assessment.vitals.temperature}°C</Text>
                </View>
                <View style={styles.vitalSign}>
                  <Text style={styles.label}>O2 Saturation:</Text>
                  <Text style={styles.value}>{selectedPatient?.assessment.vitals.oxygenSaturation}%</Text>
                </View>
              </View>
            ) : (
              <View style={styles.patientInfoContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{selectedPatient?.info.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Age:</Text>
                  <Text style={styles.value}>{selectedPatient?.info.age}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Gender:</Text>
                  <Text style={styles.value}>{selectedPatient?.info.gender}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Blood Type:</Text>
                  <Text style={styles.value}>{selectedPatient?.info.bloodType}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Emergency Contact:</Text>
                  <Text style={styles.value}>{selectedPatient?.info.emergencyContact}</Text>
                </View>
                <View style={styles.infoSection}>
                  <Text style={styles.label}>Allergies:</Text>
                  {selectedPatient?.info.allergies.map((allergy, index) => (
                    <Text key={index} style={styles.listItem}>• {allergy}</Text>
                  ))}
                </View>
                <View style={styles.infoSection}>
                  <Text style={styles.label}>Medical History:</Text>
                  {selectedPatient?.info.medicalHistory.map((condition, index) => (
                    <Text key={index} style={styles.listItem}>• {condition}</Text>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.qrCodeContainer}>
            <View style={styles.qrPlaceholder}>
              {selectedPatient?.name === "Yusuf Qahtani" ? (
                <Image
                  source={require('../../assets/images/599FF3D2-E099-4740-9C47-332B3C85DB46.jpeg')}
                  style={styles.qrImage}
                />
              ) : (
                <TouchableOpacity
                  style={[styles.qrButton, { backgroundColor: '#f5f5f5' }]}
                  onPress={() => {
                    setShowQRScanner(false);
                    setTimeout(() => {
                      setShowCameraView(true);
                    }, 100);
                  }}
                >
                  <Ionicons name="qr-code-outline" size={40} color="#666" />
                  <Text style={[styles.qrPlaceholderText, { color: '#666' }]}>Scan QR Code</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setShowQRScanner(false);
              setSelectedPatient(null);
            }}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
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
              onPress={() => handlePinPress(patient.id)}
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => setShowPatientsList(true)}
        >
          <Ionicons name="people-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Patients</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton}>
          <Ionicons name="home" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.sideButton}
          onPress={() => setShowCameraView(true)}
        >
          <Ionicons name="qr-code-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Scan QR</Text>
        </TouchableOpacity>
      </View>

      <PatientsList />
      <PatientInfoModal />

      <Modal
        visible={showCameraView}
        animationType="none"
        transparent={false}
        onRequestClose={() => setShowCameraView(false)}
      >
        <View style={styles.fakeCamera}>
          <TouchableOpacity
            style={styles.exitCamera}
            onPress={() => setShowCameraView(false)}
          >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
          <View style={styles.scanFrame} />
          <Text style={styles.scanText}>Position QR Code within frame</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sideButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: 100,
  },
  homeButton: {
    backgroundColor: '#FF3B30',
    padding: 20,
    borderRadius: 35,
    alignItems: 'center',
    elevation: 5, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    marginTop: 5,
  },
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
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  patientListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  patientItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  patientDistance: {
    fontSize: 14,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  activeTab: {
    backgroundColor: '#FF3B30',
  },
  tabText: {
    color: '#FF3B30',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  scanContent: {
    maxHeight: '70%',
  },
  assessmentContainer: {
    padding: 10,
  },
  patientInfoContainer: {
    padding: 10,
  },
  vitalSign: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoSection: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  listItem: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    marginTop: 5,
  },
  calloutContainer: {
    width: 180,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  calloutContent: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
    textAlign: 'center',
  },
  calloutAge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  calloutDistance: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  calloutButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    width: '100%',
  },
  calloutButtonText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },
  qrCodeContainer: {
    marginTop: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  qrPlaceholder: {
    width: 150,
    height: 150,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPlaceholderText: {
    color: '#666',
    marginTop: 10,
    fontSize: 14,
  },
  qrImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  qrButton: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fakeCamera: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  exitCamera: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  goButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 15,
  },
  goButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 