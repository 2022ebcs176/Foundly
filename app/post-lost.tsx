import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
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

export default function PostLostScreen() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const pickImage = async () => {
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

  const handlePost = () => {
    if (!description || !location || !date) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    Alert.alert("Success", "Lost item posted successfully!", [
      { text: "OK", onPress: () => router.back() }
    ]);
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
              <Text style={styles.sectionLabel}>Image*</Text>
              <Pressable style={styles.imageUpload} onPress={pickImage}>
                <Ionicons name="cloud-upload-outline" size={48} color="rgba(255,255,255,0.6)" />
                <Text style={styles.uploadText}>Drag & drop image here,</Text>
                <Text style={styles.uploadText}>or click to browse</Text>
                <Text style={styles.uploadHint}>Maximum 4 image, 10 MB each</Text>
              </Pressable>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <RoundedInput
                label="Description*"
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the item you found"
                multiline
                numberOfLines={4}
                style={styles.textArea}
              />
            </View>

            {/* Location */}
            <View style={styles.section}>
              <View style={styles.inputRow}>
                <View style={styles.inputFlex}>
                  <RoundedInput
                    label="Location*"
                    value={location}
                    onChangeText={setLocation}
                    placeholder="e.g., MG Road Metro, Bangalore"
                  />
                </View>
                <Pressable style={styles.locationButton}>
                  <Ionicons name="location" size={24} color={colors.primaryEnd} />
                </Pressable>
              </View>
            </View>

            {/* Date */}
            <View style={styles.section}>
              <RoundedInput
                label="Date*"
                value={date}
                onChangeText={setDate}
                placeholder="when did you find it?"
                icon={<Ionicons name="calendar-outline" size={22} color={colors.primaryEnd} />}
              />
            </View>

            {/* Submit Button */}
            <GradientButton
              containerStyle={styles.submitButton}
              onPress={handlePost}
            >
              Post lost item
            </GradientButton>
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
});
