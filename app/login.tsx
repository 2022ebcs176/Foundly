import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("smruti@foundly.com");
  const [password, setPassword] = useState("lost&found123");

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
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Ionicons name="mail-outline" size={22} color={colors.primaryEnd} />}
              placeholder="lost&found@gmail.com"
            />
            <RoundedInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<Ionicons name="lock-closed-outline" size={22} color={colors.primaryEnd} />}
              placeholder="********"
            />
            <GradientButton
              containerStyle={styles.buttonSpacing}
              onPress={() => router.push("/home")}
            >
              login
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
});
