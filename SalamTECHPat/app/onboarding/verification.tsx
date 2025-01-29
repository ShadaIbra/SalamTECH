import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

export default function Verification() {
  const handleSubmit = () => {
    router.replace("/tabs/home");
  };

  const handleSkip = () => {
    router.replace("/tabs/home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect to your ID</Text>
      <Text style={styles.subtitle}>Please enter your ID or Passport number</Text>
      
      <TextInput
        style={styles.input}
        placeholder="ID or Passport Number"
        autoCapitalize="characters"
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>

      <Pressable style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Skip for now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    padding: 15,
    alignItems: "center",
  },
  skipButtonText: {
    color: "#666",
    fontSize: 16,
  },
}); 