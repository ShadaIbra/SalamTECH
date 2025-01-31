import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { getAuth } from 'firebase/auth';
import { collection, query, getDocs, getFirestore } from 'firebase/firestore';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const auth = getAuth();
      const db = getFirestore();
      
      if (auth.currentUser) {
        const membersRef = collection(db, `users/${auth.currentUser.uid}/members`);
        const querySnapshot = await getDocs(query(membersRef));
        
        const membersList: Member[] = [];
        querySnapshot.forEach((doc) => {
          membersList.push({
            id: doc.id,
            ...doc.data() as Omit<Member, 'id'>
          });
        });
        
        setMembers(membersList);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderMemberItem = ({ item }: { item: Member }) => (
    <Pressable 
      style={styles.memberItem}
      onPress={() => router.push(`/member/${item.id}`)}
    >
      <View style={styles.memberIcon}>
        <Ionicons name="person" size={24} color="#007AFF" />
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{`${item.firstName} ${item.lastName}`}</Text>
        <Text style={styles.memberRelationship}>{item.relationship}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={members}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No members added yet</Text>
          </View>
        }
      />
      
      <Pressable 
        style={styles.addButton}
        onPress={() => router.push("/member/add")}
      >
        <Ionicons name="add" size={24} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 1,
  },
  memberIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  memberInfo: {
    flex: 1,
    marginLeft: 15,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  memberRelationship: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 