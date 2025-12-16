import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { CategoryColors, Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  CATEGORY_LABELS,
  CYCLE_LABELS,
  formatCurrency,
  formatDate,
  Subscription,
  toMonthlyAmount,
} from "@/types/subscription";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { getSubscriptionById, deleteSubscription } = useSubscriptions();

  const cardBackground = useThemeColor({}, "cardBackground");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = Colors[colorScheme ?? "light"].tint;
  const destructive = Colors[colorScheme ?? "light"].destructive;
  const border = Colors[colorScheme ?? "light"].border;

  const [subscription, setSubscription] = useState<Subscription | undefined>();

  useEffect(() => {
    if (id) {
      const sub = getSubscriptionById(id);
      setSubscription(sub);
    }
  }, [id, getSubscriptionById]);

  const handleDelete = () => {
    Alert.alert(
      "サブスクを削除",
      `「${subscription?.name}」を削除しますか？`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            if (id) {
              await deleteSubscription(id);
              router.back();
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push({
      pathname: "/edit/[id]",
      params: { id },
    });
  };

  if (!subscription) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={tint} />
            <ThemedText style={[styles.backText, { color: tint }]}>戻る</ThemedText>
          </Pressable>
        </View>
        <View style={styles.notFound}>
          <ThemedText>サブスクが見つかりません</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const categoryColor = CategoryColors[subscription.category] || CategoryColors.other;
  const monthlyAmount = toMonthlyAmount(subscription.amount, subscription.cycle);

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
        <Pressable onPress={handleEdit} style={styles.editButton}>
          <ThemedText style={[styles.editText, { color: tint }]}>編集</ThemedText>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ヘッダーカード */}
        <View style={[styles.heroCard, { backgroundColor: categoryColor }]}>
          <ThemedText style={styles.heroName}>{subscription.name}</ThemedText>
          <ThemedText style={styles.heroAmount}>
            {formatCurrency(subscription.amount)}
          </ThemedText>
          <ThemedText style={styles.heroCycle}>
            {CYCLE_LABELS[subscription.cycle]}
          </ThemedText>
        </View>

        {/* 詳細情報 */}
        <View style={[styles.infoCard, { backgroundColor: cardBackground }]}>
          <View style={styles.infoRow}>
            <ThemedText style={[styles.infoLabel, { color: textSecondary }]}>
              カテゴリ
            </ThemedText>
            <ThemedText style={styles.infoValue}>
              {CATEGORY_LABELS[subscription.category]}
            </ThemedText>
          </View>
          <View style={[styles.divider, { backgroundColor: border }]} />
          <View style={styles.infoRow}>
            <ThemedText style={[styles.infoLabel, { color: textSecondary }]}>
              次回請求日
            </ThemedText>
            <ThemedText style={styles.infoValue}>
              {formatDate(subscription.nextBillingDate)}
            </ThemedText>
          </View>
          <View style={[styles.divider, { backgroundColor: border }]} />
          <View style={styles.infoRow}>
            <ThemedText style={[styles.infoLabel, { color: textSecondary }]}>
              月額換算
            </ThemedText>
            <ThemedText style={styles.infoValue}>
              {formatCurrency(monthlyAmount)}
            </ThemedText>
          </View>
          {subscription.note && (
            <>
              <View style={[styles.divider, { backgroundColor: border }]} />
              <View style={styles.noteRow}>
                <ThemedText style={[styles.infoLabel, { color: textSecondary }]}>
                  メモ
                </ThemedText>
                <ThemedText style={styles.noteText}>{subscription.note}</ThemedText>
              </View>
            </>
          )}
        </View>

        {/* 削除ボタン */}
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            { backgroundColor: cardBackground },
            pressed && styles.deleteButtonPressed,
          ]}
        >
          <IconSymbol name="trash.fill" size={20} color={destructive} />
          <ThemedText style={[styles.deleteText, { color: destructive }]}>
            このサブスクを削除
          </ThemedText>
        </Pressable>
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
  },
  backText: {
    fontSize: 17,
    lineHeight: 22,
  },
  editButton: {
    padding: 8,
  },
  editText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  heroCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  heroName: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  heroAmount: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "700",
    color: "#FFFFFF",
    includeFontPadding: false,
  },
  heroCycle: {
    fontSize: 15,
    lineHeight: 20,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  infoCard: {
    borderRadius: 12,
    marginBottom: 24,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  infoLabel: {
    fontSize: 15,
    lineHeight: 20,
  },
  infoValue: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
  noteRow: {
    padding: 16,
  },
  noteText: {
    fontSize: 15,
    lineHeight: 20,
    marginTop: 8,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonPressed: {
    opacity: 0.7,
  },
  deleteText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "500",
  },
});
