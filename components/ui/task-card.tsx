import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Badge } from "./badge";

interface TaskCardProps {
  variant: "today" | "history" | "upcoming-small" | "rest-upcoming" | "archive";
  title: string;
  description?: string;
  badge?: string;
  badgeType?:
    | "high-priority"
    | "steady-pace"
    | "low-focus"
    | "overdue"
    | "today"
    | "upcoming";
  isCompleted?: boolean;
  isOverdue?: boolean;
  meta?: string;
  icon?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  onCheckPress?: () => void;
  style?: ViewStyle;
}

export function TaskCard({
  variant,
  title,
  description,
  badge,
  badgeType,
  isCompleted = false,
  isOverdue = false,
  meta,
  icon = "check-circle",
  onPress,
  onLongPress,
  onCheckPress,
  style,
}: TaskCardProps) {
  if (variant === "today") {
    return (
      <TouchableOpacity
        style={[styles.todayCard, style]}
        activeOpacity={0.92}
        onPress={onPress}
        onLongPress={onLongPress}>
        <TouchableOpacity style={styles.todayCheckBtn} onPress={onCheckPress}>
          <Feather
            name={isCompleted ? "check-circle" : "circle"}
            size={24}
            color={isCompleted ? "#6366f1" : "#a7adb9"}
          />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          {badge && badgeType && <Badge type={badgeType} text={badge} />}
          <Text style={styles.todayTitle}>{title}</Text>
          {meta && (
            <View style={styles.todayMetaRow}>
              <Feather
                name="clock"
                size={11}
                color="#8f96a4"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.todayMetaText}>{meta}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === "history") {
    return (
      <TouchableOpacity
        style={[styles.historyCard, style]}
        activeOpacity={0.92}
        onPress={onPress}>
        <View style={{ flex: 1 }}>
          <Text style={styles.historyTitle}>{title}</Text>
          {meta && <Text style={styles.historyMeta}>{meta}</Text>}
        </View>
        <Feather name="check-circle" size={18} color="#6366f1" />
      </TouchableOpacity>
    );
  }

  if (variant === "rest-upcoming") {
    return (
      <TouchableOpacity
        style={[styles.restUpcomingCard, style]}
        activeOpacity={0.92}
        onPress={onPress}
        onLongPress={onLongPress}>
        <Text style={styles.restUpcomingTitle}>{title}</Text>
        {badge && <Text style={styles.restUpcomingMeta}>{badge}</Text>}
      </TouchableOpacity>
    );
  }

  if (variant === "archive") {
    return (
      <View style={[styles.archiveCard, style]}>
        <View style={styles.checkCircle}>
          <Feather name="check" size={12} color="#fff" />
        </View>
        <View style={styles.taskInfo}>
          <Text style={styles.archiveTaskTitle}>{title}</Text>
          {badge && badgeType && <Badge type={badgeType} text={badge} />}
          {!badge && meta && <Text style={styles.archiveTaskMeta}>{meta}</Text>}
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  todayCard: {
    backgroundColor: "#f7f8fb",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 11,
  },
  todayCheckBtn: { paddingTop: 12, marginRight: 12 },
  todayTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3a3f47",
    lineHeight: 22,
  },
  todayMetaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  todayMetaText: { fontSize: 12, color: "#8f96a4" },
  historyCard: {
    backgroundColor: "#f7f8fb",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3d4450",
  },
  historyMeta: { fontSize: 12, color: "#7d8594", marginTop: 4 },
  restUpcomingCard: {
    backgroundColor: "#f7f8fb",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  restUpcomingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3d4450",
    flex: 1,
  },
  restUpcomingMeta: { fontSize: 11, fontWeight: "700", color: "#7e8695" },
  archiveCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#524ee6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  taskInfo: { flex: 1 },
  archiveTaskTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#616874",
    marginBottom: 4,
  },
  archiveTaskMeta: {
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
