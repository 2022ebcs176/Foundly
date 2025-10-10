import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
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

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // Navigate to home
    router.push("/home");
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
              label="first name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="lost&foundxxxx"
            />
            <RoundedInput
              label="last name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="lost&foundxxxx"
            />
            <RoundedInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="lost&found@xxxxgamil.com"
            />
            <RoundedInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="x x x x x x x x"
            />
            <RoundedInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="x x x x x x x x"
            />
            <GradientButton
              containerStyle={styles.buttonSpacing}
              onPress={handleSignUp}
            >
              Sign Up
            </GradientButton>
          </View>

          <Text style={styles.footerText}>
            Already have any account? <Link href="/login" style={styles.footerLink}>Sign in</Link>
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
});
