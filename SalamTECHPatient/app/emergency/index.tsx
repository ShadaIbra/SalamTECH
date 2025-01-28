import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EmergencyType() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who needs help?</Text>
      
      <Pressable 
        style={styles.option}
        onPress={() => router.push("/emergency/type")}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="person" size={32} color="#007AFF" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>For Myself</Text>
          <Text style={styles.optionDescription}>I need immediate assistance</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#999" />
      </Pressable>

      <Pressable 
        style={styles.option}
        onPress={() => router.push("/emergency/type")}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="people" size={32} color="#007AFF" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>For Someone Else</Text>
          <Text style={styles.optionDescription}>Help another person in need</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#999" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 30,
    marginTop: 20,
  },
  option: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
  },
}); 