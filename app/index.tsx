import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/login");
    }, 2400);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <LinearGradient colors={[colors.primaryStart, colors.primaryEnd]} style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.logoContainer}>
        <Image source={require("../assets/images/splash-icon.png")} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.title}>LQST &amp; found</Text>
      <Text style={styles.subtitle}>Sign Up | Register</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 180,
    height: 180,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  logo: {
    width: 140,
    height: 140,
  },
  title: {
    color: colors.surface,
    fontSize: 36,
    letterSpacing: 4,
    fontFamily: "JosefinSans_600SemiBold",
  },
  subtitle: {
    position: "absolute",
    bottom: 46,
    color: "rgba(255,255,255,0.88)",
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    letterSpacing: 2,
  },
});
