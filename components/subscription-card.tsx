import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { CategoryColors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getServiceLogoUrl } from "@/lib/service-logos";
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
  
  const [logoError, setLogoError] = useState(false);
  const logoUrl = getServiceLogoUrl(subscription.name);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: cardBackground },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.content}>
        {/* ロゴまたはカテゴリカラー */}
        <View style={styles.logoContainer}>
          {logoUrl && !logoError ? (
            <Image
              source={{ uri: logoUrl }}
              style={styles.logo}
              contentFit="contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]}>
              <ThemedText style={styles.categoryInitial}>
                {subscription.name.charAt(0).toUpperCase()}
              </ThemedText>
            </View>
          )}
        </View>
        
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
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  logoContainer: {
    marginRight: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  categoryIndicator: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryInitial: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 22,
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
