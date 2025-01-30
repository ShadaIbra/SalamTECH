import { Stack } from "expo-router";

export default function EmergencyLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="type" 
        options={{
          title: "Emergency",
          headerStyle: {
            backgroundColor: "#FF3B30",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerBackVisible: true,
        }}
      />
      <Stack.Screen 
        name="recipient"
        options={{
          title: "Who Needs Help",
          headerStyle: {
            backgroundColor: "#FF3B30",
          },
          headerTintColor: "#fff",
          headerBackVisible: true,
        }}
      />
      <Stack.Screen 
        name="chat" 
        options={{
          title: "Emergency Chat",
          headerStyle: {
            backgroundColor: "#FF3B30",
          },
          headerTintColor: "#fff",
          headerBackVisible: true,
        }}
      />
      <Stack.Screen 
        name="voice-input/[chatId]" 
        options={{
          title: "Voice Input",
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack>
  );
} 