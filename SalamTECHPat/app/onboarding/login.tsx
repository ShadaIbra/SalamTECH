import { View, Text, TextInput, StyleSheet, Pressable, Alert, Image } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useUser } from '../utils/userContext';
import { getFirestore, getDoc, doc } from 'firebase/firestore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserType } = useUser();

  const handleLogin = async () => {
    try {
      // First authenticate with Firebase
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Then check user type in Firestore
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (!userDoc.exists()) {
        await auth.signOut();
        Alert.alert("Error", "User data not found");
        return;
      }

      const userData = userDoc.data();
      if (userData.userType !== "patient") {
        await auth.signOut();
        Alert.alert("Access Denied", "This app is for patients only");
        return;
      }

      // If we get here, user is a patient
      setUserType('registered');
      router.replace("/home/home");
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    }
  };
  
  const handleRegister = async () => {
    router.push("/onboarding/register");
  };

  const handleGuestLogin = () => {
    setUserType('guest');
    router.replace("/home/home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/SalamTECH-Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable 
          onPress={() => router.push("/onboarding/forgotPassword")}
          style={styles.forgotPasswordContainer}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </Pressable>
      </View>

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable 
        style={[styles.button, styles.guestButton]} 
        onPress={handleGuestLogin}
      >
        <Text style={[styles.buttonText, styles.guestButtonText]}>Join as Guest</Text>
      </Pressable>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <Pressable onPress={handleRegister}>
          <Text style={styles.registerLink}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  alternativeOptions: {
    alignItems: "center",
    gap: 15,
  },
  link: {
    fontSize: 16,
    color: "#007AFF",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  registerContainer: {
    alignItems: "center",
    gap: 10,
  },
  registerText: {
    fontSize: 16,
  },
  registerLink: {
    fontSize: 16,
    color: "#007AFF",
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  guestButtonText: {
    color: '#007AFF',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,  // Adjust size as needed
    height: 80,  // Adjust size as needed
  },
}); 