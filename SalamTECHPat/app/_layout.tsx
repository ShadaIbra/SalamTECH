import { Stack } from "expo-router";
import { UserProvider } from './utils/userContext';
import { Pressable } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen 
          name="volunteer" 
          options={{
            headerShown: true,
            title: "Volunteer",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerTintColor: "#007AFF",
            presentation: 'card',
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={{ marginLeft: 16 }}>
                <Ionicons name="chevron-back" size={24} color="#007AFF" />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen 
          name="emergency" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }} 
        />
        <Stack.Screen 
          name="member" 
          options={{
            headerShown: true,
            title: "Members",
          }}
        />
        <Stack.Screen 
          name="settings" 
          options={{
            headerShown: true,
            title: "Settings",
          }}
        />
        <Stack.Screen name="home" />
      </Stack>
    </UserProvider>
  );
}
