import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, orderBy, getDocs } from 'firebase/firestore';

interface ChatHistory {
  id: string;
  type: string;
  createdAt: Date;
  status: 'active' | 'resolved';
}

export default function Home() {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) return;

      const db = getFirestore();
      const q = query(
        collection(db, 'emergencies'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs.map(doc => ({
        id: doc.id,
        type: doc.data().type,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        status: doc.data().status
      }));

      setChatHistory(history);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const handleSOS = () => {
    // Add emergency contact logic here
    router.push("/emergency/type");
  };

  const handleVolunteer = () => {
    router.push("/volunteer");  // Changed from "/tabs/volunteer"
  };

  const handleChatSelect = (chatId: string) => {
    router.push({
      pathname: "/emergency/chat",
      params: { chatId }
    });
  };

  const renderChatItem = ({ item }: { item: ChatHistory }) => (
    <Pressable 
      style={styles.chatItem} 
      onPress={() => handleChatSelect(item.id)}
    >
      <View style={styles.chatItemContent}>
        <Text style={styles.chatType}>{item.type}</Text>
        <Text style={styles.chatDate}>
          {item.createdAt.toLocaleDateString()} {item.createdAt.toLocaleTimeString()}
        </Text>
      </View>
      <View style={[
        styles.statusIndicator, 
        { backgroundColor: item.status === 'active' ? '#34C759' : '#8E8E93' }
      ]} />
      <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
    </Pressable>
  );

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

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Recent Emergencies</Text>
        <FlatList
          data={chatHistory}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          style={styles.historyList}
          contentContainerStyle={styles.historyContent}
        />
      </View>
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
  historyContainer: {
    marginTop: 20,
    flex: 1,
    width: '100%',
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1C1C1E',
  },
  historyList: {
    flex: 1,
  },
  historyContent: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chatItemContent: {
    flex: 1,
  },
  chatType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  chatDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
}); 