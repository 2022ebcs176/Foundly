import { Pressable, PressableProps, StyleSheet, Text } from "react-native";
import { colors } from "../constants/colors";

interface CategoryPillProps extends PressableProps {
  label: string;
  selected?: boolean;
  style?: PressableProps["style"];
}

export function CategoryPill({ label, selected, style, ...props }: CategoryPillProps) {
  return (
    <Pressable style={[styles.pill, selected && styles.selected, style]} {...props}>
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    color: colors.textSecondary,
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
  selected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  selectedText: {
    color: colors.surface,
  },
});
