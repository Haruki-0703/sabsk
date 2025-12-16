import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { CategoryColors, Colors } from "@/constants/theme";
import {
  SUBSCRIPTION_TEMPLATES,
  SubscriptionTemplate,
  getPopularTemplates,
  getTemplatesByCategory,
  searchTemplates,
} from "@/constants/templates";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useThemeColor } from "@/hooks/use-theme-color";
import { CATEGORY_LABELS, Category, generateId } from "@/types/subscription";

type TabType = "popular" | "all" | "search";

export default function TemplatesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { addSubscription } = useSubscriptions();

  const [activeTab, setActiveTab] = useState<TabType>("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const cardBackground = useThemeColor({}, "cardBackground");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = Colors[colorScheme ?? "light"].tint;
  const border = Colors[colorScheme ?? "light"].border;

  // 表示するテンプレートを計算
  const displayedTemplates = useMemo(() => {
    let templates: SubscriptionTemplate[] = [];

    if (activeTab === "popular") {
      templates = getPopularTemplates();
    } else if (activeTab === "search" && searchQuery.trim()) {
      templates = searchTemplates(searchQuery);
    } else {
      templates = SUBSCRIPTION_TEMPLATES;
    }

    // カテゴリでフィルター
    if (selectedCategory) {
      templates = templates.filter((t) => t.category === selectedCategory);
    }

    return templates;
  }, [activeTab, searchQuery, selectedCategory]);

  // テンプレートからサブスクを追加
  const handleAddTemplate = useCallback(
    async (template: SubscriptionTemplate) => {
      const today = new Date();
      const nextBillingDate = new Date(today);

      // 請求サイクルに応じて次回請求日を設定
      switch (template.cycle) {
        case "weekly":
          nextBillingDate.setDate(nextBillingDate.getDate() + 7);
          break;
        case "yearly":
          nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
          break;
        case "monthly":
        default:
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
          break;
      }

      const newSubscription = {
        id: generateId(),
        name: template.name,
        amount: template.amount,
        currency: "JPY",
        cycle: template.cycle,
        nextBillingDate: nextBillingDate.toISOString(),
        category: template.category,
        createdAt: today.toISOString(),
        updatedAt: today.toISOString(),
      };

      await addSubscription(newSubscription);
      router.back();
    },
    [addSubscription, router]
  );

  const categories: Category[] = [
    "video",
    "music",
    "cloud",
    "productivity",
    "gaming",
    "news",
    "fitness",
    "other",
  ];

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
        <ThemedText style={styles.headerTitle}>テンプレート</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 検索バー */}
        <View style={[styles.searchBar, { backgroundColor: cardBackground }]}>
          <IconSymbol name="magnifyingglass" size={16} color={textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: Colors[colorScheme ?? "light"].text }]}
            placeholder="サービス名で検索"
            placeholderTextColor={textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <IconSymbol name="xmark" size={16} color={textSecondary} />
            </Pressable>
          )}
        </View>

        {/* タブ */}
        <View style={[styles.tabBar, { borderBottomColor: border }]}>
          <Pressable
            onPress={() => {
              setActiveTab("popular");
              setSearchQuery("");
            }}
            style={[
              styles.tab,
              activeTab === "popular" && { borderBottomColor: tint, borderBottomWidth: 2 },
            ]}
          >
            <ThemedText
              style={[
                styles.tabText,
                activeTab === "popular" && { color: tint, fontWeight: "600" },
              ]}
            >
              人気
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => {
              setActiveTab("all");
              setSearchQuery("");
            }}
            style={[
              styles.tab,
              activeTab === "all" && { borderBottomColor: tint, borderBottomWidth: 2 },
            ]}
          >
            <ThemedText
              style={[
                styles.tabText,
                activeTab === "all" && { color: tint, fontWeight: "600" },
              ]}
            >
              すべて
            </ThemedText>
          </Pressable>
        </View>

        {/* カテゴリフィルター */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
          style={styles.categoryContainer}
        >
          <Pressable
            onPress={() => setSelectedCategory(null)}
            style={[
              styles.categoryChip,
              !selectedCategory && { backgroundColor: tint },
            ]}
          >
            <ThemedText
              style={[
                styles.categoryChipText,
                !selectedCategory && { color: "#FFFFFF" },
              ]}
            >
              すべて
            </ThemedText>
          </Pressable>
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryChip,
                selectedCategory === category && { backgroundColor: tint },
              ]}
            >
              <ThemedText
                style={[
                  styles.categoryChipText,
                  selectedCategory === category && { color: "#FFFFFF" },
                ]}
              >
                {CATEGORY_LABELS[category]}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        {/* テンプレートリスト */}
        {displayedTemplates.length > 0 ? (
          <FlatList
            data={displayedTemplates}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TemplateCard
                template={item}
                onAdd={() => handleAddTemplate(item)}
                cardBackground={cardBackground}
                textSecondary={textSecondary}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyState}>
            <ThemedText style={[styles.emptyText, { color: textSecondary }]}>
              テンプレートが見つかりません
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

interface TemplateCardProps {
  template: SubscriptionTemplate;
  onAdd: () => void;
  cardBackground: string;
  textSecondary: string;
}

function TemplateCard({
  template,
  onAdd,
  cardBackground,
  textSecondary,
}: TemplateCardProps) {
  const categoryColor = CategoryColors[template.category] || CategoryColors.other;

  return (
    <View style={[styles.templateCard, { backgroundColor: cardBackground }]}>
      <View style={styles.templateContent}>
        <View style={[styles.templateIcon, { backgroundColor: categoryColor }]}>
          <ThemedText style={styles.templateIconText}>
            {template.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        <View style={styles.templateInfo}>
          <ThemedText style={styles.templateName}>{template.name}</ThemedText>
          <ThemedText style={[styles.templateDesc, { color: textSecondary }]}>
            {template.description}
          </ThemedText>
        </View>
        <View style={styles.templatePrice}>
          <ThemedText style={styles.templateAmount}>
            ¥{template.amount.toLocaleString()}
          </ThemedText>
          <ThemedText style={[styles.templateCycle, { color: textSecondary }]}>
            {template.cycle === "monthly" ? "月額" : template.cycle === "yearly" ? "年額" : "週額"}
          </ThemedText>
        </View>
      </View>
      <Pressable
        onPress={onAdd}
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
      >
        <IconSymbol name="plus" size={20} color="#FFFFFF" />
      </Pressable>
    </View>
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
    paddingBottom: 48,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 21,
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabText: {
    fontSize: 15,
    lineHeight: 20,
  },
  categoryContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  categoryScroll: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  categoryChipText: {
    fontSize: 13,
    lineHeight: 18,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  templateCard: {
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  templateContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  templateIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  templateIconText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 22,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 21,
    marginBottom: 2,
  },
  templateDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  templatePrice: {
    alignItems: "flex-end",
  },
  templateAmount: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 21,
  },
  templateCycle: {
    fontSize: 12,
    lineHeight: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  emptyState: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 21,
  },
});
