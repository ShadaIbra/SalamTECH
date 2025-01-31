import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import { openai } from '../../utils/openai';
import * as Speech from 'expo-speech';
import { getAuth } from 'firebase/auth';

export default function VoiceInput() {
  const { chatId } = useLocalSearchParams();
  const router = useRouter();

  if (!chatId || typeof chatId !== 'string') {
    router.back();
    return null;
  }

  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      Speech.stop();
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

  const stopRecording = async () => {
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
              const emergencyDoc = await getDoc(doc(db, 'emergencies', chatId));
              const emergencyData = emergencyDoc.data();
              
              if (!emergencyData) {
                console.error("No emergency data found");
                return;
              }

              const response = await openai.chat.completions.create({
                messages: [
                  {
                    role: 'system',
                    content: `You are an emergency response virtual assistant. 
Context: Speaking with ${emergencyData.name || 'Unknown'} (Age: ${emergencyData.age || 'Unknown'})
Emergency Type: ${emergencyData.type}
For: ${emergencyData.recipient === 'self' ? 'Self' : 'Someone Else'}

Your role is to:
- Handle this ${emergencyData.type} emergency situation
- Ask clear, specific questions about the emergency
- Prioritize gathering critical information 
- Keep responses under 3 sentences

we are trying to collect the following information, you dont have to collect them all, ask relevant questions based on the answer of the user. you dont have to ask to ask too many questions regarding one point as we are only collecting this information, make the questions simple for normal people to understand:
1. Breathing (false/ acute/ true)
2. Seizure (current/post/false)
3. Burn (face/electrical/circumferential/ chemical/ other/ false)
4. Cardiac arrest (true/false)
6. Fever (true/false)
7. Dislocation (large joint/ finger/ toe/ false)
8. Fracture (compound/ closed/ false)
9. Haemorrhage (uncontrolled/ controlled/ false)
10. Vomiting blood (true/ false)
11. Vomiting presistent (true/ false)
12. coughing blood (true/false)
13. some of unconsiosness (true/false)
14. Stabbed neck (true/ false)
15. facial drooping (true/ false)
16. aggression (true/ false)
17. eye injury (true/ false)
18. poisoning/ overdose (true/false)
19. limb cyanosis (true/ false)
20. pregnant (true/ false)
21. scale of pain (severe (5-10), moderate (1-5))

Guidelines:
- Keep all responses brief and direct
- Ask one question at a time
- Wait for an answer before moving to next question
- Do not repeat questions already answered
- Do not suggest medical conditions
- Focus on gathering essential information
- Emergency services will be notified automatically

- Provide brief, actionable instructions when needed
- Maintain a calm, professional tone
- Use the user's name (${emergencyData.name}) occasionally to personalize responses
- Consider the user's age (${emergencyData.age}) when providing guidance`
                  },
                  {
                    role: 'user',
                    content: transcription
                  }
                ],
                model: 'gpt-3.5-turbo',
                max_tokens: 150,
                temperature: 0.3,
              });

              const aiMessage = response.choices[0].message.content;
              await handleAIResponse(aiMessage);

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
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing your voice input');
    }
  };

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

  const speakAIResponse = async (text: string) => {
    try {
      await Speech.stop();
      await Speech.speak(text, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
      });
    } catch (error) {
      console.error('Speech error:', error);
    }
  };

  const handleAIResponse = async (aiMessage: string | null) => {
    setAiResponse(aiMessage || 'Sorry, I could not process that.');
    if (aiMessage) {
      await speakAIResponse(aiMessage);
    }
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

function calculateAge(dateOfBirth: string | null): string {
  if (!dateOfBirth) return '';
  
  const [year, month, day] = dateOfBirth.split('/');
  const dob = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const today = new Date();
  
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age.toString();
} 