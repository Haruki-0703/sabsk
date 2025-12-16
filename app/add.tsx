import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
  JAPANESE_SUBSCRIPTIONS,
  getJapaneseSubscriptionById,
  searchJapaneseSubscriptions,
} from "@/constants/japanese-subscriptions";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  BillingCycle,
  Category,
  CATEGORY_LABELS,
  CYCLE_LABELS,
} from "@/types/subscription";

const CATEGORIES: Category[] = [
  "video",
  "music",
  "cloud",
  "productivity",
  "gaming",
  "news",
  "fitness",
  "other",
];

const CYCLES: BillingCycle[] = ["monthly", "yearly", "weekly"];

type InputMode = "manual" | "template";

export default function AddScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { addSubscription } = useSubscriptions();

  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = Colors[colorScheme ?? "light"].tint;
  const border = Colors[colorScheme ?? "light"].border;

  // 入力モード（手入力またはテンプレート）
  const [inputMode, setInputMode] = useState<InputMode>("manual");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");

  // 手入力フォーム
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [category, setCategory] = useState<Category>("video");
  const [nextBillingDate, setNextBillingDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  // テンプレート選択
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateAmount, setTemplateAmount] = useState("");

  // テンプレート検索結果
  const filteredTemplates = useMemo(() => {
    if (!templateSearch.trim()) {
      return JAPANESE_SUBSCRIPTIONS;
    }
    return searchJapaneseSubscriptions(templateSearch);
  }, [templateSearch]);

  const handleSave = async () => {
    let finalName = name;
    let finalAmount = amount;
    let finalCategory = category;
    let finalCycle = cycle;

    if (inputMode === "template") {
      if (!selectedTemplate) {
        Alert.alert("エラー", "テンプレートを選択してください");
        return;
      }
      const template = getJapaneseSubscriptionById(selectedTemplate);
      if (!template) {
        Alert.alert("エラー", "テンプレートが見つかりません");
        return;
      }

      finalName = template.name;
      finalCategory = template.category;
      finalCycle = template.cycle;
      finalAmount = templateAmount || template.defaultAmount.toString();
    } else {
      if (!name.trim()) {
        Alert.alert("エラー", "サービス名を入力してください");
        return;
      }
    }

    if (!finalAmount || isNaN(Number(finalAmount)) || Number(finalAmount) < 0) {
      Alert.alert("エラー", "正しい金額を入力してください");
      return;
    }

    setSaving(true);
    try {
      await addSubscription({
        name: finalName.trim(),
        amount: Number(finalAmount),
        currency: "JPY",
        cycle: finalCycle,
        category: finalCategory,
        nextBillingDate: nextBillingDate.toISOString(),
        note: note.trim() || undefined,
      });
      router.back();
    } catch (error) {
      Alert.alert("エラー", "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setNextBillingDate(selectedDate);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    const template = getJapaneseSubscriptionById(templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setTemplateAmount(template.defaultAmount.toString());
      setShowTemplateModal(false);
    }
  };

  const selectedTemplateData = selectedTemplate
    ? getJapaneseSubscriptionById(selectedTemplate)
    : null;

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
        <ThemedText style={styles.headerTitle}>サブスク追加</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 入力モード選択 */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>入力方法</ThemedText>
            <View style={[styles.modeSelector, { backgroundColor: cardBackground }]}>
              <Pressable
                onPress={() => setInputMode("manual")}
                style={[
                  styles.modeButton,
                  inputMode === "manual" && { backgroundColor: tint },
                ]}
              >
                <ThemedText
                  style={[
                    styles.modeButtonText,
                    inputMode === "manual" && { color: "#FFFFFF" },
                  ]}
                >
                  手入力
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setInputMode("template")}
                style={[
                  styles.modeButton,
                  inputMode === "template" && { backgroundColor: tint },
                ]}
              >
                <ThemedText
                  style={[
                    styles.modeButtonText,
                    inputMode === "template" && { color: "#FFFFFF" },
                  ]}
                >
                  テンプレート
                </ThemedText>
              </Pressable>
            </View>
          </View>

          {inputMode === "manual" ? (
            // 手入力フォーム
            <>
              {/* サービス名 */}
              <View style={styles.section}>
                <ThemedText style={styles.label}>サービス名 *</ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor, borderColor: border }]}
                  placeholder="例：Netflix"
                  placeholderTextColor={textSecondary}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* 金額 */}
              <View style={styles.section}>
                <ThemedText style={styles.label}>月額料金 *</ThemedText>
                <View style={[styles.inputGroup, { borderColor: border }]}>
                  <ThemedText style={styles.currencySymbol}>¥</ThemedText>
                  <TextInput
                    style={[styles.amountInput, { color: textColor }]}
                    placeholder="1490"
                    placeholderTextColor={textSecondary}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {/* カテゴリ */}
              <View style={styles.section}>
                <ThemedText style={styles.label}>カテゴリ</ThemedText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryScroll}
                >
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      style={[
                        styles.categoryChip,
                        category === cat && { backgroundColor: tint },
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.categoryChipText,
                          category === cat && { color: "#FFFFFF" },
                        ]}
                      >
                        {CATEGORY_LABELS[cat]}
                      </ThemedText>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* 請求サイクル */}
              <View style={styles.section}>
                <ThemedText style={styles.label}>請求サイクル</ThemedText>
                <View style={styles.cycleButtons}>
                  {CYCLES.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setCycle(c)}
                      style={[
                        styles.cycleButton,
                        cycle === c && { backgroundColor: tint },
                        { borderColor: border },
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.cycleButtonText,
                          cycle === c && { color: "#FFFFFF" },
                        ]}
                      >
                        {CYCLE_LABELS[c]}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            </>
          ) : (
            // テンプレート選択フォーム
            <>
              {/* テンプレート選択 */}
              <View style={styles.section}>
                <ThemedText style={styles.label}>サービスを選択 *</ThemedText>
                <Pressable
                  onPress={() => setShowTemplateModal(true)}
                  style={[
                    styles.templateSelector,
                    { backgroundColor: cardBackground, borderColor: border },
                  ]}
                >
                  {selectedTemplateData ? (
                    <View style={styles.selectedTemplate}>
                      <View
                        style={[
                          styles.templateIcon,
                          {
                            backgroundColor:
                              CategoryColors[selectedTemplateData.category],
                          },
                        ]}
                      >
                        <ThemedText style={styles.templateIconText}>
                          {selectedTemplateData.name.charAt(0).toUpperCase()}
                        </ThemedText>
                      </View>
                      <View style={styles.templateInfo}>
                        <ThemedText style={styles.templateName}>
                          {selectedTemplateData.name}
                        </ThemedText>
                        <ThemedText
                          style={[styles.templateDesc, { color: textSecondary }]}
                        >
                          {selectedTemplateData.description}
                        </ThemedText>
                      </View>
                      <IconSymbol
                        name="chevron.right"
                        size={20}
                        color={textSecondary}
                      />
                    </View>
                  ) : (
                    <ThemedText style={[styles.placeholder, { color: textSecondary }]}>
                      サービスを選択してください
                    </ThemedText>
                  )}
                </Pressable>
              </View>

              {/* テンプレート金額 */}
              {selectedTemplateData && (
                <View style={styles.section}>
                  <ThemedText style={styles.label}>月額料金</ThemedText>
                  <ThemedText style={[styles.hint, { color: textSecondary }]}>
                    デフォルト: ¥{selectedTemplateData.defaultAmount.toLocaleString()}
                  </ThemedText>
                  <View style={[styles.inputGroup, { borderColor: border }]}>
                    <ThemedText style={styles.currencySymbol}>¥</ThemedText>
                    <TextInput
                      style={[styles.amountInput, { color: textColor }]}
                      placeholder={selectedTemplateData.defaultAmount.toString()}
                      placeholderTextColor={textSecondary}
                      value={templateAmount}
                      onChangeText={setTemplateAmount}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>
              )}
            </>
          )}

          {/* 次回請求日 */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>次回請求日</ThemedText>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={[styles.input, { borderColor: border }]}
            >
              <ThemedText style={{ color: textColor }}>
                {nextBillingDate.toLocaleDateString("ja-JP")}
              </ThemedText>
            </Pressable>
          </View>

          {/* メモ */}
          <View style={styles.section}>
            <ThemedText style={styles.label}>メモ（オプション）</ThemedText>
            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
                { color: textColor, borderColor: border },
              ]}
              placeholder="例：家族で共有"
              placeholderTextColor={textSecondary}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* 保存ボタン */}
          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={[
              styles.saveButton,
              { backgroundColor: tint },
              saving && styles.saveButtonDisabled,
            ]}
          >
            <ThemedText style={styles.saveButtonText}>
              {saving ? "保存中..." : "保存"}
            </ThemedText>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 日付ピッカー */}
      {showDatePicker && (
        <DateTimePicker
          value={nextBillingDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      {/* テンプレート選択モーダル */}
      <Modal
        visible={showTemplateModal}
        animationType="slide"
        onRequestClose={() => setShowTemplateModal(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <View
            style={[
              styles.modalHeader,
              { paddingTop: Math.max(insets.top, 20), borderBottomColor: border },
            ]}
          >
            <Pressable
              onPress={() => setShowTemplateModal(false)}
              style={styles.backButton}
            >
              <IconSymbol name="chevron.left" size={24} color={tint} />
              <ThemedText style={[styles.backText, { color: tint }]}>戻る</ThemedText>
            </Pressable>
            <ThemedText style={styles.headerTitle}>サービス選択</ThemedText>
            <View style={styles.placeholder} />
          </View>

          {/* 検索バー */}
          <View
            style={[
              styles.searchBar,
              { backgroundColor: cardBackground, borderColor: border },
            ]}
          >
            <IconSymbol name="magnifyingglass" size={16} color={textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: textColor }]}
              placeholder="サービス名で検索"
              placeholderTextColor={textSecondary}
              value={templateSearch}
              onChangeText={setTemplateSearch}
            />
            {templateSearch.length > 0 && (
              <Pressable onPress={() => setTemplateSearch("")}>
                <IconSymbol name="xmark" size={16} color={textSecondary} />
              </Pressable>
            )}
          </View>

          {/* テンプレートリスト */}
          <FlatList
            data={filteredTemplates}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectTemplate(item.id)}
                style={[
                  styles.templateItem,
                  { backgroundColor: cardBackground, borderColor: border },
                ]}
              >
                <View
                  style={[
                    styles.templateIcon,
                    { backgroundColor: CategoryColors[item.category] },
                  ]}
                >
                  <ThemedText style={styles.templateIconText}>
                    {item.name.charAt(0).toUpperCase()}
                  </ThemedText>
                </View>
                <View style={styles.templateInfo}>
                  <ThemedText style={styles.templateName}>{item.name}</ThemedText>
                  <ThemedText
                    style={[styles.templateDesc, { color: textSecondary }]}
                  >
                    {item.description}
                  </ThemedText>
                </View>
                <View style={styles.templatePrice}>
                  <ThemedText style={styles.templateAmount}>
                    ¥{item.defaultAmount.toLocaleString()}
                  </ThemedText>
                  <ThemedText style={[styles.templateCycle, { color: textSecondary }]}>
                    {CYCLE_LABELS[item.cycle]}
                  </ThemedText>
                </View>
              </Pressable>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </ThemedView>
      </Modal>
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
  content: {
    flex: 1,
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
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "600",
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 21,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 21,
  },
  multilineInput: {
    paddingVertical: 12,
    textAlignVertical: "top",
  },
  modeSelector: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 4,
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  modeButtonText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
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
  cycleButtons: {
    flexDirection: "row",
    gap: 8,
  },
  cycleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  cycleButtonText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
  },
  templateSelector: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  selectedTemplate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  templateIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
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
  saveButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 21,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 48,
    gap: 12,
  },
  templateItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
