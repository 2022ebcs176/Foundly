import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../constants/colors";

interface GradientBackgroundProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  topRadius?: number;
  bottomRadius?: number;
}

export function GradientBackground({
  children,
  style,
  topRadius = 0,
  bottomRadius = 0,
}: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={[colors.primaryStart, colors.primaryEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.gradient,
        {
          borderTopLeftRadius: topRadius,
          borderTopRightRadius: topRadius,
          borderBottomLeftRadius: bottomRadius,
          borderBottomRightRadius: bottomRadius,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
