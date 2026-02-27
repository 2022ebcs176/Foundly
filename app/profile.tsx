import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientButton } from "../components/GradientButton";
import { ItemCard } from "../components/ItemCard";
import { colors } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import * as userService from "../services/user.service";
import type { FoundItem } from "../types/api.types";
import { getItemPostTypeMap } from "../utils/storage";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout: authLogout, isLoading: authLoading } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userPosts, setUserPosts] = useState<FoundItem[]>([]);
  const [itemTypeMap, setItemTypeMap] = useState<
    Record<string, "lost" | "found">
  >({});
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "posts">("info");

  // Fetch user posts on mount
  useEffect(() => {
    fetchUserPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserPosts();
    }, []),
  );

  const fetchUserPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const [response, map] = await Promise.all([
        userService.getUserPosts(),
        getItemPostTypeMap(),
      ]);
      setItemTypeMap(map);
      if (response.success && response.data) {
        setUserPosts(response.data.items);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
      // Silently fail, not critical for profile view
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await authLogout();
            router.replace("/login");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const formatDate = (dateString: string): string => {
    try {
      if (!dateString) return "Unknown";

      const [year, month, day] = dateString.split("-");
      if (year && month && day) {
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
        );
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      return dateString;
    } catch {
      return dateString;
    }
  };

  const getItemType = (item: FoundItem): "lost" | "found" => {
    const localType = itemTypeMap[item.id];
    if (localType === "lost" || localType === "found") {
      return localType;
    }

    const typedItem = item as FoundItem & {
      type?: string;
      itemType?: string;
      postType?: string;
      listingType?: string;
      lost?: boolean;
      isLost?: boolean;
    };

    if (typedItem.type === "lost" || typedItem.type === "found") {
      return typedItem.type;
    }

    const normalizedType =
      typedItem.itemType ?? typedItem.postType ?? typedItem.listingType;
    if (typeof normalizedType === "string") {
      const lowerType = normalizedType.toLowerCase();
      if (lowerType === "lost") return "lost";
      if (lowerType === "found") return "found";
    }

    if (typedItem.lost === true || typedItem.isLost === true) {
      return "lost";
    }

    const itemText = `${item.itemHighlight ?? ""} ${item.itemDescription ?? ""}`
      .toLowerCase()
      .trim();
    if (/\b(lost|missing|misplaced)\b/.test(itemText)) {
      return "lost";
    }
    if (/\b(found|recovered|picked\s*up)\b/.test(itemText)) {
      return "found";
    }

    return "found";
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

      {activeTab === "info" ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Info Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={48} color={colors.accent} />
              </View>
            </View>
            <Text style={styles.userName}>{user?.username || "User"}</Text>
            <Text style={styles.userEmail}>
              {user?.email || "email@example.com"}
            </Text>
            <Text style={styles.userStats}>
              {isLoadingPosts ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <>
                  <Text style={styles.statNumber}>{userPosts.length}</Text>{" "}
                  Items Posted
                </>
              )}
            </Text>
          </View>

          {/* Preferences */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setNotificationsEnabled(!notificationsEnabled);
              }}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color={colors.accent}
                />
                <Text style={styles.menuItemText}>Push Notifications</Text>
              </View>
              <View
                style={[
                  styles.toggle,
                  notificationsEnabled && styles.toggleActive,
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    notificationsEnabled && styles.toggleThumbActive,
                  ]}
                />
              </View>
            </Pressable>
          </View>

          {/* About */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>About</Text>

            <Pressable
              style={styles.menuItem}
              onPress={() =>
                Alert.alert(
                  "Help & Support",
                  "Contact us at: support@foundly.com",
                )
              }
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="help-circle-outline"
                  size={22}
                  color={colors.accent}
                />
                <Text style={styles.menuItemText}>Help & Support</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() =>
                Alert.alert("About", "Foundly v1.0.0\nLost & Found App")
              }
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color={colors.accent}
                />
                <Text style={styles.menuItemText}>About Foundly</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
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
      ) : (
        <View style={styles.postsContainer}>
          {isLoadingPosts ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          ) : userPosts.length > 0 ? (
            <FlatList
              data={userPosts}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.postsList}
              renderItem={({ item }) => (
                <ItemCard
                  title={item.itemName}
                  description={item.itemDescription}
                  location={item.venue}
                  timeAgo={formatDate(item.date)}
                  type={getItemType(item)}
                  image={
                    item.itemImages && item.itemImages.length > 0
                      ? item.itemImages[0]
                      : require("../assets/images/icon.png")
                  }
                  onPress={() => {
                    router.push(`/item-detail?id=${item.id}`);
                  }}
                />
              )}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="documents-outline"
                size={64}
                color={colors.textLight}
              />
              <Text style={styles.emptyText}>No posts yet</Text>
              <Text style={styles.emptySubtext}>
                Start by posting a found or lost item
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === "info" && styles.tabActive]}
          onPress={() => setActiveTab("info")}
        >
          <Ionicons
            name="person"
            size={24}
            color={activeTab === "info" ? colors.accent : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "info" && styles.tabTextActive,
            ]}
          >
            Info
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "posts" && styles.tabActive]}
          onPress={() => setActiveTab("posts")}
        >
          <Ionicons
            name="list"
            size={24}
            color={activeTab === "posts" ? colors.accent : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "posts" && styles.tabTextActive,
            ]}
          >
            My Posts
          </Text>
        </Pressable>
      </View>
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
    paddingBottom: 70,
  },
  postsContainer: {
    flex: 1,
    paddingBottom: 70,
  },
  postsList: {
    paddingVertical: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: colors.textSecondary,
    marginTop: 8,
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
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  tabText: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: colors.textSecondary,
    marginTop: 4,
  },
  tabTextActive: {
    color: colors.accent,
  },
});
