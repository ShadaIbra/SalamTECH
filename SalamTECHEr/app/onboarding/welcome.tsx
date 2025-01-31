import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";

export default function Welcome() {
  const handleHospitalLogin = () => {
    router.replace("/hospital/login");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/SalamTech4.png")}
        style={styles.logo}
      />
    
      <TouchableOpacity 
        style={[styles.button, styles.hospitalButton]} 
        onPress={handleHospitalLogin}
      >
        <Text style={styles.buttonText}>Hospital Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: 50,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  hospitalButton: {
    backgroundColor: "#4A90E2",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
