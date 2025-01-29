import { Stack } from "expo-router";
import { UserProvider } from './utils/userContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="home" />
        <Stack.Screen 
          name="emergency" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }} 
        />
        <Stack.Screen 
          name="volunteer" 
          options={{
            headerShown: true,
            title: "Volunteer",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerTintColor: "#000",
          }}
        />
        <Stack.Screen 
          name="member" 
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen 
          name="settings" 
          options={{
            headerShown: true,
            title: "Settings",
          }}
        />
      </Stack>
    </UserProvider>
  );
}
