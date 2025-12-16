import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

interface SettingsItemProps {
  icon: "bell.fill" | "creditcard.fill" | "info.circle.fill" | "doc.text.fill" | "lock.fill";
  title: string;
  subtitle?: string;
  onPress?: () => void;
}

function SettingsItem({ icon, title, subtitle, onPress }: SettingsItemProps) {
  const cardBackground = useThemeColor({}, "cardBackground");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingsItem,
        { backgroundColor: cardBackground },
        pressed && styles.itemPressed,
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: tint }]}>
        <IconSymbol name={icon} size={20} color="#FFFFFF" />
      </View>
      <View style={styles.itemContent}>
        <ThemedText style={styles.itemTitle}>{title}</ThemedText>
        {subtitle && (
          <ThemedText style={[styles.itemSubtitle, { color: textSecondary }]}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      <IconSymbol name="chevron.right" size={20} color={textSecondary} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const textSecondary = Colors[colorScheme ?? "light"].textSecondary;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <ThemedText style={styles.title}>設定</ThemedText>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textSecondary }]}>
            通知
          </ThemedText>
          <SettingsItem
            icon="bell.fill"
            title="リマインダー"
            subtitle="請求日前に通知"
            onPress={() => router.push("/notification-settings")}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textSecondary }]}>
            一般
          </ThemedText>
          <SettingsItem
            icon="creditcard.fill"
            title="通貨"
            subtitle="JPY (日本円)"
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textSecondary }]}>
            このアプリについて
          </ThemedText>
          <SettingsItem
            icon="info.circle.fill"
            title="バージョン"
            subtitle="v1.3.0"
          />
          <SettingsItem
            icon="doc.text.fill"
            title="利用規約"
            onPress={() => router.push("/terms-of-service")}
          />
          <SettingsItem
            icon="lock.fill"
            title="プライバシーポリシー"
            onPress={() => router.push("/privacy-policy")}
          />
        </View>

        <View style={styles.footer}>
          <ThemedText style={[styles.footerText, { color: textSecondary }]}>
            SubscK - サブスク管理アプリ
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    textTransform: "uppercase",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 2,
  },
  itemPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 17,
    lineHeight: 22,
  },
  itemSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    marginTop: 48,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
