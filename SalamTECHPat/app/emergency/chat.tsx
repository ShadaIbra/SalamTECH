import { View, Text, StyleSheet, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { openai } from '../utils/openai';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface EmergencyQuestions {
  question: string;
  answer: string;
}

interface EmergencyData {
  userId: string;
  name: string;
  age: string;
  type: string;
  location: string;
  recipient: 'self' | 'other';
  status: 'active' | 'resolved';
  createdAt: any; // FirebaseTimestamp
  userData: {
    name: string | null;
    email: string | null;
    dateOfBirth?: string | null;
  } | null;
  emergencyQuestions: EmergencyQuestions[];
  veryUrgentQuestions: EmergencyQuestions[];
  urgentQuestions: EmergencyQuestions[];
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: '',
    sender: 'ai',
    timestamp: new Date(),
  }
];

function calculateAge(dateOfBirth: string | null): string {
  if (!dateOfBirth) return '';
  
  // Split the "year/month/day" format
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

export default function EmergencyChat() {
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(null);
  
  const params = useLocalSearchParams();
  const type = params.type as string;
  const recipient = params.recipient as 'self' | 'other';
  
  const router = useRouter();
  
  console.log('Type:', type, 'Recipient:', recipient);

  useEffect(() => {
    initializeEmergencyChat();
  }, []);

  const initializeEmergencyChat = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.error("No user logged in");
        return;
      }

      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      // Combine first and last name
      const fullName = userData ? 
        `${userData.firstName || ''} ${userData.lastName || ''}`.trim() : '';
      
      const dateOfBirth = userData?.dateOfBirth || null;
      const calculatedAge = calculateAge(dateOfBirth);
      
      console.log('User Data:', {
        uid: user.uid,
        fullName,
        dateOfBirth,
        calculatedAge,
        firestoreData: userData
      });

      const emergencyData: EmergencyData = {
        userId: user.uid,
        name: recipient === 'self' ? fullName : '',
        age: recipient === 'self' ? calculatedAge : '',
        type: type,
        location: '',
        recipient: recipient,
        status: 'active',
        createdAt: serverTimestamp(),
        userData: recipient === 'self' ? {
          name: fullName,
          email: user.email,
          dateOfBirth: dateOfBirth
        } : null,
        emergencyQuestions: [],
        veryUrgentQuestions: [],
        urgentQuestions: [],
      };

      console.log('Emergency Data being saved:', emergencyData);

      const docRef = await addDoc(
        collection(db, 'emergencies'),
        emergencyData
      );

      setChatId(docRef.id);
      setEmergencyData(emergencyData);
      
      // Initialize chat with a system message
      const initialMessage: Message = {
        id: '0',
        text: recipient === 'self' 
          ? `Emergency Type: ${type}\nFor: Myself (${fullName || 'Unknown'}, Age: ${calculatedAge || 'Unknown'})`
          : `Emergency Type: ${type}\nFor: Someone Else`,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages([initialMessage]);

    } catch (error) {
      console.error("Error initializing emergency chat:", error);
    }
  };

  const updateEmergencyData = async (field: keyof EmergencyData, value: any) => {
    if (!chatId) return;

    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'emergencies', chatId), {
        [field]: value
      });

      setEmergencyData(prev => prev ? {...prev, [field]: value} : null);
    } catch (error) {
      console.error("Error updating emergency data:", error);
    }
  };

  const addQuestionAnswer = async (
    type: 'emergencyQuestions' | 'veryUrgentQuestions' | 'urgentQuestions',
    question: string,
    answer: string
  ) => {
    if (!chatId || !emergencyData) return;

    const updatedQuestions = [...(emergencyData[type] || []), { question, answer }];
    await updateEmergencyData(type, updatedQuestions);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const db = getFirestore();
      await addDoc(
        collection(db, `emergencies/${chatId}/messages`),
        {
          content: newMessage,
          role: 'user',
          timestamp: serverTimestamp()
        }
      );

      const messageHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));

      const response = await openai.chat.completions.create({
        messages: [
          {
            role: 'system' as const,
            content: `You are a concise emergency response assistant. Do not express empathy or gratitude. If the user doesnt answer the questions once, dont ask directly again and reply to what they are saying instead.Here are the instructions: 

Initial Questions, ask one by one and dont insist:
1. "What is your name?" - Save this to 'name' field
2. "What is your age?" - Save this to 'age' field

we are trying to collect the following information, you dont have to collect them all, ask relevant questions based on the answer of the user. you dont have to ask to ask too many questions regarding one point as we are only collecting this information:
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
- Emergency services will be notified automatically`
          },
          ...messageHistory,
          {
            role: 'user' as const,
            content: newMessage
          }
        ],
        model: 'gpt-3.5-turbo',
        max_tokens: 50,
        temperature: 0.5,
      });

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: response.choices[0].message.content || 'Sorry, I could not process that.',
        sender: 'ai',
        timestamp: new Date(),
      };

      // Process AI response for data collection
      const aiResponse = response.choices[0].message.content;
      if (aiResponse) {
        // Check for name question/answer
        if (aiResponse.toLowerCase().includes('what is your name') && newMessage) {
          await updateEmergencyData('name', newMessage);
        }
        // Check for age question/answer
        else if (aiResponse.toLowerCase().includes('what is your age') && newMessage) {
          await updateEmergencyData('age', newMessage);
        }
        // Check for location question/answer
        else if (aiResponse.toLowerCase().includes('location') && newMessage) {
          await updateEmergencyData('location', newMessage);
        }
        // // Add to appropriate question category
        // else if (emergencyData?.emergencyQuestions.length < 5) {
        //   await addQuestionAnswer('emergencyQuestions', aiResponse, newMessage);
        // }
        // else if (emergencyData?.veryUrgentQuestions.length < 24) {
        //   await addQuestionAnswer('veryUrgentQuestions', aiResponse, newMessage);
        // }
        // else if (emergencyData?.urgentQuestions.length < 10) {
        //   await addQuestionAnswer('urgentQuestions', aiResponse, newMessage);
        // }
      }

      setMessages(prev => [...prev, aiMessage]);

      await addDoc(
        collection(db, `emergencies/${chatId}/messages`),
        {
          content: response.choices[0].message.content,
          role: 'assistant',
          timestamp: serverTimestamp()
        }
      );

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (chatId) {
      router.push({
        pathname: '/emergency/voice-input/[chatId]',
        params: { chatId }
      });
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender === 'user' ? styles.userMessageText : styles.aiMessageText
      ]}>
        {item.text}
      </Text>
      <Text style={[
        styles.timestamp,
        item.sender === 'user' ? styles.userTimestamp : styles.aiTimestamp
      ]}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 20}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          multiline
          onFocus={scrollToBottom}
        />
        <Pressable style={styles.voiceButton} onPress={handleVoiceInput}>
          <Ionicons name="mic" size={24} color="white" />
        </Pressable>
        {isLoading ? (
          <View style={styles.sendButton}>
            <ActivityIndicator color="#fff" />
          </View>
        ) : (
          <Pressable style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="white" />
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    backgroundColor: "#007AFF",
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: "#E5E5EA",
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },
  userMessageText: {
    color: "#fff",
  },
  aiMessageText: {
    color: "#000",
  },
  timestamp: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  aiTimestamp: {
    color: "rgba(0, 0, 0, 0.5)",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  voiceButton: {
    backgroundColor: "#34C759",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    backgroundColor: "#FF3B30",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});


