import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

interface DeleteConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({
  visible,
  title,
  message,
  itemName,
  isLoading = false,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = Colors[colorScheme ?? "light"].tint;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <ThemedView
          style={[
            styles.dialog,
            {
              backgroundColor: cardBackground,
              paddingTop: Math.max(insets.top, 20),
              paddingBottom: Math.max(insets.bottom, 20),
              paddingLeft: Math.max(insets.left, 20),
              paddingRight: Math.max(insets.right, 20),
            },
          ]}
        >
          {/* タイトル */}
          <ThemedText style={styles.title}>{title}</ThemedText>

          {/* メッセージ */}
          <ThemedText style={[styles.message, { color: textSecondary }]}>
            {message}
          </ThemedText>

          {/* アイテム名（オプション） */}
          {itemName && (
            <View style={styles.itemNameContainer}>
              <ThemedText style={styles.itemName} numberOfLines={1}>
                「{itemName}」
              </ThemedText>
            </View>
          )}

          {/* ボタン */}
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={onCancel}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && !isLoading && styles.buttonPressed,
                isLoading && styles.buttonDisabled,
              ]}
            >
              <ThemedText style={[styles.buttonText, { color: tint }]}>
                キャンセル
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.button,
                styles.deleteButton,
                { backgroundColor: "#FF3B30" },
                pressed && !isLoading && styles.deleteButtonPressed,
                isLoading && styles.buttonDisabled,
              ]}
            >
              <ThemedText style={styles.deleteButtonText}>
                {isLoading ? "削除中..." : "削除"}
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "700",
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 16,
  },
  itemNameContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  itemName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  deleteButtonPressed: {
    opacity: 0.8,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
  },
});
