import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatCurrency } from "@/types/subscription";

interface TotalCardProps {
  monthlyTotal: number;
  yearlyTotal: number;
  subscriptionCount: number;
}

export function TotalCard({ monthlyTotal, yearlyTotal, subscriptionCount }: TotalCardProps) {
  const tint = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "textSecondary");

  return (
    <View style={[styles.card, { backgroundColor: tint }]}>
      <ThemedText style={styles.label}>月額合計</ThemedText>
      <ThemedText style={styles.amount}>
        {formatCurrency(monthlyTotal)}
      </ThemedText>
      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          年間 {formatCurrency(yearlyTotal)}
        </ThemedText>
        <ThemedText style={styles.footerText}>
          {subscriptionCount}件のサブスク
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 24,
    borderRadius: 16,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  amount: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: "700",
    color: "#FFFFFF",
    includeFontPadding: false,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255, 255, 255, 0.3)",
  },
  footerText: {
    fontSize: 13,
    lineHeight: 18,
    color: "rgba(255, 255, 255, 0.8)",
  },
});
