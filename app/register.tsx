import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
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
import { API_BASE_URL } from "../constants/api";
import { colors } from "../constants/colors";
import { authService } from "../services/auth.service";
import { ApiError } from "../utils/api";
import { testBackendConnection, testInternetConnection } from "../utils/network-test";

export default function RegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", email: "", password: "", confirmPassword: "" });

  const handleSignUp = async () => {
    setErrors({ username: "", email: "", password: "", confirmPassword: "" });

    let hasError = false;
    const newErrors = { username: "", email: "", password: "", confirmPassword: "" };

    // Validate username
    if (!username.trim()) {
      newErrors.username = "Username is required";
      hasError = true;
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      hasError = true;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!emailRegex.test(email)) {
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
      setIsLoading(true);
      
      // Call the real backend API
      await authService.register({
        username: username.trim(),
        email: email.trim(),
        password: password,
      });
      
      // Registration successful
      Alert.alert(
        "Success",
        "Account created successfully! Please login.",
        [{ text: "OK", onPress: () => router.replace("/login") }]
      );
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNetwork = async () => {
    setIsLoading(true);
    try {
      // Test internet connection first
      const internetTest = await testInternetConnection();
      console.log('Internet test:', internetTest);
      
      if (!internetTest.success) {
        Alert.alert(
          "❌ No Internet",
          "Your device has no internet connection. Please check WiFi/Data.",
          [{ text: "OK" }]
        );
        return;
      }
      
      // Test backend connection
      const backendTest = await testBackendConnection(API_BASE_URL);
      console.log('Backend test:', backendTest);
      
      if (backendTest.success) {
        Alert.alert(
          "✅ Connection OK",
          `Internet: Working ✅\nBackend: Reachable ✅\nURL: ${API_BASE_URL}\nStatus: ${backendTest.statusCode}`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "⚠️ Backend Offline",
          `Internet: Working ✅\nBackend: Not Running ❌\n\nURL: ${API_BASE_URL}\n\nPlease start your Spring Boot server on port 9292.`,
          [{ text: "OK" }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Network Test Failed",
        error.message || "Unknown error",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
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
              label="Username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setErrors({ ...errors, username: "" });
              }}
              placeholder="johndoe"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
            
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

            {/* Network Test Button - For Debugging */}
            <GradientButton
              containerStyle={styles.buttonSpacing}
              onPress={handleTestNetwork}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                "🔍 Test Network Connection"
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
