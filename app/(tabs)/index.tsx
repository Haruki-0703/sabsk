import { useRouter, Link } from "expo-router";
import { useCallback, useState } from "react";
import { 
  ActivityIndicator, 
  FlatList, 
  Pressable, 
  RefreshControl,
  StyleSheet, 
  View 
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SubscriptionCard } from "@/components/subscription-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TotalCard } from "@/components/total-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { Subscription } from "@/types/subscription";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { subscriptions, loading, monthlyTotal, yearlyTotal, reload } = useSubscriptions();
  const tint = Colors[colorScheme ?? "light"].tint;
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }, [reload]);

  const handleAddPress = useCallback(() => {
    router.push("/add");
  }, [router]);

  const handleSubscriptionPress = useCallback((subscription: Subscription) => {
    router.push({
      pathname: "/detail/[id]",
      params: { id: subscription.id },
    });
  }, [router]);

  const renderItem = useCallback(({ item }: { item: Subscription }) => (
    <SubscriptionCard
      subscription={item}
      onPress={() => handleSubscriptionPress(item)}
    />
  ), [handleSubscriptionPress]);

  const keyExtractor = useCallback((item: Subscription) => item.id, []);

  const ListHeader = useCallback(() => (
    <View>
      <TotalCard
        monthlyTotal={monthlyTotal}
        yearlyTotal={yearlyTotal}
        subscriptionCount={subscriptions.length}
      />
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>サブスク一覧</ThemedText>
      </View>
    </View>
  ), [monthlyTotal, yearlyTotal, subscriptions.length]);

  const ListEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyText}>
        サブスクがありません
      </ThemedText>
      <ThemedText style={styles.emptySubtext}>
        右下の「+」ボタンから追加してください
      </ThemedText>
    </View>
  ), []);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tint} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <ThemedText style={styles.title}>SubscK</ThemedText>
      </View>
      
      <FlatList
        data={subscriptions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={tint}
            colors={[tint]}
            title="更新中..."
            titleColor={tint}
          />
        }
      />

      <View style={[styles.fabContainer, { bottom: Math.max(insets.bottom, 16) + 60 }]}>
        {/* テンプレートから追加 */}
        <Link href="/templates" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.fabSecondary,
              pressed && styles.fabPressed,
            ]}
          >
            <IconSymbol name="list.bullet" size={22} color={tint} />
          </Pressable>
        </Link>
        {/* 手動で追加 */}
        <Pressable
          onPress={handleAddPress}
          style={({ pressed }) => [
            styles.fab,
            { backgroundColor: tint },
            pressed && styles.fabPressed,
          ]}
        >
          <IconSymbol name="plus" size={28} color="#FFFFFF" />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  listContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    lineHeight: 20,
    opacity: 0.6,
    textAlign: "center",
  },
  fabContainer: {
    position: "absolute",
    right: 16,
    gap: 12,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
  fabSecondary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
});
