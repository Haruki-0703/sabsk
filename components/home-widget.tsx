import { useEffect, useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { formatCurrency, updateWidgetData, WidgetData } from "@/lib/widget-data";

interface HomeWidgetProps {
  compact?: boolean;
}

export function HomeWidget({ compact = false }: HomeWidgetProps) {
  const router = useRouter();
  const { subscriptions, monthlyTotal, yearlyTotal } = useSubscriptions();
  const [widgetData, setWidgetData] = useState<WidgetData | null>(null);

  useEffect(() => {
    // ウィジェットデータを更新
    updateWidgetData().then(setWidgetData).catch(console.error);
  }, [subscriptions]);

  const handlePress = () => {
    router.push("/report");
  };

  if (compact) {
    return (
      <Pressable onPress={handlePress}>
        <LinearGradient
          colors={["#007AFF", "#00C6FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.compactContainer}
        >
          <ThemedText style={styles.compactLabel}>月額合計</ThemedText>
          <ThemedText style={styles.compactAmount}>
            {formatCurrency(monthlyTotal)}
          </ThemedText>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={handlePress}>
      <LinearGradient
        colors={["#007AFF", "#00C6FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <ThemedText style={styles.label}>月額合計</ThemedText>
          <ThemedText style={styles.amount}>
            {formatCurrency(monthlyTotal)}
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <View style={styles.stat}>
            <ThemedText style={styles.statLabel}>年間</ThemedText>
            <ThemedText style={styles.statValue}>
              {formatCurrency(yearlyTotal)}
            </ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText style={styles.statLabel}>登録数</ThemedText>
            <ThemedText style={styles.statValue}>
              {subscriptions.length}件
            </ThemedText>
          </View>
        </View>

        {widgetData && widgetData.topSubscriptions.length > 0 && (
          <View style={styles.topSubs}>
            {widgetData.topSubscriptions.map((sub, index) => (
              <View key={index} style={styles.topSubItem}>
                <ThemedText style={styles.topSubName} numberOfLines={1}>
                  {sub.name}
                </ThemedText>
                <ThemedText style={styles.topSubAmount}>
                  {formatCurrency(sub.amount)}
                </ThemedText>
              </View>
            ))}
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  compactContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  amount: {
    fontSize: 36,
    lineHeight: 43,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  compactLabel: {
    fontSize: 14,
    lineHeight: 18,
    color: "rgba(255, 255, 255, 0.8)",
  },
  compactAmount: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  footer: {
    flexDirection: "row",
    gap: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  topSubs: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    gap: 8,
  },
  topSubItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topSubName: {
    fontSize: 14,
    lineHeight: 18,
    color: "rgba(255, 255, 255, 0.9)",
    flex: 1,
    marginRight: 8,
  },
  topSubAmount: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
