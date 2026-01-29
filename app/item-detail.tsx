import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientButton } from "../components/GradientButton";
import { colors } from "../constants/colors";
import * as itemsService from "../services/items.service";
import type { FoundItem } from "../types/api.types";

export default function ItemDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [item, setItem] = useState<FoundItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItemDetails();
  }, [params.id]);

  const fetchItemDetails = async () => {
    try {
      setIsLoading(true);
      const response = await itemsService.getAllItems();

      if (response.success && response.data) {
        const foundItem = response.data.items.find(
          (i) => i.id === parseInt(params.id as string),
        );
        if (foundItem) {
          setItem(foundItem);
        } else {
          Alert.alert("Error", "Item not found");
          router.back();
        }
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
      Alert.alert("Error", "Failed to load item details");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = () => {
    Alert.alert(
      "Contact Poster",
      `Contact ${item?.postedBy || "User"} about this item`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Message",
          onPress: () => Alert.alert("Success", "Message sent!"),
        },
      ],
    );
  };

  const handleShare = () => {
    Alert.alert(
      "Share",
      "This feature will allow you to share this item on social media or via message.",
    );
  };

  const formatDate = (dateString: string): string => {
    try {
      if (!dateString) return "Unknown";

      // Try to parse yyyy-MM-dd format
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

      // Try parsing as ISO date
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

  const handleReport = () => {
    Alert.alert("Report Item", "Why are you reporting this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Spam",
        onPress: () => Alert.alert("Reported", "Thank you for your report"),
      },
      {
        text: "Inappropriate",
        onPress: () => Alert.alert("Reported", "Thank you for your report"),
      },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading item details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Item not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Item Details</Text>
        <Pressable onPress={handleShare} style={styles.headerButton}>
          <Ionicons name="share-outline" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageContainer}>
          {item.itemImages && item.itemImages.length > 0 ? (
            <Image
              source={{ uri: item.itemImages[0] }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="image-outline"
                size={64}
                color={colors.textLight}
              />
            </View>
          )}
          <View style={[styles.badge, styles.foundBadge]}>
            <Text style={styles.badgeText}>FOUND</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.detailsCard}>
          {/* Title and Time */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.itemName}</Text>
            <Pressable
              onPress={() =>
                Alert.alert("Bookmark", "Item saved to bookmarks!")
              }
            >
              <Ionicons
                name="bookmark-outline"
                size={26}
                color={colors.accent}
              />
            </Pressable>
          </View>
          <Text style={styles.timeAgo}>Posted on {formatDate(item.date)}</Text>

          {/* Location */}
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={colors.accent} />
            <Text style={styles.infoText}>{item.venue}</Text>
          </View>

          {/* Color */}
          <View style={styles.infoRow}>
            <Ionicons name="color-filter" size={20} color={colors.accent} />
            <Text style={styles.infoText}>{item.itemColor}</Text>
          </View>

          {/* Category */}
          <View style={styles.infoRow}>
            <Ionicons name="pricetag-outline" size={20} color={colors.accent} />
            <Text style={styles.infoText}>{item.itemCategory}</Text>
          </View>

          {/* Time */}
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={colors.accent} />
            <Text style={styles.infoText}>{item.time || "Not specified"}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.itemDescription}</Text>

          {/* Highlight */}
          <Text style={styles.sectionTitle}>Special Details</Text>
          <Text style={styles.description}>{item.itemHighlight}</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Posted By */}
          <Text style={styles.sectionTitle}>Posted By</Text>
          <View style={styles.posterCard}>
            <View style={styles.posterAvatar}>
              <Ionicons name="person" size={24} color={colors.accent} />
            </View>
            <View style={styles.posterInfo}>
              <Text style={styles.posterName}>{item.postedBy}</Text>
              <Text style={styles.posterStats}>Found this item</Text>
            </View>
            <Pressable style={styles.viewProfileButton}>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>

          {/* Report Button */}
          <Pressable style={styles.reportButton} onPress={handleReport}>
            <Ionicons name="flag-outline" size={18} color={colors.lostBadge} />
            <Text style={styles.reportText}>Report this item</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <GradientButton
          containerStyle={styles.contactButton}
          onPress={handleContact}
        >
          Contact Poster
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: colors.textSecondary,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: colors.background,
    position: "relative",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 20,
    left: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  lostBadge: {
    backgroundColor: colors.lostBadge,
  },
  foundBadge: {
    backgroundColor: colors.foundBadge,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: 1,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
    paddingBottom: 120,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: colors.textPrimary,
    marginRight: 12,
  },
  timeAgo: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: colors.textLight,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: colors.textSecondary,
    lineHeight: 24,
  },
  posterCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 16,
    gap: 12,
  },
  posterAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.accent,
  },
  posterInfo: {
    flex: 1,
  },
  posterName: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  posterStats: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: colors.textSecondary,
  },
  viewProfileButton: {
    padding: 8,
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    paddingVertical: 12,
  },
  reportText: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: colors.lostBadge,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  contactButton: {
    marginBottom: 0,
  },
});
