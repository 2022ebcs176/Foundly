import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import {
    Pressable,
    PressableProps,
    PressableStateCallbackType,
    StyleProp,
    StyleSheet,
    Text,
    ViewStyle,
} from "react-native";
import { colors } from "../constants/colors";

interface GradientButtonProps extends PressableProps {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export function GradientButton({ children, containerStyle, ...props }: GradientButtonProps) {
  return (
    <Pressable {...props}>
      {(state: PressableStateCallbackType) => (
        <LinearGradient
          colors={[colors.primaryStart, colors.primaryEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, containerStyle, state.pressed && styles.pressed]}
        >
          <Text style={styles.text}>{children}</Text>
        </LinearGradient>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  text: {
    color: colors.surface,
    fontSize: 18,
    fontFamily: "JosefinSans_600SemiBold",
    letterSpacing: 1,
    textTransform: "capitalize",
  },
  pressed: {
    opacity: 0.85,
  },
});
