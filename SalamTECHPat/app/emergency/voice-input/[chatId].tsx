import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { useState } from 'react';

export default function VoiceInput() {
  const { chatId } = useLocalSearchParams();
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);

  const handleToggleRecording = () => {
    // TODO: Implement voice recording logic
    setIsRecording(!isRecording);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
      
      <View style={styles.content}>
        <Text style={styles.title}>Voice Input</Text>
        <Text style={styles.subtitle}>
          {isRecording ? 'Recording...' : 'Tap the microphone to start recording'}
        </Text>
        
        <Pressable 
          style={[styles.recordButton, isRecording && styles.recordingButton]} 
          onPress={handleToggleRecording}
        >
          <Ionicons 
            name={isRecording ? "stop" : "mic"} 
            size={40} 
            color="white" 
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#FF453A',
    transform: [{scale: 1.1}],
  },
}); 