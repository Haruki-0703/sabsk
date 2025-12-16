import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useNotifications } from "@/hooks/use-notifications";
import { useThemeColor } from "@/hooks/use-theme-color";

const DAYS_OPTIONS = [0, 1, 2, 3, 7];

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const {
    settings,
    hasPermission,
    toggleNotifications,
    setDaysBefore,
    requestPermission,
  } = useNotifications();

  const cardBackground = useThemeColor({}, "cardBackground");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = Colors[colorScheme ?? "light"].tint;
  const border = Colors[colorScheme ?? "light"].border;

  const handleToggle = async (value: boolean) => {
    if (value && !hasPermission) {
      await requestPermission();
    }
    await toggleNotifications(value);
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, 20), borderBottomColor: border },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={tint} />
          <ThemedText style={[styles.backText, { color: tint }]}>戻る</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>通知設定</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 通知の有効/無効 */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textSecondary }]}>
            リマインダー
          </ThemedText>
          <View style={[styles.settingsCard, { backgroundColor: cardBackground }]}>
            <View style={styles.settingsRow}>
              <View style={styles.settingsInfo}>
                <ThemedText style={styles.settingsLabel}>
                  請求日リマインダー
                </ThemedText>
                <ThemedText style={[styles.settingsDescription, { color: textSecondary }]}>
                  請求日前に通知でお知らせ
                </ThemedText>
              </View>
              <Switch
                value={settings.enabled}
                onValueChange={handleToggle}
                trackColor={{ false: border, true: tint }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* 通知タイミング */}
        {settings.enabled && (
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: textSecondary }]}>
              通知タイミング
            </ThemedText>
            <View style={[styles.settingsCard, { backgroundColor: cardBackground }]}>
              {DAYS_OPTIONS.map((days, index) => (
                <View key={days}>
                  <Pressable
                    onPress={() => setDaysBefore(days)}
                    style={styles.optionRow}
                  >
                    <ThemedText style={styles.optionLabel}>
                      {days === 0 ? "当日" : `${days}日前`}
                    </ThemedText>
                    {settings.daysBefore === days && (
                      <IconSymbol name="checkmark" size={20} color={tint} />
                    )}
                  </Pressable>
                  {index < DAYS_OPTIONS.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: border }]} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 権限の状態 */}
        {!hasPermission && settings.enabled && (
          <View style={styles.section}>
            <View style={[styles.warningCard, { backgroundColor: "#FFF3CD" }]}>
              <ThemedText style={[styles.warningText, { color: "#856404" }]}>
                通知の権限が許可されていません。設定アプリから通知を許可してください。
              </ThemedText>
            </View>
          </View>
        )}

        {/* 説明 */}
        <View style={styles.section}>
          <ThemedText style={[styles.helpText, { color: textSecondary }]}>
            リマインダーを有効にすると、各サブスクリプションの請求日前に通知でお知らせします。解約を検討しているサービスの請求日を見逃さないようにしましょう。
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    minWidth: 80,
  },
  backText: {
    fontSize: 17,
    lineHeight: 22,
  },
  headerTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
  },
  placeholder: {
    minWidth: 80,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  settingsCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  settingsInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingsLabel: {
    fontSize: 17,
    lineHeight: 22,
  },
  settingsDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  optionLabel: {
    fontSize: 17,
    lineHeight: 22,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  warningCard: {
    padding: 16,
    borderRadius: 12,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
  },
  helpText: {
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 4,
  },
});
