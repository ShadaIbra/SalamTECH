import { View, Text, StyleSheet, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { openai } from '../utils/openai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: '',
    sender: 'ai',
    timestamp: new Date(),
  }
];

export default function EmergencyChat() {
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Send initial AI message when chat opens
    const sendInitialMessage = async () => {
      setIsLoading(true);
      try {
        const response = await openai.chat.completions.create({
          messages: [
            {
              role: 'system' as const,
              content: 'You are a helpful emergency response assistant.'
            },
            {
              role: 'user' as const,
              content: 'I need emergency help.'
            }
          ],
          model: 'gpt-3.5-turbo',
          max_tokens: 30,
          temperature: 0.5,
        });

        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: "Emergency services have been notified. I'm here to help you with your emergency. First, please tell me your name.",
          sender: 'ai',
          timestamp: new Date(),
        };

        setMessages([welcomeMessage]);
      } catch (error) {
        console.error('OpenAI API Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    sendInitialMessage();
  }, []);

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
      const messageHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));

      const response = await openai.chat.completions.create({
        messages: [
          {
            role: 'system' as const,
            content: `You are a concise emergency response assistant. Do not express empathy or gratitude. Here are the instructions: 
- start with "What is your name?" 
- Ask "What is your age?"

- Ask "Where does it hurt?" or ask specific questions about their symptoms. 
- Ask detailed follow-up questions about their condition. 
- If asked for first aid guidance, provide direct instructions without additional commentary. 
- Keep all responses brief and to the point without unnecessary pleasantries. 
- Emergency services will be notified automatically, so do not advise contacting them. 
- Avoid repeating the same questions; instead, ask more follow-up questions. 
- Do not recommend actions that the person in crisis cannot perform. 
- Avoid suggesting possible medical conditions to not alarm the person. 
- Remember, the person is in a crisis; consider the context of the injury or issue when interacting.`
          },
          ...messageHistory,
          {
            role: 'user' as const,
            content: newMessage
          }
        ],
        model: 'gpt-3.5-turbo',
        max_tokens: 100,
        temperature: 0.5,
      });

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: response.choices[0].message.content || 'Sorry, I could not process that.',
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('OpenAI API Error:', error);
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
  sendButton: {
    backgroundColor: "#FF3B30",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});


