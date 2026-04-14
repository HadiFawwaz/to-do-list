import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ListItemProps {
  icon: string;
  text: string;
  onPress?: () => void;
  style?: ViewStyle;
  showChevron?: boolean;
}

export function ListItem({
  icon,
  text,
  onPress,
  style,
  showChevron = true,
}: ListItemProps) {
  return (
    <TouchableOpacity
      style={[styles.listItem, style]}
      activeOpacity={0.7}
      onPress={onPress}>
      <View style={styles.listItemLeft}>
        <Feather name={icon as any} size={18} color="#4b5563" />
        <Text style={styles.listItemText}>{text}</Text>
      </View>
      {showChevron && (
        <Feather name="chevron-right" size={18} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f4f6f9",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 12,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2933",
    marginLeft: 12,
  },
});
