import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PageHeaderProps {
  title: string;
  description: string;
  superTitle?: string;
}

export function PageHeader({
  title,
  description,
  superTitle,
}: PageHeaderProps) {
  return (
    <View style={styles.header}>
      {superTitle && <Text style={styles.superTitle}>{superTitle}</Text>}
      <Text style={styles.pageTitle}>{title}</Text>
      <Text style={styles.pageDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 32,
  },
  superTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#1d4ed8",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 42,
    fontWeight: "800",
    color: "#272f3a",
    letterSpacing: -1,
    marginBottom: 16,
  },
  pageDescription: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 24,
  },
});
