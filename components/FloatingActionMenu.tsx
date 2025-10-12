import { Ionicons } from "@expo/vector-icons";
import {
    Pressable,
    PressableStateCallbackType,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { colors } from "../constants/colors";
import { GradientBackground } from "./GradientBackground";

interface FloatingActionMenuProps {
  visible: boolean;
  onToggle: () => void;
  onPostLost: () => void;
  onPostFound: () => void;
}

export function FloatingActionMenu({ visible, onToggle, onPostLost, onPostFound }: FloatingActionMenuProps) {
  return (
    <View style={styles.wrapper}>
      {visible && (
        <GradientBackground style={styles.menu} topRadius={24} bottomRadius={24}>
          <Pressable style={styles.menuButton} onPress={onPostFound}>
            <Text style={styles.menuText}>Post Found Item</Text>
          </Pressable>
          <Pressable style={styles.menuButton} onPress={onPostLost}>
            <Text style={styles.menuText}>Post Lost Item</Text>
          </Pressable>
        </GradientBackground>
      )}

      <Pressable
        accessibilityRole="button"
        style={(state: PressableStateCallbackType) => [styles.fab, state.pressed && styles.fabPressed]}
        onPress={onToggle}
      >
        <Ionicons name={visible ? "close" : "add"} size={32} color={colors.surface} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    alignItems: "center",
    gap: 18,
    zIndex: 1000,
  },
  menu: {
    width: 200,
    paddingVertical: 16,
    paddingHorizontal: 18,
    justifyContent: "center",
    gap: 12,
    borderRadius: 24,
  },
  menuButton: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: "center",
  },
  menuText: {
    color: colors.primaryEnd,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  fab: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryEnd,
    alignItems: "center",
    justifyContent: "center",
    elevation: 16,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    borderWidth: 2,
    borderColor: colors.surface,
  },
  fabPressed: {
    transform: [{ scale: 0.96 }],
  },
});
