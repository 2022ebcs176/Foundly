import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { GradientButton } from "../components/GradientButton";
import { RoundedInput } from "../components/RoundedInput";
import { colors } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "../utils/api";
import { validateEmail, validatePassword } from "../utils/auth";

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });

  const handleSignUp = async () => {
    setErrors({ name: "", email: "", phone: "", password: "", confirmPassword: "" });

    let hasError = false;
    const newErrors = { name: "", email: "", phone: "", password: "", confirmPassword: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required";
      hasError = true;
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      hasError = true;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      hasError = true;
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
        hasError = true;
      }
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
    } catch (error: any) {
      if (error instanceof ApiError) {
        Alert.alert(
          "Registration Failed",
          error.message || "Unable to create account. Please try again.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Registration Failed",
          "An unexpected error occurred. Please try again.",
          [{ text: "OK" }]
        );
      }
    }
  };

  return (
    <LinearGradient colors={[colors.primaryStart, colors.primaryEnd]} style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Sign Up</Text>

          <View style={styles.formCard}>
            <RoundedInput
              label="Full Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors({ ...errors, name: "" });
              }}
              placeholder="John Doe"
              editable={!isLoading}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            
            <RoundedInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: "" });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="your.email@example.com"
              editable={!isLoading}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            
            <RoundedInput
              label="Phone (Optional)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+91 1234567890"
              editable={!isLoading}
            />
            
            <RoundedInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: "" });
              }}
              secureTextEntry
              placeholder="********"
              editable={!isLoading}
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            
            <RoundedInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors({ ...errors, confirmPassword: "" });
              }}
              secureTextEntry
              placeholder="********"
              editable={!isLoading}
            />
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            
            <GradientButton
              containerStyle={styles.buttonSpacing}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                "Sign Up"
              )}
            </GradientButton>
          </View>

          <Text style={styles.footerText}>
            Already have an account? <Link href="/login" style={styles.footerLink}>Sign in</Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 48,
  },
  title: {
    color: colors.surface,
    fontSize: 34,
    fontFamily: "JosefinSans_600SemiBold",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 32,
  },
  formCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 32,
    padding: 24,
    paddingTop: 32,
    paddingBottom: 32,
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonSpacing: {
    marginTop: 8,
  },
  footerText: {
    color: "rgba(255,255,255,0.88)",
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    textAlign: "center",
    marginTop: 24,
  },
  footerLink: {
    color: colors.surface,
    fontFamily: "Poppins_600SemiBold",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginTop: -12,
  },
});
