import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { router, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from '../utils/userContext';
import { useState, useEffect } from "react";
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

export default function Profile() {
  const { userType } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isGuest = userType === 'guest';

  useEffect(() => {
    const fetchUserData = async () => {
      if (userType === 'registered') {
        const auth = getAuth();
        const db = getFirestore();
        
        if (auth.currentUser) {
          try {
            const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
            if (userDoc.exists()) {
              setUserData({
                firstName: userDoc.data().firstName || '',
                lastName: userDoc.data().lastName || '',
                email: userDoc.data().email || '',
                phone: userDoc.data().phone || '',
                dateOfBirth: userDoc.data().dateOfBirth || '',
                gender: userDoc.data().gender || '',
                nationality: userDoc.data().nationality || '',
                idNumber: userDoc.data().idNumber || '',
                bloodType: userDoc.data().bloodType || '',
              });
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [userType]);

  if (isGuest) {
    return (
      <View style={styles.guestContainer}>
        <View style={styles.guestContent}>
          <Ionicons name="person-circle-outline" size={80} color="#ccc" />
          <Text style={styles.guestTitle}>Welcome, Guest!</Text>
          <Text style={styles.guestMessage}>
            Sign in or create an account to access all features
          </Text>
          <Pressable 
            style={[styles.button, styles.loginButton]} 
            onPress={() => router.push("/onboarding/login")}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <Pressable 
            style={[styles.button, styles.registerButton]} 
            onPress={() => router.push("/onboarding/register")}
          >
            <Text style={[styles.buttonText, styles.registerButtonText]}>Register</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profilePicture}>
          <Ionicons name="person" size={60} color="#ccc" />
        </View>
        <Text style={styles.name}>
          {loading ? <ActivityIndicator size="small" color="#007AFF" /> : `${userData?.firstName || ''} ${userData?.lastName || ''}`}
        </Text>
        <Text style={styles.email}>
          {loading ? <ActivityIndicator size="small" color="#007AFF" /> : userData?.email || ''}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>
            {loading ? <ActivityIndicator size="small" color="#007AFF" /> : `${userData?.firstName || ''} ${userData?.lastName || ''}`}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>
            {loading ? <ActivityIndicator size="small" color="#007AFF" /> : userData?.email || ''}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>
            {loading ? <ActivityIndicator size="small" color="#007AFF" /> : userData?.phone || ''}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={styles.value}>
            {loading ? <ActivityIndicator size="small" color="#007AFF" /> : userData?.dateOfBirth || ''}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>
            {loading ? <ActivityIndicator size="small" color="#007AFF" /> : userData?.gender || ''}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Nationality</Text>
          <Text style={styles.value}>
            {loading ? <ActivityIndicator size="small" color="#007AFF" /> : userData?.nationality || ''}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>ID Number</Text>
          <Text style={styles.value}>
            {loading ? <ActivityIndicator size="small" color="#007AFF" /> : userData?.idNumber || ''}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Blood Type</Text>
          <Text style={styles.value}>
            {loading ? <ActivityIndicator size="small" color="#007AFF" /> : userData?.bloodType || ''}
          </Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Link href="/member/members" asChild>
          <Pressable style={styles.menuItem}>
            <Ionicons name="people" size={24} color="#007AFF" />
            <Text style={styles.menuItemText}>Manage Members</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </Pressable>
        </Link>

        <Pressable style={styles.menuItem} onPress={() => router.push("/home/settings")}>
          <Ionicons name="settings" size={24} color="#007AFF" />
          <Text style={styles.menuItemText}>Settings</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  email: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    backgroundColor: "white",
    padding: 20,
    marginTop: 20,
  },
  menuSection: {
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
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 1,
  },
  menuItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  guestContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    padding: 20,
  },
  guestContent: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  guestMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#007AFF",
  },
  registerButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  registerButtonText: {
    color: "#007AFF",
  },
}); 