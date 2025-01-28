import { Stack } from "expo-router";
import { UserProvider } from '../app/utils/userContext';


export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="tabs" />
        <Stack.Screen 
          name="emergency" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }} 
        />
        
        <Stack.Screen 
          name="volunteer/index" 
          options={{
            headerShown: true,
            title: "Volunteer",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
            },
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen 
          name="member/[id]" 
          options={{
            headerShown: true,
            title: "Member Details",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
            },
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen 
          name="settings" 
          options={{
            headerShown: true,
            title: "Settings",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
            },
            headerTitleAlign: "center",
            contentStyle: {
              paddingTop: 10,
            },
          }}
        />
        <Stack.Screen 
          name="tabs/members" 
          options={{
            headerShown: true,
            title: "Manage Members",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
            },
            headerTitleAlign: "center",
            contentStyle: {
              paddingTop: 30,
            },
          }}
        />
      </Stack>
    </UserProvider>
  );
}
