import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

interface ItemCardProps {
  title: string;
  description: string;
  timeAgo: string;
  location: string;
  type: "lost" | "found";
  image: ImageSourcePropType;
  onPress?: () => void;
}

export function ItemCard({ title, description, timeAgo, location, type, image, onPress }: ItemCardProps) {
  const isLost = type === "lost";
  
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={image} style={styles.thumbnail} resizeMode="cover" />
      <View style={styles.content}>
        <View style={[styles.badge, isLost ? styles.lostBadge : styles.foundBadge]}>
          <Text style={styles.badgeText}>{isLost ? "LOST" : "FOUND"}</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.location} numberOfLines={1}>{location}</Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lostBadge: {
    backgroundColor: colors.lostBadge,
  },
  foundBadge: {
    backgroundColor: colors.foundBadge,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 11,
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: colors.textPrimary,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    fontFamily: "Poppins_400Regular",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  location: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: "Poppins_400Regular",
  },
  timeAgo: {
    fontSize: 12,
    color: colors.textLight,
    fontFamily: "Poppins_400Regular",
  },
});
