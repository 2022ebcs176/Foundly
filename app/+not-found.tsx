import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientButton } from "../components/GradientButton";
import { colors } from "../constants/colors";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="alert-circle-outline" size={120} color={colors.textLight} />
        </View>
        
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.description}>
          Oops! This page does not exist. The item or route you are trying to access is unavailable or has been removed.
        </Text>
        
        <View style={styles.infoBox}>
          <View style={styles.infoItem}>
            <Ionicons name="link-outline" size={24} color={colors.accent} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Invalid Link</Text>
              <Text style={styles.infoText}>The URL you entered might be incorrect</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Ionicons name="trash-outline" size={24} color={colors.accent} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Item Removed</Text>
              <Text style={styles.infoText}>The item may have been deleted</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Ionicons name="locate-outline" size={24} color={colors.accent} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Lost Your Way?</Text>
              <Text style={styles.infoText}>Navigate back to browse items</Text>
            </View>
          </View>
        </View>
        
        <GradientButton
          onPress={() => router.replace("/home")}
          containerStyle={styles.button}
        >
          Go to Home
        </GradientButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.6,
  },
  title: {
    fontSize: 32,
    fontFamily: "JosefinSans_600SemiBold",
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  infoBox: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  button: {
    width: "100%",
    marginTop: 8,
  },
});
