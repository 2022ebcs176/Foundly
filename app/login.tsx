import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
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
import { validateEmail } from "../utils/auth";

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    setErrors({ email: "", password: "" });

    let hasError = false;
    const newErrors = { email: "", password: "" };

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
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      await login({ email: email.trim(), password });
    } catch (error: any) {
      if (error instanceof ApiError) {
        Alert.alert(
          "Login Failed",
          error.message || "Invalid email or password. Please try again.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Login Failed",
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
          <View style={styles.hero}>
            <Image source={require("../assets/images/splash-icon.png")} style={styles.crest} />
            <Text style={styles.heroTitle}>Login</Text>
          </View>

          <View style={styles.formCard}>
            <RoundedInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: "" });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Ionicons name="mail-outline" size={22} color={colors.primaryEnd} />}
              placeholder="your.email@example.com"
              editable={!isLoading}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            <RoundedInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: "" });
              }}
              secureTextEntry
              icon={<Ionicons name="lock-closed-outline" size={22} color={colors.primaryEnd} />}
              placeholder="********"
              editable={!isLoading}
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            
            <GradientButton
              containerStyle={styles.buttonSpacing}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                "Login"
              )}
            </GradientButton>
          </View>

          <Text style={styles.footerText}>
            Don’t have any account? <Link href="/register" style={styles.footerLink}>Sign up</Link>
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
    paddingBottom: 48,
  },
  hero: {
    alignItems: "center",
    gap: 12,
    paddingTop: 36,
  },
  crest: {
    width: 120,
    height: 120,
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 34,
    fontFamily: "JosefinSans_600SemiBold",
  },
  formCard: {
    marginTop: 24,
    borderRadius: 36,
    padding: 24,
    backgroundColor: "rgba(255,255,255,0.85)",
    gap: 18,
  },
  buttonSpacing: {
    marginTop: 8,
  },
  footerText: {
    marginTop: 24,
    textAlign: "center",
    color: "rgba(255,255,255,0.84)",
    fontFamily: "Poppins_400Regular",
  },
  footerLink: {
    color: colors.surface,
    textDecorationLine: "underline",
    fontFamily: "Poppins_500Medium",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginTop: -12,
  },
});
