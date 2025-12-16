import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { CategoryColors, Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  Category,
  CATEGORY_LABELS,
  formatCurrency,
  toMonthlyAmount,
} from "@/types/subscription";

// カテゴリ別の支出を計算
interface CategoryData {
  category: Category;
  amount: number;
  percentage: number;
  color: string;
}

export default function ReportScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { subscriptions, monthlyTotal } = useSubscriptions();

  const cardBackground = useThemeColor({}, "cardBackground");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = Colors[colorScheme ?? "light"].tint;

  // カテゴリ別の支出データを計算
  const categoryData = useMemo(() => {
    const categoryAmounts: Record<string, number> = {};

    subscriptions.forEach((sub) => {
      const monthly = toMonthlyAmount(sub.amount, sub.cycle);
      categoryAmounts[sub.category] = (categoryAmounts[sub.category] || 0) + monthly;
    });

    const data: CategoryData[] = Object.entries(categoryAmounts)
      .map(([category, amount]) => ({
        category: category as Category,
        amount,
        percentage: monthlyTotal > 0 ? (amount / monthlyTotal) * 100 : 0,
        color: CategoryColors[category] || CategoryColors.other,
      }))
      .sort((a, b) => b.amount - a.amount);

    return data;
  }, [subscriptions, monthlyTotal]);

  // 円グラフのパスを生成
  const pieChartPaths = useMemo(() => {
    const paths: { d: string; color: string }[] = [];
    let startAngle = -90; // 12時の位置から開始
    const radius = 80;
    const cx = 100;
    const cy = 100;

    categoryData.forEach((item) => {
      const angle = (item.percentage / 100) * 360;
      const endAngle = startAngle + angle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      paths.push({ d, color: item.color });
      startAngle = endAngle;
    });

    return paths;
  }, [categoryData]);

  // 月別データ（シミュレーション）
  const monthlyData = useMemo(() => {
    const months = ["7月", "8月", "9月", "10月", "11月", "12月"];
    // 簡易的なシミュレーション：現在の月額を基準に過去を推定
    const baseAmount = monthlyTotal;
    return months.map((month, index) => ({
      month,
      amount: Math.round(baseAmount * (0.6 + index * 0.08)),
    }));
  }, [monthlyTotal]);

  const maxMonthlyAmount = Math.max(...monthlyData.map((d) => d.amount), 1);

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <ThemedText style={styles.title}>レポート</ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* サマリーカード */}
        <View style={[styles.summaryCard, { backgroundColor: tint }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>月額合計</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {formatCurrency(monthlyTotal)}
              </ThemedText>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>年間合計</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {formatCurrency(monthlyTotal * 12)}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* カテゴリ別支出 */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>カテゴリ別支出</ThemedText>
          <View style={[styles.chartCard, { backgroundColor: cardBackground }]}>
            {categoryData.length > 0 ? (
              <>
                <View style={styles.pieChartContainer}>
                  <Svg width={200} height={200} viewBox="0 0 200 200">
                    <G>
                      {pieChartPaths.map((path, index) => (
                        <Path key={index} d={path.d} fill={path.color} />
                      ))}
                    </G>
                    <Circle cx={100} cy={100} r={50} fill={cardBackground} />
                    <SvgText
                      x={100}
                      y={95}
                      textAnchor="middle"
                      fontSize={12}
                      fill={textSecondary}
                    >
                      合計
                    </SvgText>
                    <SvgText
                      x={100}
                      y={115}
                      textAnchor="middle"
                      fontSize={16}
                      fontWeight="bold"
                      fill={colorScheme === "dark" ? "#FFFFFF" : "#000000"}
                    >
                      {formatCurrency(monthlyTotal)}
                    </SvgText>
                  </Svg>
                </View>
                <View style={styles.legendContainer}>
                  {categoryData.map((item) => (
                    <View key={item.category} style={styles.legendItem}>
                      <View
                        style={[styles.legendColor, { backgroundColor: item.color }]}
                      />
                      <ThemedText style={styles.legendLabel}>
                        {CATEGORY_LABELS[item.category]}
                      </ThemedText>
                      <ThemedText style={[styles.legendValue, { color: textSecondary }]}>
                        {formatCurrency(item.amount)} ({item.percentage.toFixed(0)}%)
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.emptyChart}>
                <ThemedText style={[styles.emptyText, { color: textSecondary }]}>
                  サブスクを追加するとグラフが表示されます
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* 月別支出推移 */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>月別支出推移</ThemedText>
          <View style={[styles.chartCard, { backgroundColor: cardBackground }]}>
            <View style={styles.barChartContainer}>
              {monthlyData.map((item, index) => (
                <View key={index} style={styles.barItem}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${(item.amount / maxMonthlyAmount) * 100}%`,
                          backgroundColor: tint,
                        },
                      ]}
                    />
                  </View>
                  <ThemedText style={[styles.barLabel, { color: textSecondary }]}>
                    {item.month}
                  </ThemedText>
                </View>
              ))}
            </View>
            <View style={styles.barChartLegend}>
              <ThemedText style={[styles.barChartNote, { color: textSecondary }]}>
                ※ 過去の支出は推定値です
              </ThemedText>
            </View>
          </View>
        </View>

        {/* 統計情報 */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>統計</ThemedText>
          <View style={[styles.statsCard, { backgroundColor: cardBackground }]}>
            <View style={styles.statRow}>
              <ThemedText style={[styles.statLabel, { color: textSecondary }]}>
                登録サブスク数
              </ThemedText>
              <ThemedText style={styles.statValue}>
                {subscriptions.length}件
              </ThemedText>
            </View>
            <View style={styles.statRow}>
              <ThemedText style={[styles.statLabel, { color: textSecondary }]}>
                平均月額
              </ThemedText>
              <ThemedText style={styles.statValue}>
                {subscriptions.length > 0
                  ? formatCurrency(monthlyTotal / subscriptions.length)
                  : "¥0"}
              </ThemedText>
            </View>
            <View style={styles.statRow}>
              <ThemedText style={[styles.statLabel, { color: textSecondary }]}>
                1日あたり
              </ThemedText>
              <ThemedText style={styles.statValue}>
                {formatCurrency(monthlyTotal / 30)}
              </ThemedText>
            </View>
          </View>
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
    padding: 16,
    paddingBottom: 48,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  summaryLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "600",
    marginBottom: 12,
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
  },
  pieChartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  legendContainer: {
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 8,
  },
  legendLabel: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  legendValue: {
    fontSize: 15,
    lineHeight: 20,
  },
  emptyChart: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 20,
  },
  barChartContainer: {
    flexDirection: "row",
    height: 150,
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  barItem: {
    flex: 1,
    alignItems: "center",
  },
  barWrapper: {
    width: 32,
    height: 120,
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 8,
  },
  barChartLegend: {
    marginTop: 16,
    alignItems: "center",
  },
  barChartNote: {
    fontSize: 12,
    lineHeight: 16,
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  statLabel: {
    fontSize: 15,
    lineHeight: 20,
  },
  statValue: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
  },
});
