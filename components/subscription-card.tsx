import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { CategoryColors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { 
  Subscription, 
  formatCurrency, 
  formatDate,
  CATEGORY_LABELS,
  CYCLE_LABELS,
} from "@/types/subscription";

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress?: () => void;
}

export function SubscriptionCard({ subscription, onPress }: SubscriptionCardProps) {
  const cardBackground = useThemeColor({}, "cardBackground");
  const textSecondary = useThemeColor({}, "textSecondary");
  const categoryColor = CategoryColors[subscription.category] || CategoryColors.other;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: cardBackground },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <ThemedText style={styles.name} numberOfLines={1}>
            {subscription.name}
          </ThemedText>
          <ThemedText style={[styles.meta, { color: textSecondary }]}>
            {CATEGORY_LABELS[subscription.category]} · 次回 {formatDate(subscription.nextBillingDate)}
          </ThemedText>
        </View>
        <View style={styles.rightSection}>
          <ThemedText style={styles.amount}>
            {formatCurrency(subscription.amount)}
          </ThemedText>
          <ThemedText style={[styles.cycle, { color: textSecondary }]}>
            {CYCLE_LABELS[subscription.cycle]}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  categoryIndicator: {
    width: 4,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  leftSection: {
    flex: 1,
    marginRight: 12,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    lineHeight: 18,
  },
  amount: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
  },
  cycle: {
    fontSize: 13,
    lineHeight: 18,
  },
});
