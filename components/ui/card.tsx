import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "white" | "gray" | "outlined";
}

export function Card({ children, style, variant = "white" }: CardProps) {
  const cardStyle = [
    styles.base,
    variant === "white" && styles.white,
    variant === "gray" && styles.gray,
    variant === "outlined" && styles.outlined,
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  white: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  gray: {
    backgroundColor: "#eef2f6",
  },
  outlined: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fbfbfc",
  },
});
