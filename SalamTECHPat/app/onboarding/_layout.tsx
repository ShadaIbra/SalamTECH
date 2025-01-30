import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerTitle: "Login" }} />
      <Stack.Screen name="register" options={{ headerTitle: "Register" }} />
      <Stack.Screen
        name="forgotPassword"
        options={{ headerTitle: "Reset Password" }}
      />
      <Stack.Screen 
        name="verification" 
        options={{ 
          headerTitle: "Verification",
          headerBackVisible: false // Prevents going back to register
        }} 
      />
    </Stack>
    
  );
} 