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
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
} 