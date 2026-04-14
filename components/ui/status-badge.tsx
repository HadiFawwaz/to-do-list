import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatusBadgeProps {
  text: string;
  variant?: "gray" | "blue-light" | "blue";
  icon?: string;
}

export function StatusBadge({
  text,
  variant = "gray",
  icon,
}: StatusBadgeProps) {
  const badgeStyle = [
    styles.base,
    variant === "gray" && styles.gray,
    variant === "blue-light" && styles.blueLight,
    variant === "blue" && styles.blue,
  ];

  const textStyle = [
    styles.baseText,
    variant === "gray" && styles.grayText,
    variant === "blue-light" && styles.blueLightText,
    variant === "blue" && styles.blueText,
  ];

  return (
    <View style={badgeStyle}>
      {icon && (
        <Feather
          name={icon as any}
          size={12}
          color={variant === "gray" ? "#475569" : "#2563eb"}
          style={{ marginRight: 6 }}
        />
      )}
      <Text style={textStyle}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  baseText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  gray: {
    backgroundColor: "#f1f5f9",
  },
  grayText: {
    color: "#475569",
  },
  blueLight: {
    backgroundColor: "#eff6ff",
  },
  blueLightText: {
    color: "#2563eb",
    fontSize: 9,
    fontWeight: "800",
  },
  blue: {
    backgroundColor: "#2563eb",
  },
  blueText: {
    color: "#ffffff",
  },
});
