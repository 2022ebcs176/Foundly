import { ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { colors } from "../constants/colors";

interface RoundedInputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  icon?: ReactNode;
  multiline?: boolean;
  style?: TextInputProps["style"];
}

export function RoundedInput({
  label,
  helperText,
  icon,
  multiline,
  style: inputStyle,
  ...textInputProps
}: RoundedInputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholderTextColor={colors.textLight}
          style={[styles.input, multiline && styles.textArea, inputStyle]}
          multiline={multiline}
          {...textInputProps}
        />
        {icon && <View style={styles.icon}>{icon}</View>}
      </View>
      {helperText && <Text style={styles.helper}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 6,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  inputWrapper: {
    position: "relative",
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    color: colors.textPrimary,
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontFamily: "Poppins_400Regular",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  icon: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  helper: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: "Poppins_400Regular",
  },
});
