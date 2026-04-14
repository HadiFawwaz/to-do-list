import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  count?: number;
  showSeeAll?: boolean;
  seeAllText?: string;
  collapsed?: boolean;
  onSeeAllPress?: () => void;
  disableSeeAll?: boolean;
}

export function SectionHeader({
  title,
  count,
  showSeeAll = false,
  seeAllText = "See all",
  collapsed = false,
  onSeeAllPress,
  disableSeeAll = false,
}: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {count !== undefined && !showSeeAll && (
          <View style={styles.badgeCount}>
            <Text style={styles.badgeCountText}>{count} TASKS</Text>
          </View>
        )}
      </View>
      {showSeeAll && (
        <TouchableOpacity disabled={disableSeeAll} onPress={onSeeAllPress}>
          <Text
            style={[styles.seeAllText, disableSeeAll && styles.seeAllDisabled]}>
            {collapsed ? "Collapse" : seeAllText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#323840",
    letterSpacing: -0.3,
  },
  badgeCount: {
    backgroundColor: "#dde2ea",
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
  },
  badgeCountText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6a7380",
    letterSpacing: 0.6,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#666ff0",
  },
  seeAllDisabled: {
    color: "#c5cbda",
  },
});
