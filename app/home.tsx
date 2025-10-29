import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryPill } from "../components/CategoryPill";
import { FloatingActionMenu } from "../components/FloatingActionMenu";
import { ItemCard } from "../components/ItemCard";
import { colors } from "../constants/colors";
import { CATEGORIES, MOCK_ITEMS } from "../constants/mockData";

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Bhubaneswar, Odisha");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "lost" | "found">("all");

  const filteredItems = MOCK_ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesFilter = selectedFilter === "all" || item.type === selectedFilter;
    return matchesSearch && matchesCategory && matchesFilter;
  });

  // Handle search query change with alert for no results
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    // Check if search returns no results after user types at least 3 characters
    if (text.length >= 3) {
      const hasResults = MOCK_ITEMS.some(item => 
        item.title.toLowerCase().indexOf(text.toLowerCase()) !== -1
      );
      
      if (!hasResults) {
        Alert.alert(
          "Item Not Found",
          "The item you're searching for does not exist in the database. Try different keywords or browse all items.",
          [{ text: "OK" }]
        );
      }
    }
  };

  const locations = ["Mumbai, Maharashtra", "Delhi, NCR", "Bangalore, Karnataka", "Bhubaneswar, Odisha", "Hyderabad, Telangana", "Chennai, Tamil Nadu", "Kolkata, West Bengal", "Pune, Maharashtra"];
  const sortOptions = ["Recent", "Oldest", "Nearby"];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.locationRow} onPress={() => setShowLocationModal(true)}>
          <Ionicons name="location-sharp" size={20} color={colors.accent} />
          <Text style={styles.locationText}>{selectedLocation}</Text>
          <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
        </Pressable>
        <Pressable style={styles.profileButton} onPress={() => router.push("/profile")}>
          <Ionicons name="person-circle-outline" size={32} color={colors.textSecondary} />
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
        <Pressable style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
          <Ionicons name="options-outline" size={24} color={colors.accent} />
        </Pressable>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={CATEGORIES}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <CategoryPill
              label={item}
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(selectedCategory === item ? null : item)}
            />
          )}
        />
      </View>

      {/* Items Feed */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ItemCard
            title={item.title}
            description={item.description}
            location={item.location}
            timeAgo={item.timeAgo}
            type={item.type as "lost" | "found"}
            image={item.image}
            onPress={() => {
              router.push(`/item-detail?id=${item.id}`);
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyText}>No items found</Text>
          </View>
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <Ionicons name="home" size={28} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.navSpacer} />
        <Pressable style={styles.navItem} onPress={() => router.push("/profile")}>
          <Ionicons name="person-outline" size={28} color={colors.iconGray} />
        </Pressable>
      </View>

      {/* Location Modal */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowLocationModal(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Location</Text>
            {locations.map((location) => (
              <Pressable
                key={location}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedLocation(location);
                  setShowLocationModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{location}</Text>
                {selectedLocation === location && (
                  <Ionicons name="checkmark" size={24} color={colors.accent} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowFilterModal(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Filter & Sort</Text>
            
            {/* Filter by Type */}
            <Text style={styles.filterSectionTitle}>Show Items</Text>
            <View style={styles.filterRow}>
              <Pressable
                style={[styles.filterChip, selectedFilter === "all" && styles.filterChipActive]}
                onPress={() => setSelectedFilter("all")}
              >
                <Text style={[styles.filterChipText, selectedFilter === "all" && styles.filterChipTextActive]}>
                  All
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterChip, selectedFilter === "lost" && styles.filterChipActive]}
                onPress={() => setSelectedFilter("lost")}
              >
                <Text style={[styles.filterChipText, selectedFilter === "lost" && styles.filterChipTextActive]}>
                  Lost Only
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterChip, selectedFilter === "found" && styles.filterChipActive]}
                onPress={() => setSelectedFilter("found")}
              >
                <Text style={[styles.filterChipText, selectedFilter === "found" && styles.filterChipTextActive]}>
                  Found Only
                </Text>
              </Pressable>
            </View>

            {/* Sort Options */}
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            {sortOptions.map((option) => (
              <Pressable
                key={option}
                style={styles.modalItem}
                onPress={() => {
                  Alert.alert("Sort", `Sorting by ${option}`);
                  setShowFilterModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{option}</Text>
              </Pressable>
            ))}

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
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: colors.textPrimary,
  },
  profileButton: {
    padding: 4,
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
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  navSpacer: {
    width: 80,
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
