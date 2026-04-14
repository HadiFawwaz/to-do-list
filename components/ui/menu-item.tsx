import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MenuItemProps {
  icon: string;
  label: string;
  color: string;
  iconColor: string;
  last?: boolean;
  onPress?: () => void;
  subLabel?: string;
}

export function MenuItem({
  icon,
  label,
  color,
  iconColor,
  last,
  onPress,
  subLabel,
}: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, !last && styles.borderBottom]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconBox, { backgroundColor: color }]}>
          <Feather name={icon as any} size={20} color={iconColor} />
        </View>
        <View style={{ marginLeft: 16 }}>
          <Text style={styles.menuLabel}>{label}</Text>
          {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
        </View>
      </View>
      <Feather name="chevron-right" size={20} color="#cbd5e1" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2933",
  },
  subLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
});
