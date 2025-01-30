import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from "react";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default function MemberDetails() {
  const { id } = useLocalSearchParams();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const auth = getAuth();
        if (!auth.currentUser) {
          console.log("No authenticated user");
          return;
        }

        const db = getFirestore();
        const memberRef = doc(db, `users/${auth.currentUser.uid}/members/${id}`);
        console.log("Fetching member with path:", `users/${auth.currentUser.uid}/members/${id}`);
        
        const memberDoc = await getDoc(memberRef);
        console.log("Member doc exists:", memberDoc.exists(), "Data:", memberDoc.data());

        if (memberDoc.exists()) {
          setMember({
            id: memberDoc.id,
            ...memberDoc.data(),
            location: {
              latitude: 25.2854,
              longitude: 51.5310,
              timestamp: new Date(),
            },
            healthStatus: 'stable'
          });
        } else {
          console.log("Member document not found");
        }
      } catch (error) {
        console.error("Error fetching member:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!member) {
    return (
      <View style={styles.container}>
        <Text>Member not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.profilePicture}>
            <Ionicons name="person" size={60} color="#ccc" />
          </View>
          <Text style={styles.name}>{member.name}</Text>
          <Text style={styles.relation}>{member.relation}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{member.name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Relation</Text>
            <Text style={styles.value}>{member.relation}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>+974 5555-5555</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>Female</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Date of Birth</Text>
            <Text style={styles.value}>15/03/1988</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Nationality</Text>
            <Text style={styles.value}>Qatar</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>ID Number</Text>
            <Text style={styles.value}>987654321</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Blood Type</Text>
            <Text style={styles.value}>{member.bloodType}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Status</Text>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              member.healthStatus === 'stable' ? styles.statusStableBg : styles.statusPendingBg
            ]}>
              <Ionicons 
                name={member.healthStatus === 'stable' ? "checkmark-circle" : "warning"} 
                size={24} 
                color="white" 
              />
              <Text style={styles.statusText}>
                {member.healthStatus.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.lastUpdated}>
              Last updated: {new Date().toLocaleTimeString()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Location</Text>
          <Text style={styles.locationTimestamp}>
            Last updated: {member.location.timestamp.toLocaleTimeString()}
          </Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: member.location.latitude,
                longitude: member.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: member.location.latitude,
                  longitude: member.location.longitude,
                }}
                title={member.name}
              />
            </MapView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "white",
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  relation: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    backgroundColor: "white",
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    color: "#666",
    fontSize: 16,
  },
  value: {
    color: "#333",
    fontSize: 16,
  },
  locationTimestamp: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  mapContainer: {
    height: 300,
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  statusContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  statusStableBg: {
    backgroundColor: "#4CAF50",
  },
  statusPendingBg: {
    backgroundColor: "#FF9800",
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  lastUpdated: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
}); 