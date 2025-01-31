import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { useState } from "react";

export default function HospitalLogin() {
  const [hospitalId, setHospitalId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    router.replace("/hospital/scanner");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/SalamTech4.png")}
        style={styles.logo}
      />
      
      <Text style={styles.title}>Hospital Login</Text>
      
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Hospital ID"
          value={hospitalId}
          onChangeText={setHospitalId}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
}); 