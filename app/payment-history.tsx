import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePaymentHistory } from "@/hooks/use-payment-history";
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatCurrency } from "@/types/subscription";

type FilterType = "all" | "monthly" | "yearly";

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const textSecondary = useThemeColor({}, "textSecondary");
  const cardBackground = useThemeColor({}, "cardBackground");
  const tint = Colors[colorScheme ?? "light"].tint;
  
  const { history, getStats, getMonthlyPayments } = usePaymentHistory();
  const [filterType, setFilterType] = useState<FilterType>("all");

  const stats = useMemo(() => getStats(), [history]);
  const monthlyPayments = useMemo(() => getMonthlyPayments(), [history]);

  const filteredHistory = useMemo(() => {
    let filtered = [...history].sort(
      (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    );

    if (filterType === "monthly") {
      filtered = filtered.filter((p) => p.billingCycle === "monthly");
    } else if (filterType === "yearly") {
      filtered = filtered.filter((p) => p.billingCycle === "yearly");
    }

    return filtered;
  }, [history, filterType]);

  const renderPaymentItem = useCallback(
    ({ item }: { item: typeof history[0] }) => (
      <View style={[styles.paymentItem, { backgroundColor: cardBackground }]}>
        <View style={styles.paymentInfo}>
          <ThemedText style={styles.paymentDate}>
            {new Date(item.paymentDate).toLocaleDateString("ja-JP")}
          </ThemedText>
          <ThemedText style={[styles.paymentCycle, { color: textSecondary }]}>
            {item.billingCycle === "monthly" ? "月額" : "年額"}
          </ThemedText>
        </View>
        <ThemedText style={styles.paymentAmount}>
          {formatCurrency(item.amount)}
        </ThemedText>
      </View>
    ),
    [cardBackground, textSecondary]
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={tint} />
        </Pressable>
        <ThemedText style={styles.title}>支払い履歴</ThemedText>
        <View style={styles.spacer} />
      </View>

      {/* 統計情報 */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: tint }]}>
          <ThemedText style={styles.statLabel}>総支払額</ThemedText>
          <ThemedText style={styles.statValue}>
            {formatCurrency(stats.totalPaid)}
          </ThemedText>
        </View>
        <View style={[styles.statCard, { backgroundColor: cardBackground }]}>
          <ThemedText style={[styles.statLabel, { color: textSecondary }]}>
            平均月額
          </ThemedText>
          <ThemedText style={styles.statValue}>
            {formatCurrency(stats.averageMonthly)}
          </ThemedText>
        </View>
      </View>

      {/* フィルタータブ */}
      <View style={styles.filterContainer}>
        {(["all", "monthly", "yearly"] as const).map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setFilterType(filter)}
            style={[
              styles.filterTab,
              filterType === filter && { borderBottomColor: tint, borderBottomWidth: 2 },
            ]}
          >
            <ThemedText
              style={[
                styles.filterText,
                filterType === filter && { color: tint, fontWeight: "600" },
              ]}
            >
              {filter === "all" ? "すべて" : filter === "monthly" ? "月額" : "年額"}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {/* 支払い履歴リスト */}
      {filteredHistory.length > 0 ? (
        <FlatList
          data={filteredHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderPaymentItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <ThemedText style={[styles.emptyText, { color: textSecondary }]}>
            支払い履歴がありません
          </ThemedText>
        </View>
      )}
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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },
  spacer: {
    width: 40,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 30,
    color: "#FFFFFF",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  filterText: {
    fontSize: 15,
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentDate: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 4,
  },
  paymentCycle: {
    fontSize: 13,
    lineHeight: 18,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
