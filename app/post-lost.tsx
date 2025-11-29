import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientButton } from "../components/GradientButton";
import { RoundedInput } from "../components/RoundedInput";
import { colors } from "../constants/colors";
import * as itemsService from "../services/items.service";
import * as uploadService from "../services/upload.service";
import { ApiError } from "../utils/api";

export default function PostLostScreen() {
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [itemColor, setItemColor] = useState("");
  const [description, setDescription] = useState("");
  const [itemHighlight, setItemHighlight] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Date/Time picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const showImagePickerOptions = () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: takePhoto,
        },
        {
          text: "Choose from Gallery",
          onPress: pickImageFromGallery,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri].slice(0, 4));
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Gallery permission is required to select photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 4,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages].slice(0, 4));
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      const formattedDate = selectedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      setDate(formattedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime);
      const formattedTime = selectedTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setTime(formattedTime);
    }
  };

  const handlePost = async () => {
    // Validation
    if (!itemName || !description || !location || !date || !category) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      setUploadProgress(0);

      // Upload images first if any
      let uploadedImageUrls: string[] = [];
      if (images.length > 0) {
        const uploadPromises = images.map(imageUri => 
          uploadService.uploadImage(imageUri)
        );
        const uploadResults = await Promise.all(uploadPromises);
        uploadedImageUrls = uploadResults.map(result => result.data.url);
      }

      // Create the lost item post
      const itemData = {
        title: itemName,
        description: description,
        category: category,
        type: 'lost' as const,
        images: uploadedImageUrls,
        location: {
          address: venue || location,
          city: location.split(',')[0]?.trim() || location,
          state: location.split(',')[1]?.trim(),
        },
        date: selectedDate.toISOString(),
        contactInfo: {
          phone: postedBy || undefined,
        },
      };

      await itemsService.createItem(itemData);

      Alert.alert(
        "Success", 
        "Lost item posted successfully!",
        [
          { 
            text: "OK", 
            onPress: () => router.back() 
          }
        ]
      );
    } catch (error: any) {
      console.error('Error posting item:', error);
      if (error instanceof ApiError) {
        Alert.alert(
          "Error",
          error.message || "Failed to post item. Please try again."
        );
      } else {
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[colors.primaryStart, colors.primaryEnd]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.surface} />
          </Pressable>
          <Text style={styles.headerTitle}>Post Lost Item</Text>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Image Upload */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Item Image*</Text>
              <Pressable style={styles.imageUpload} onPress={showImagePickerOptions}>
                <Ionicons name="cloud-upload-outline" size={48} color="rgba(255,255,255,0.6)" />
                <Text style={styles.uploadText}>Tap to select image</Text>
                <Text style={styles.uploadText}>Take photo or choose from gallery</Text>
                <Text style={styles.uploadHint}>Maximum 4 image, 10 MB each</Text>
              </Pressable>
              {images.length > 0 && (
                <Text style={styles.imageCount}>{images.length} image(s) selected</Text>
              )}
            </View>

            {/* Item Name */}
            <View style={styles.section}>
              <RoundedInput
                label="Item Name*"
                value={itemName}
                onChangeText={setItemName}
                placeholder="Enter item name"
              />
            </View>

            {/* Item Color */}
            <View style={styles.section}>
              <RoundedInput
                label="Item Color"
                value={itemColor}
                onChangeText={setItemColor}
                placeholder="Enter item color"
              />
            </View>

            {/* Item Description */}
            <View style={styles.section}>
              <RoundedInput
                label="Item Description*"
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the item you lost"
                multiline
                numberOfLines={4}
                style={styles.textArea}
              />
            </View>

            {/* Item Highlight */}
            <View style={styles.section}>
              <RoundedInput
                label="Item Highlight (Unique thing that show difference)"
                value={itemHighlight}
                onChangeText={setItemHighlight}
                placeholder="Any unique features or markings"
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Time */}
            <View style={styles.section}>
              <Pressable onPress={() => setShowTimePicker(true)}>
                <RoundedInput
                  label="Time"
                  value={time}
                  placeholder="What time did you lose it?"
                  icon={<Ionicons name="time-outline" size={22} color={colors.primaryEnd} />}
                  editable={false}
                  pointerEvents="none"
                />
              </Pressable>
              {showTimePicker && (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={onTimeChange}
                />
              )}
            </View>

            {/* Date */}
            <View style={styles.section}>
              <Pressable onPress={() => setShowDatePicker(true)}>
                <RoundedInput
                  label="Date*"
                  value={date}
                  placeholder="When did you lose it?"
                  icon={<Ionicons name="calendar-outline" size={22} color={colors.primaryEnd} />}
                  editable={false}
                  pointerEvents="none"
                />
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            {/* Venue */}
            <View style={styles.section}>
              <RoundedInput
                label="Venue"
                value={venue}
                onChangeText={setVenue}
                placeholder="Specific venue or building"
              />
            </View>

            {/* Posted By */}
            <View style={styles.section}>
              <RoundedInput
                label="Posted By"
                value={postedBy}
                onChangeText={setPostedBy}
                placeholder="Your name"
              />
            </View>

            {/* Post Btn - Placeholder for future use */}

            {/* Item Category */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Item Category*</Text>
              <View style={styles.categoryGrid}>
                {['Electronics', 'Documents', 'Accessories', 'Clothing', 'Books', 'Others'].map((cat) => (
                  <Pressable
                    key={cat}
                    style={[
                      styles.categoryButton,
                      category === cat && styles.categoryButtonActive
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[
                      styles.categoryText,
                      category === cat && styles.categoryTextActive
                    ]}>
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Search By Item Name / Item Category */}
            <View style={styles.section}>
              <RoundedInput
                label="Search By Item Name / Item Category"
                value={location}
                onChangeText={setLocation}
                placeholder="Search items..."
                icon={<Ionicons name="search-outline" size={22} color={colors.primaryEnd} />}
              />
            </View>

            {/* Submit Button */}
            <GradientButton
              containerStyle={styles.submitButton}
              onPress={handlePost}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                "Post lost item"
              )}
            </GradientButton>
            
            {isLoading && uploadProgress > 0 && (
              <Text style={styles.progressText}>
                Uploading images... {Math.round(uploadProgress)}%
              </Text>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  flex: {
    flex: 1,
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: colors.surface,
    marginBottom: 12,
  },
  imageUpload: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    borderStyle: "dashed",
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  uploadText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "rgba(255,255,255,0.8)",
    marginTop: 8,
  },
  uploadHint: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "rgba(255,255,255,0.5)",
    marginTop: 12,
  },
  imageCount: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: colors.surface,
    marginTop: 12,
    textAlign: "center",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-end",
  },
  inputFlex: {
    flex: 1,
  },
  locationButton: {
    width: 56,
    height: 56,
    backgroundColor: colors.surface,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  submitButton: {
    marginTop: 20,
  },
  progressText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    marginTop: 8,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  categoryButtonActive: {
    backgroundColor: colors.surface,
    borderColor: colors.surface,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    color: colors.surface,
  },
  categoryTextActive: {
    color: colors.primaryEnd,
  },
});
