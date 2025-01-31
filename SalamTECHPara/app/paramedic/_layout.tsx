import React from 'react';
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function ParamedicLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#FF3B30" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF3B30',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="dashboard"
          options={{
            title: "Emergency Dashboard",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="route"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="patientsList"
          options={{
            title: "Nearby Patients",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Scanner"
          options={{
            title: "QR Scanner",
            headerShown: true,
          }}
        />
      </Stack>
    </>
  );
} 