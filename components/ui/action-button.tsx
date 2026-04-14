import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface ActionButtonProps {
  text: string;
  onPress?: () => void;
  variant?: "blue" | "red" | "gray";
  icon?: string;
  iconPosition?: "left" | "right";
  style?: ViewStyle;
}

export function ActionButton({
  text,
  onPress,
  variant = "blue",
  icon,
  iconPosition = "right",
  style,
}: ActionButtonProps) {
  const buttonStyle = [
    styles.base,
    variant === "blue" && styles.blue,
    variant === "red" && styles.red,
    variant === "gray" && styles.gray,
    style,
  ];

  const textStyle = [
    styles.baseText,
    variant === "blue" && styles.blueText,
    variant === "red" && styles.redText,
    variant === "gray" && styles.grayText,
  ];

  return (
    <TouchableOpacity style={buttonStyle} activeOpacity={0.7} onPress={onPress}>
      {icon && iconPosition === "left" && (
        <Feather
          name={icon as any}
          size={16}
          color={
            variant === "blue"
              ? "#2563eb"
              : variant === "red"
                ? "#dc2626"
                : "#6b7280"
          }
          style={{ marginRight: 4 }}
        />
      )}
      <Text style={textStyle}>{text}</Text>
      {icon && iconPosition === "right" && (
        <Feather
          name={icon as any}
          size={16}
          color={
            variant === "blue"
              ? "#2563eb"
              : variant === "red"
                ? "#dc2626"
                : "#6b7280"
          }
          style={{ marginLeft: 4 }}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
  },
  baseText: {
    fontSize: 13,
    fontWeight: "700",
  },
  blue: {},
  blueText: {
    color: "#2563eb",
  },
  red: {},
  redText: {
    color: "#dc2626",
  },
  gray: {},
  grayText: {
    color: "#6b7280",
  },
});
