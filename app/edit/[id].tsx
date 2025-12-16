import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
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
import { Colors } from "@/constants/theme";
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
  "entertainment",
  "productivity",
  "cloud",
  "gaming",
  "news",
  "fitness",
  "other",
];

const CYCLES: BillingCycle[] = ["monthly", "yearly", "weekly"];

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { getSubscriptionById, updateSubscription } = useSubscriptions();

  const cardBackground = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = Colors[colorScheme ?? "light"].tint;
  const border = Colors[colorScheme ?? "light"].border;

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [category, setCategory] = useState<Category>("other");
  const [nextBillingDate, setNextBillingDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const sub = getSubscriptionById(id);
      if (sub) {
        setName(sub.name);
        setAmount(String(sub.amount));
        setCycle(sub.cycle);
        setCategory(sub.category);
        setNextBillingDate(new Date(sub.nextBillingDate));
        setNote(sub.note || "");
      }
    }
  }, [id, getSubscriptionById]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("エラー", "サービス名を入力してください");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("エラー", "正しい金額を入力してください");
      return;
    }

    setSaving(true);
    try {
      if (id) {
        await updateSubscription(id, {
          name: name.trim(),
          amount: Number(amount),
          cycle,
          category,
          nextBillingDate: nextBillingDate.toISOString(),
          note: note.trim() || undefined,
        });
      }
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

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, 20), borderBottomColor: border },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <ThemedText style={[styles.headerButtonText, { color: tint }]}>
            キャンセル
          </ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>サブスク編集</ThemedText>
        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={styles.headerButton}
        >
          <ThemedText
            style={[
              styles.headerButtonText,
              { color: tint, fontWeight: "600" },
              saving && { opacity: 0.5 },
            ]}
          >
            保存
          </ThemedText>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* サービス名 */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: textSecondary }]}>
              サービス名
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: cardBackground, color: textColor },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Netflix, Spotify など"
              placeholderTextColor={textSecondary}
            />
          </View>

          {/* 金額 */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: textSecondary }]}>
              金額
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: cardBackground, color: textColor },
              ]}
              value={amount}
              onChangeText={setAmount}
              placeholder="1000"
              placeholderTextColor={textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* 請求サイクル */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: textSecondary }]}>
              請求サイクル
            </ThemedText>
            <View style={styles.optionRow}>
              {CYCLES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setCycle(c)}
                  style={[
                    styles.optionButton,
                    { backgroundColor: cardBackground },
                    cycle === c && { backgroundColor: tint },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      cycle === c && { color: "#FFFFFF" },
                    ]}
                  >
                    {CYCLE_LABELS[c]}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          {/* カテゴリ */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: textSecondary }]}>
              カテゴリ
            </ThemedText>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: cardBackground },
                    category === c && { backgroundColor: tint },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.categoryText,
                      category === c && { color: "#FFFFFF" },
                    ]}
                  >
                    {CATEGORY_LABELS[c]}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          {/* 次回請求日 */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: textSecondary }]}>
              次回請求日
            </ThemedText>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={[styles.dateButton, { backgroundColor: cardBackground }]}
            >
              <IconSymbol name="calendar" size={20} color={tint} />
              <ThemedText style={styles.dateText}>
                {nextBillingDate.toLocaleDateString("ja-JP")}
              </ThemedText>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={nextBillingDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* メモ */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: textSecondary }]}>
              メモ（任意）
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: cardBackground, color: textColor },
              ]}
              value={note}
              onChangeText={setNote}
              placeholder="メモを入力..."
              placeholderTextColor={textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: {
    minWidth: 80,
  },
  headerButtonText: {
    fontSize: 17,
    lineHeight: 22,
  },
  headerTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
  },
  keyboardView: {
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
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  input: {
    fontSize: 17,
    lineHeight: 22,
    padding: 16,
    borderRadius: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  optionRow: {
    flexDirection: "row",
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  optionText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  dateText: {
    fontSize: 17,
    lineHeight: 22,
  },
});
