import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface EmergencyType {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

const emergencyTypes: EmergencyType[] = [
  { id: 'accident', icon: 'car-outline', label: 'Accident' },
  { id: 'fire', icon: 'flame-outline', label: 'Fire' },
  { id: 'crime', icon: 'shield-outline', label: 'Crime' },
  { id: 'medical', icon: 'medical-outline', label: 'Medical' },
  { id: 'natural', icon: 'warning-outline', label: 'Natural Disaster' },
];

export default function EmergencyType() {
  const [selectedType, setSelectedType] = useState<string>('');
  const [otherText, setOtherText] = useState<string>('');

  const handleContinue = () => {
    if (selectedType || otherText) {
      router.push("/emergency/recipient");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>What's the Emergency?</Text>
        <Text style={styles.subtitle}>Please select the type of emergency:</Text>

        {emergencyTypes.map((type) => (
          <Pressable
            key={type.id}
            style={[
              styles.optionButton,
              selectedType === type.id && styles.selectedOption
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <Ionicons 
              name={type.icon}
              size={24} 
              color={selectedType === type.id ? "white" : "#FF3B30"} 
            />
            <Text style={[
              styles.optionText,
              selectedType === type.id && styles.selectedOptionText
            ]}>
              {type.label}
            </Text>
          </Pressable>
        ))}

        <Pressable
          style={[
            styles.optionButton,
            selectedType === 'other' && styles.selectedOption
          ]}
          onPress={() => setSelectedType('other')}
        >
          <Ionicons 
            name="ellipsis-horizontal-circle-outline"
            size={24} 
            color={selectedType === 'other' ? "white" : "#FF3B30"} 
          />
          <Text style={[
            styles.optionText,
            selectedType === 'other' && styles.selectedOptionText
          ]}>
            Other
          </Text>
        </Pressable>

        {selectedType === 'other' && (
          <TextInput
            style={styles.otherInput}
            placeholder="Please describe the emergency"
            value={otherText}
            onChangeText={setOtherText}
            multiline
          />
        )}
      </ScrollView>

      <Pressable
        style={[
          styles.continueButton,
          (selectedType || otherText) ? styles.continueButtonActive : styles.continueButtonInactive
        ]}
        onPress={handleContinue}
        disabled={!selectedType && !otherText}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FF3B30",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "#FF3B30",
    borderColor: "#FF3B30",
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 15,
    color: "#333",
  },
  selectedOptionText: {
    color: "white",
  },
  otherInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    marginTop: 10,
  },
  continueButton: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonActive: {
    backgroundColor: "#FF3B30",
  },
  continueButtonInactive: {
    backgroundColor: "#ccc",
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
}); 