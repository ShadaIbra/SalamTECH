import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface VolunteerOption {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const volunteerOptions: VolunteerOption[] = [
  {
    id: 'ride',
    icon: 'car-outline',
    title: 'Give a Ride',
    description: 'Provide transportation to those in need during emergencies'
  },
  {
    id: 'health',
    icon: 'medical-outline',
    title: 'Health Knowledge',
    description: 'Share medical expertise or first aid knowledge'
  },
  {
    id: 'shelter',
    icon: 'home-outline',
    title: 'Provide Shelter',
    description: 'Offer temporary safe shelter to those affected by crisis'
  }
];

export default function Volunteer() {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [otherText, setOtherText] = useState('');

  const handleSubmit = () => {
    // Handle volunteer submission
    if (selectedOption === 'other' && !otherText) {
      return;
    }
    // Add volunteer registration logic here
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>How Would You Like to Help?</Text>
        <Text style={styles.subtitle}>Select the way you can contribute:</Text>

        {volunteerOptions.map((option) => (
          <Pressable
            key={option.id}
            style={[
              styles.optionButton,
              selectedOption === option.id && styles.selectedOption
            ]}
            onPress={() => setSelectedOption(option.id)}
          >
            <View style={styles.optionHeader}>
              <Ionicons 
                name={option.icon}
                size={24} 
                color={selectedOption === option.id ? "white" : "#007AFF"}
              />
              <Text style={[
                styles.optionTitle,
                selectedOption === option.id && styles.selectedText
              ]}>
                {option.title}
              </Text>
            </View>
            <Text style={[
              styles.optionDescription,
              selectedOption === option.id && styles.selectedText
            ]}>
              {option.description}
            </Text>
          </Pressable>
        ))}

        <Pressable
          style={[
            styles.optionButton,
            selectedOption === 'other' && styles.selectedOption
          ]}
          onPress={() => setSelectedOption('other')}
        >
          <View style={styles.optionHeader}>
            <Ionicons 
              name="add-circle-outline"
              size={24} 
              color={selectedOption === 'other' ? "white" : "#007AFF"}
            />
            <Text style={[
              styles.optionTitle,
              selectedOption === 'other' && styles.selectedText
            ]}>
              Other
            </Text>
          </View>
          {selectedOption === 'other' && (
            <TextInput
              style={styles.otherInput}
              placeholder="Please describe how you'd like to help..."
              placeholderTextColor="#rgba(255,255,255,0.7)"
              value={otherText}
              onChangeText={setOtherText}
              multiline
            />
          )}
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.submitButton,
            (!selectedOption || (selectedOption === 'other' && !otherText)) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!selectedOption || (selectedOption === 'other' && !otherText)}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    color: "#333",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    marginLeft: 36,
  },
  selectedText: {
    color: "white",
  },
  otherInput: {
    marginLeft: 36,
    marginTop: 8,
    fontSize: 14,
    color: "white",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
    padding: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
}); 