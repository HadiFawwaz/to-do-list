import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AppHeaderProps {
  avatarUri: string;
  title?: string;
  onSettingsPress?: () => void;
}

export function AppHeader({
  avatarUri,
  title = "Kinetic Flow",
  onSettingsPress,
}: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onSettingsPress}>
        <Feather name="settings" size={20} color="#4a515c" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 18,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: "#d1d5db",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3138",
  },
});
