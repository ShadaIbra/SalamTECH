import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useUser } from '../utils/userContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserType } = useUser();

  const auth = getAuth();
  console.log("Firebase Auth State:", auth.currentUser);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUserType('registered');
      router.replace("/tabs/home");
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    }
  };

  const handleGuestLogin = () => {
    setUserType('guest');
    router.replace("/tabs/home");
  };

  return (
    <View style={styles.container}>
      
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
        <Pressable onPress={() => router.push("/onboarding/register")}>
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
}); 