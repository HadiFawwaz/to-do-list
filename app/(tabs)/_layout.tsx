import { Tabs } from "expo-router";
import React from "react";
import { View, Platform, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = "#6366f1"; 
  const inactiveColor = "#94a3b8"; 

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarButton: HapticTab,
        // Konfigurasi Bar Utama
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          height: Platform.OS === "ios" ? 90 : 75,
          paddingBottom: Platform.OS === "ios" ? 30 : 15,
          paddingTop: 10,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: "absolute",
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "800",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginTop: 5,
        },
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: "TASKS",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activePill]}>
              <Feather name="check-square" size={20} color={focused ? activeColor : color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="focus"
        options={{
          title: "FOCUS",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activePill]}>
              <Feather name="clock" size={20} color={focused ? activeColor : color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="archive"
        options={{
          title: "ARCHIVE",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activePill]}>
              <Feather name="archive" size={20} color={focused ? activeColor : color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "PROFILE",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activePill]}>
              <Feather name="user" size={20} color={focused ? activeColor : color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    // Ukuran wrapper harus konsisten supaya icon nggak lari
    width: 60,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  activePill: {
    backgroundColor: "#eff6ff", // Warna kapsul pas aktif
  },
});