import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const handleSOS = () => {
    // Add emergency contact logic here
    router.push("/emergency/type");
  };

  const handleVolunteer = () => {
    router.push("/volunteer");  // Changed from "/tabs/volunteer"
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.sosButton} onPress={handleSOS}>
        <Ionicons name="warning" size={40} color="white" />
        <Text style={styles.sosText}>SOS</Text>
        <Text style={styles.sosSubtext}>Request Emergency Help</Text>
      </Pressable>

      <Pressable style={styles.volunteerButton} onPress={handleVolunteer}>
        <Ionicons name="heart" size={40} color="white" />
        <Text style={styles.volunteerText}>Volunteer</Text>
        <Text style={styles.volunteerSubtext}>Help Others in Need</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    gap: 20,
  },
  sosButton: {
    backgroundColor: "#FF3B30",
    width: "100%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  volunteerButton: {
    backgroundColor: "#34C759",
    width: "100%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  sosText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },
  volunteerText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },
  sosSubtext: {
    color: "white",
    fontSize: 16,
    opacity: 0.9,
    marginTop: 5,
  },
  volunteerSubtext: {
    color: "white",
    fontSize: 16,
    opacity: 0.9,
    marginTop: 5,
  },
}); 