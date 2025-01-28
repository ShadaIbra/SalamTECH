import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface SettingSection {
  title: string;
  settings: Setting[];
}

interface Setting {
  id: string;
  title: string;
  type: 'toggle' | 'link' | 'version';
  icon: keyof typeof Ionicons.glyphMap;
  value?: boolean;
  version?: string;
}

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  const handleSignOut = () => {
    router.replace("/onboarding/login");
  };

  const settingSections: SettingSection[] = [
    {
      title: "Notifications",
      settings: [
        {
          id: "notifications",
          title: "Push Notifications",
          type: "toggle",
          icon: "notifications-outline",
          value: notifications,
        },
        {
          id: "emergencyAlerts",
          title: "Emergency Alerts",
          type: "toggle",
          icon: "warning-outline",
          value: emergencyAlerts,
        },
      ],
    },
    {
      title: "Privacy & Security",
      settings: [
        {
          id: "locationSharing",
          title: "Location Sharing",
          type: "toggle",
          icon: "location-outline",
          value: locationSharing,
        },
        {
          id: "password",
          title: "Change Password",
          type: "link",
          icon: "lock-closed-outline",
        },
        {
          id: "privacy",
          title: "Privacy Settings",
          type: "link",
          icon: "shield-outline",
        },
      ],
    },
    {
      title: "Appearance",
      settings: [
        {
          id: "darkMode",
          title: "Dark Mode",
          type: "toggle",
          icon: "moon-outline",
          value: darkMode,
        },
      ],
    },
    {
      title: "About & Support",
      settings: [
        {
            id: "about",
            title: "About App",
            type: "link",
            icon: "information-circle-outline",
          },
        {
          id: "help",
          title: "Help & Support",
          type: "link",
          icon: "help-circle-outline",
        },
        {
          id: "terms",
          title: "Terms & Privacy Policy",
          type: "link",
          icon: "document-text-outline",
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {settingSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.settings.map((setting) => (
            <View key={setting.id} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name={setting.icon} size={24} color="#000" />
                <Text style={styles.settingTitle}>{setting.title}</Text>
              </View>
              {setting.type === "toggle" ? (
                <Switch
                  value={setting.value}
                  onValueChange={() => {}}
                  trackColor={{ false: "#767577", true: "#007AFF" }}
                  thumbColor={setting.value ? "#fff" : "#f4f3f4"}
                />
              ) : (
                <Ionicons name="chevron-forward" size={24} color="#000" />
              )}
            </View>
          ))}
        </View>
      ))}

      {/* Sign Out Button */}
      <View style={styles.signOutSection}>
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>

      {/* Version Text */}
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    marginTop: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: "#333",
  },
  signOutSection: {
    marginTop: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 12,
  },
  signOutText: {
    fontSize: 16,
    color: "#FF3B30",
  },
  versionText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    marginTop: 20,
    marginBottom: 20,
  },
}); 