import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

type ButtonVariant = "primary" | "outline" | "text" | "icon" | "fab";
type ButtonSize = "sm" | "md" | "lg";

type AppButtonProps = Omit<TouchableOpacityProps, "style"> & {
  label?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  labelStyle?: StyleProp<TextStyle>;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  variant?: ButtonVariant;
};

const sizeStyleMap: Record<ButtonSize, ViewStyle> = {
  sm: { paddingVertical: 8, paddingHorizontal: 12 },
  md: { paddingVertical: 12, paddingHorizontal: 16 },
  lg: { paddingVertical: 18, paddingHorizontal: 20 },
};
const buttonGradientColors: Record<ButtonVariant, [string, string]> = {
  primary: ["#8b5cf6", "#6366f1"],
  fab: ["#7c6df7", "#5f61f6"],
  outline: ["#ffffff", "#ffffff"],
  text: ["transparent", "transparent"],
  icon: ["#f8fafc", "#f8fafc"],
};

export function AppButton({
  activeOpacity = 0.85,
  disabled,
  icon,
  iconPosition = "left",
  label,
  labelStyle,
  onPress,
  size = "md",
  style,
  variant = "primary",
  ...rest
}: AppButtonProps) {
  const isIconOnly = !label && !!icon;
  const useGradient = variant === "primary" || variant === "fab";

  return (
    <TouchableOpacity
      {...rest}
      accessibilityRole="button"
      activeOpacity={activeOpacity}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        sizeStyleMap[size],
        variant === "primary" && styles.primary,
        variant === "outline" && styles.outline,
        variant === "text" && styles.text,
        variant === "icon" && styles.icon,
        variant === "fab" && styles.fab,
        disabled && styles.disabled,
        style,
      ]}>
      {useGradient && (
        <LinearGradient
          colors={buttonGradientColors[variant]}
          end={{ x: 1, y: 0.5 }}
          start={{ x: 0, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {icon && iconPosition === "left" && (
        <View style={label ? styles.iconLeft : undefined}>{icon}</View>
      )}
      {!!label && (
        <Text
          style={[
            styles.label,
            variant === "primary" && styles.labelPrimary,
            variant === "outline" && styles.labelOutline,
            variant === "text" && styles.labelText,
            variant === "icon" && styles.labelIcon,
            variant === "fab" && styles.labelPrimary,
            isIconOnly && styles.hiddenLabel,
            labelStyle,
          ]}>
          {label}
        </Text>
      )}
      {icon && iconPosition === "right" && (
        <View style={label ? styles.iconRight : undefined}>{icon}</View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  primary: {
    backgroundColor: "#8b5cf6",
  },
  outline: {
    backgroundColor: "#fff",
    borderColor: "#e2e8f0",
    borderWidth: 1,
  },
  text: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  icon: {
    backgroundColor: "#f8fafc",
    borderRadius: 15,
    height: 30,
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: 30,
  },
  fab: {
    backgroundColor: "#6366f1",
    borderRadius: 32.5,
    elevation: 6,
    height: 65,
    paddingHorizontal: 0,
    paddingVertical: 0,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    width: 65,
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
  },
  labelPrimary: {
    color: "#fff",
  },
  labelOutline: {
    color: "#475569",
  },
  labelText: {
    color: "#6366f1",
    fontSize: 16,
  },
  labelIcon: {
    color: "#1e293b",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  hiddenLabel: {
    display: "none",
  },
});
