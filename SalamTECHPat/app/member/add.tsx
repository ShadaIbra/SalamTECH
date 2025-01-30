import { View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Ionicons } from "@expo/vector-icons";

export default function AddMember() {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');

  const handleAddMember = async () => {
    if (!name || !relation) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const auth = getAuth();
    const db = getFirestore();
    
    if (auth.currentUser) {
      try {
        const membersRef = collection(db, `users/${auth.currentUser.uid}/members`);
        await addDoc(membersRef, {
          name,
          relation,
          createdAt: new Date().toISOString()
        });
        
        router.back();
      } catch (error) {
        console.error("Error adding member:", error);
        Alert.alert("Error", "Failed to add family member");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Add Family Member</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter member's name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Relation</Text>
          <TextInput
            style={styles.input}
            value={relation}
            onChangeText={setRelation}
            placeholder="Enter relation (e.g., Son, Daughter)"
          />
        </View>

        <Pressable 
          style={styles.addButton}
          onPress={handleAddMember}
        >
          <Text style={styles.addButtonText}>Add Member</Text>
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
  header: {
    backgroundColor: "white",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
}); 