import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import { openai } from '../../utils/openai';

export default function VoiceInput() {
  const { chatId } = useLocalSearchParams();
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        setIsTranscribing(true);
        try {
          const formData = new FormData();
          formData.append('file', {
            uri: uri,
            type: 'audio/m4a',
            name: 'audio.m4a'
          } as any);
          formData.append('model', 'whisper-1');

          const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openai.apiKey}`,
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
          }

          const data = await response.json();
          const transcription = data.text;

          setTranscribedText(transcription);

          if (transcription && chatId) {
            const db = getFirestore();
            await addDoc(
              collection(db, `emergencies/${chatId}/messages`),
              {
                content: transcription,
                role: 'user',
                timestamp: serverTimestamp()
              }
            );

            // Get AI response
            setIsProcessingAI(true);
            try {
              const response = await openai.chat.completions.create({
                messages: [
                  {
                    role: 'assistant',
                    content: 'You are a concise emergency response assistant. Keep responses brief and focused on gathering essential information.'
                  },
                  {
                    role: 'user',
                    content: transcription
                  }
                ],
                model: 'gpt-3.5-turbo',
                max_tokens: 100,
                temperature: 0.5,
              });

              const aiMessage = response.choices[0].message.content;
              setAiResponse(aiMessage || 'Sorry, I could not process that.');

              // Save AI response to Firestore
              await addDoc(
                collection(db, `emergencies/${chatId}/messages`),
                {
                  content: aiMessage,
                  role: 'assistant',
                  timestamp: serverTimestamp()
                }
              );
            } catch (error) {
              console.error('AI response error:', error);
              setAiResponse('Error getting AI response. Please try again.');
            } finally {
              setIsProcessingAI(false);
            }
          }
        } catch (error) {
          console.error('Transcription error:', error);
          setTranscribedText('Error transcribing audio. Please try again.');
        } finally {
          setIsTranscribing(false);
        }
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsTranscribing(false);
    }
  }

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
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
          {isRecording ? 'Recording...' : 
           isTranscribing ? 'Transcribing...' :
           isProcessingAI ? 'Getting AI Response...' :
           'Tap the microphone to start recording'}
        </Text>
        
        {transcribedText ? (
          <View style={styles.messageContainer}>
            <Text style={styles.transcriptionLabel}>You said:</Text>
            <Text style={styles.transcription}>{transcribedText}</Text>
          </View>
        ) : null}

        {aiResponse ? (
          <View style={styles.messageContainer}>
            <Text style={styles.aiResponseLabel}>AI Response:</Text>
            <Text style={styles.aiResponse}>{aiResponse}</Text>
          </View>
        ) : null}
        
        <Pressable 
          style={[
            styles.recordButton, 
            isRecording && styles.recordingButton,
            (isTranscribing || isProcessingAI) && styles.transcribingButton
          ]} 
          onPress={handleToggleRecording}
          disabled={isTranscribing || isProcessingAI}
        >
          <Ionicons 
            name={isRecording ? "stop" : (isTranscribing || isProcessingAI) ? "hourglass" : "mic"} 
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
    paddingHorizontal: 20,
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
  transcription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
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
  transcribingButton: {
    backgroundColor: '#999',
  },
  messageContainer: {
    width: '100%',
    marginBottom: 20,
  },
  transcriptionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  aiResponseLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    marginTop: 16,
  },
  aiResponse: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
  },
}); 