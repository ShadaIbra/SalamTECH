import { Stack } from "expo-router";

export default function MemberLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="members"
        options={{
          title: "Family Members",
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          title: "Add Member",
          headerTitleStyle: {
            fontWeight: "600",
          },
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Member Details",
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      />
    </Stack>
  );
} 