import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingActionMenu } from "../components/FloatingActionMenu";
import { ItemCard } from "../components/ItemCard";
import { colors } from "../constants/colors";
import * as itemsService from "../services/items.service";
import * as userService from "../services/user.service";
import type { FoundItem } from "../types/api.types";
import { getItemPostTypeMap } from "../utils/storage";

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "lost" | "found"
  >("all");
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [allItems, setAllItems] = useState<FoundItem[]>([]);
  const [myItems, setMyItems] = useState<FoundItem[]>([]);
  const [itemTypeMap, setItemTypeMap] = useState<
    Record<string, "lost" | "found">
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch all items from API
  const fetchAllItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await itemsService.getAllItems({
        type: selectedFilter !== "all" ? selectedFilter : undefined,
        search: searchQuery || undefined,
      });

      if (response.success && response.data) {
        setAllItems(response.data.items);
      } else {
        Alert.alert("Error", response.message || "Failed to fetch items");
      }
    } catch (error: any) {
      console.error("Error fetching items:", error);
      Alert.alert("Error", "Failed to load items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedFilter, searchQuery]);

  const loadItemTypeMap = useCallback(async () => {
    const map = await getItemPostTypeMap();
    setItemTypeMap(map);
  }, []);

  // Fetch user's own items
  const fetchMyItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUserPosts();

      if (response.success && response.data) {
        setMyItems(response.data.items);
      } else {
        Alert.alert("Error", response.message || "Failed to fetch your items");
      }
    } catch (error: any) {
      console.error("Error fetching my items:", error);
      Alert.alert("Error", "Failed to load your items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh items based on active tab
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    if (activeTab === "all") {
      await fetchAllItems();
    } else {
      await fetchMyItems();
    }
    setIsRefreshing(false);
  }, [activeTab, fetchAllItems, fetchMyItems]);

  // Load items on mount and when filters change
  useEffect(() => {
    loadItemTypeMap();
    if (activeTab === "all") {
      fetchAllItems();
    } else {
      fetchMyItems();
    }
  }, [activeTab, selectedFilter, loadItemTypeMap]);

  useFocusEffect(
    useCallback(() => {
      loadItemTypeMap();
      if (activeTab === "all") {
        fetchAllItems();
      } else {
        fetchMyItems();
      }
    }, [activeTab, fetchAllItems, fetchMyItems, loadItemTypeMap]),
  );

  // Handle search with API - debounced
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If no search query, just load all items
    if (!searchQuery.trim()) {
      if (activeTab === "all") {
        fetchAllItems();
      }
      return;
    }

    // Debounce search requests (wait 500ms after user stops typing)
    searchTimeoutRef.current = setTimeout(async () => {
      if (activeTab === "all" && searchQuery.trim()) {
        try {
          setIsLoading(true);
          const response = await itemsService.getAllItems({
            type: selectedFilter !== "all" ? selectedFilter : undefined,
            search: searchQuery.trim(),
          });
          if (response.success && response.data) {
            setAllItems(response.data.items);
          }
        } catch (error) {
          console.error("Error searching items:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, activeTab, selectedFilter]);

  // Get items to display based on active tab
  const items = activeTab === "all" ? allItems : myItems;

  // Handle search query change
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  // Helper function to format date for display in details
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
      return dateString;
    } catch {
      return dateString;
    }
  };

  // Helper function to get image source
  const getImageSource = (item: FoundItem): any => {
    // For API data
    if (item.itemImages && item.itemImages.length > 0) {
      return item.itemImages[0];
    }
    // Fallback to default image
    return require("../assets/images/icon.png");
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

  const filteredItems = items.filter((item) => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      item.itemName.toLowerCase().includes(normalizedSearch);
    const matchesType =
      selectedFilter === "all" || getItemType(item) === selectedFilter;

    return matchesSearch && matchesType;
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Foundly</Text>
        <Pressable
          style={styles.profileButton}
          onPress={() => router.push("/profile")}
        >
          <Ionicons
            name="person-circle-outline"
            size={32}
            color={colors.textSecondary}
          />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === "all" && styles.tabActive]}
          onPress={() => setActiveTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.tabTextActive,
            ]}
          >
            All Items
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "my" && styles.tabActive]}
          onPress={() => setActiveTab("my")}
        >
          <Text
            style={[styles.tabText, activeTab === "my" && styles.tabTextActive]}
          >
            My Items
          </Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.iconGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
        <Pressable
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="options-outline" size={24} color={colors.accent} />
        </Pressable>
      </View>

      {/* Items Feed */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.feedList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
        renderItem={({ item }) => (
          <ItemCard
            title={item.itemName}
            description={item.itemDescription}
            location={item.venue}
            timeAgo={formatDate(item.date)}
            type={getItemType(item)}
            image={getImageSource(item)}
            onPress={() => {
              router.push(`/item-detail?id=${item.id}`);
            }}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.loadingText}>Loading items...</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="search-outline"
                size={64}
                color={colors.textLight}
              />
              <Text style={styles.emptyText}>No items found</Text>
            </View>
          )
        }
      />

      {/* Floating Action Button */}
      <FloatingActionMenu
        visible={showMenu}
        onToggle={() => setShowMenu(!showMenu)}
        onPostLost={() => {
          setShowMenu(false);
          router.push("/post-lost");
        }}
        onPostFound={() => {
          setShowMenu(false);
          router.push("/post-found");
        }}
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowFilterModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Filter</Text>

            {/* Filter by Type */}
            <Text style={styles.filterSectionTitle}>Show Items</Text>
            <View style={styles.filterRow}>
              <Pressable
                style={[
                  styles.filterChip,
                  selectedFilter === "all" && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter("all")}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === "all" && styles.filterChipTextActive,
                  ]}
                >
                  All
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.filterChip,
                  selectedFilter === "lost" && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter("lost")}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === "lost" && styles.filterChipTextActive,
                  ]}
                >
                  Lost Only
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.filterChip,
                  selectedFilter === "found" && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter("found")}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === "found" && styles.filterChipTextActive,
                  ]}
                >
                  Found Only
                </Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.applyButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: colors.textPrimary,
  },
  profileButton: {
    padding: 4,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: colors.accent,
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.accent,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: colors.textPrimary,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  feedList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
    gap: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: colors.textLight,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: colors.textPrimary,
    marginBottom: 20,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: colors.textPrimary,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.surface,
  },
  applyButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 24,
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: colors.surface,
  },
});
