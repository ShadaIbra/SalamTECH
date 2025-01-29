import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, setDoc, getFirestore, collection, addDoc } from 'firebase/firestore';
import { Ionicons } from "@expo/vector-icons";
import { useUser } from '../utils/userContext';

// Add this component for required field labels
const RequiredLabel = ({ text }: { text: string }) => (
  <Text style={styles.label}>
    {text} <Text style={styles.requiredStar}>*</Text>
  </Text>
);

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserType } = useUser();

  const handleRegister = async () => {
    try {
      // Basic validation
      if (!firstName || !lastName || !email || !password || !phone) {
        Alert.alert("Error", "Please fill required fields");
        return;
      }

      const auth = getAuth();
      const db = getFirestore();

      // Create authentication account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const dateOfBirth = `${year}/${month}/${day}`;

      const userDocRef = doc(db, "users", user.uid);

      // Main user profile
      await setDoc(userDocRef, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth,
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        gender: "",
        nationality: "",
        idNumber: "",
        bloodType: "",
      });

      // Create sub-collections for different types of data
      // Example: Medical History
      const medicalHistoryRef = collection(db, "users", user.uid, "medicalHistory");
      await addDoc(medicalHistoryRef, {
        createdAt: new Date().toISOString(),
        conditions: [],
        allergies: [],
        medications: []
      });

      // Example: Emergency Contacts
      const emergencyContactsRef = collection(db, "users", user.uid, "emergencyContacts");
      await addDoc(emergencyContactsRef, {
        createdAt: new Date().toISOString(),
        contacts: []
      });

      // Example: Insurance Information
      const insuranceRef = collection(db, "users", user.uid, "insurance");
      await addDoc(insuranceRef, {
        createdAt: new Date().toISOString(),
        provider: "",
        policyNumber: "",
        coverage: {}
      });

      setUserType('registered');
      router.replace("/home/home");
      

      

    } catch (error: any) {
      console.log("Detailed error:", error);
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <RequiredLabel text="First Name" />
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          placeholderTextColor="#999999"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />

        <RequiredLabel text="Last Name" />
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          placeholderTextColor="#999999"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />

        <RequiredLabel text="Email" />
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor="#999999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

<Text style={styles.label}>Date of Birth</Text>
        <View style={styles.dateContainer}>
          <View style={styles.dateInputContainer}>
            <TextInput
              style={[styles.dateInput, styles.dayMonth]}
              placeholder="DD"
              placeholderTextColor="#999999"
              value={day}
              onChangeText={setDay}
              keyboardType="numeric"
              returnKeyType="next"
              maxLength={2}
            />
          </View>
          <View style={styles.dateInputContainer}>
            <TextInput
              style={[styles.dateInput, styles.dayMonth]}
              placeholder="MM"
              placeholderTextColor="#999999"
              value={month}
              onChangeText={setMonth}
              keyboardType="numeric"
              returnKeyType="next"
              maxLength={2}
            />
          </View>
          <View style={styles.dateInputContainer}>
            <TextInput
              style={[styles.dateInput, styles.year]}
              placeholder="YYYY"
              placeholderTextColor="#999999"
              value={year}
              onChangeText={setYear}
              keyboardType="numeric"
              returnKeyType="next"
              maxLength={4}
            />
          </View>
        </View>

        <RequiredLabel text="Phone Number" />
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          placeholderTextColor="#999999"
          value={phone}
          onChangeText={setPhone}
          keyboardType="numeric"
          returnKeyType="next"
        />

        <RequiredLabel text="Password" />
        <TextInput
          style={styles.input}
          placeholder="Create a password"
          placeholderTextColor="#999999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  smallLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    textAlign: "center",
  },
  dayMonth: {
    flex: 1,
  },
  year: {
    flex: 1,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
  },
  requiredStar: {
    color: '#FF3B30',
    fontSize: 16,
  },
}); 