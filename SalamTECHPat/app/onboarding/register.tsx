import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { Ionicons } from "@expo/vector-icons";
import { useUser } from '../utils/userContext';

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
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      const auth = getAuth();
      const db = getFirestore();

      // Create authentication account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save all user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        dateOfBirth: `${year}-${month}-${day}`,
        phone,
        email,
        createdAt: new Date().toISOString(),
        // Initialize other profile fields as empty
        gender: "",
        nationality: "",
        idNumber: "",
        bloodType: "",
      });

      setUserType('registered');
      router.replace("/tabs/home");
    } catch (error: any) {
      console.log("Detailed error:", error);
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />
        
        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.dateContainer}>
          <TextInput
            style={[styles.dateInput, styles.dayMonth]}
            placeholder="DD"
            value={day}
            onChangeText={setDay}
            keyboardType="number-pad"
            maxLength={2}
          />
          <TextInput
            style={[styles.dateInput, styles.dayMonth]}
            placeholder="MM"
            value={month}
            onChangeText={setMonth}
            keyboardType="number-pad"
            maxLength={2}
          />
          <TextInput
            style={[styles.dateInput, styles.year]}
            placeholder="YYYY"
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  dateContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
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
    flex: 1.5,
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
}); 