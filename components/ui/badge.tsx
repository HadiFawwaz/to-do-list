import React from "react";
import { StyleSheet, Text, View } from "react-native";

type BadgeType =
  | "high-priority"
  | "steady-pace"
  | "low-focus"
  | "overdue"
  | "today"
  | "upcoming";

interface BadgeProps {
  type: BadgeType;
  text: string;
}

const badgeStyleMap: Record<
  BadgeType,
  { backgroundColor: string; textColor: string }
> = {
  "high-priority": {
    backgroundColor: "#f7e7f8",
    textColor: "#b532c4",
  },
  "steady-pace": {
    backgroundColor: "#ebeefe",
    textColor: "#585ce5",
  },
  "low-focus": {
    backgroundColor: "#e9edf4",
    textColor: "#6f7786",
  },
  overdue: {
    backgroundColor: "#ffe3e3",
    textColor: "#d83333",
  },
  today: {
    backgroundColor: "#ddeafe",
    textColor: "#2563eb",
  },
  upcoming: {
    backgroundColor: "#f3f4f6",
    textColor: "#6b7280",
  },
};

export function Badge({ type, text }: BadgeProps) {
  const style = badgeStyleMap[type];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: style.backgroundColor,
        },
      ]}>
      <Text style={[styles.badgeText, { color: style.textColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
});
