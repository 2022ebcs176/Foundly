import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientButton } from "../components/GradientButton";
import { colors } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import * as userService from "../services/user.service";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout: authLogout, isLoading: authLoading } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  // Fetch user posts on mount
  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const response = await userService.getUserPosts();
      if (response.success && response.data) {
        setUserPosts(response.data.items);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
      // Silently fail, not critical for profile view
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: async () => {
            try {
              await authLogout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[colors.primaryStart, colors.primaryEnd]}
        style={styles.header}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.surface} />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color={colors.accent} />
            </View>
            <Pressable style={styles.editAvatarButton}>
              <Ionicons name="camera" size={18} color={colors.surface} />
            </Pressable>
          </View>
          <Text style={styles.userName}>{user?.name || "User"}</Text>
          <Text style={styles.userEmail}>{user?.email || "email@example.com"}</Text>
          <Text style={styles.userStats}>
            {isLoadingPosts ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <>
                <Text style={styles.statNumber}>{userPosts.length}</Text> Items Posted
              </>
            )}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <Pressable style={styles.menuItem} onPress={() => Alert.alert("Edit Profile", "This feature will allow you to edit your profile")}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="person-outline" size={22} color={colors.accent} />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => Alert.alert("My Posts", "View all your posted items")}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="albums-outline" size={22} color={colors.accent} />
              <Text style={styles.menuItemText}>My Posts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => Alert.alert("Saved Items", "View your bookmarked items")}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="bookmark-outline" size={22} color={colors.accent} />
              <Text style={styles.menuItemText}>Saved Items</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Preferences */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <Pressable 
            style={styles.menuItem}
            onPress={() => {
              setNotificationsEnabled(!notificationsEnabled);
              Alert.alert("Notifications", `Notifications ${!notificationsEnabled ? "enabled" : "disabled"}`);
            }}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="notifications-outline" size={22} color={colors.accent} />
              <Text style={styles.menuItemText}>Push Notifications</Text>
            </View>
            <View style={[styles.toggle, notificationsEnabled && styles.toggleActive]}>
              <View style={[styles.toggleThumb, notificationsEnabled && styles.toggleThumbActive]} />
            </View>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => Alert.alert("Location", "Manage your location preferences")}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="location-outline" size={22} color={colors.accent} />
              <Text style={styles.menuItemText}>Location Services</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* About */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <Pressable style={styles.menuItem} onPress={() => Alert.alert("Help & Support", "Contact us at: support@foundly.com")}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="help-circle-outline" size={22} color={colors.accent} />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => Alert.alert("Privacy Policy", "View our privacy policy and terms")}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={22} color={colors.accent} />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => Alert.alert("About", "Foundly v1.0.0\nLost & Found App")}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="information-circle-outline" size={22} color={colors.accent} />
              <Text style={styles.menuItemText}>About Foundly</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Logout Button */}
        <GradientButton
          containerStyle={styles.logoutButton}
          onPress={handleLogout}
          disabled={authLoading}
        >
          {authLoading ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            "Logout"
          )}
        </GradientButton>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: colors.surface,
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.accent,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.surface,
  },
  userName: {
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: colors.textSecondary,
    marginBottom: 12,
  },
  userStats: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: colors.textSecondary,
  },
  statNumber: {
    fontFamily: "Poppins_600SemiBold",
    color: colors.accent,
  },
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: colors.textPrimary,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    color: colors.textPrimary,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    padding: 2,
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: colors.accent,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: "flex-end",
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 16,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: colors.textLight,
    marginBottom: 32,
  },
});
