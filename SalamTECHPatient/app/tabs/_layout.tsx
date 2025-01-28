import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: "#007AFF",
      tabBarInactiveTintColor: "#666",
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          tabBarLabel: "Profile",
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: "Manage Members",
          headerShown: true,
          href: null, // This hides it from the tab bar
        }}
      />
    </Tabs>
  );
} 