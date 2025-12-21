import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

const ONBOARDING_COMPLETED_KEY = "@subsk_onboarding_completed";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "1",
    title: "サブスクを管理",
    description: "Netflix、Spotify、iCloud+など、毎月支払っているサブスクを一元管理できます。",
    icon: "📱",
  },
  {
    id: "2",
    title: "月額を把握",
    description: "毎月いくら払っているか一瞬で確認。無駄なサブスクを見つけて節約しましょう。",
    icon: "💰",
  },
  {
    id: "3",
    title: "通知でお知らせ",
    description: "請求日前に通知を受け取り、解約忘れを防止できます。",
    icon: "🔔",
  },
  {
    id: "4",
    title: "クラウドで同期",
    description: "複数デバイス間でデータを同期。いつでもどこでもアクセスできます。",
    icon: "☁️",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const textSecondary = useThemeColor({}, "textSecondary");
  const cardBackground = useThemeColor({}, "cardBackground");
  const tint = Colors[colorScheme ?? "light"].tint;

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // オンボーディング完了フラグをチェック
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      if (completed) {
        // すでに完了している場合はホームに遷移
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Failed to check onboarding status:", error);
    }
  };

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <ThemedText style={styles.logo}>SubscK</ThemedText>
        <Pressable onPress={handleSkip}>
          <ThemedText style={[styles.skipButton, { color: textSecondary }]}>
            スキップ
          </ThemedText>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ステップアイコン */}
        <View style={styles.iconContainer}>
          <ThemedText style={styles.icon}>{step.icon}</ThemedText>
        </View>

        {/* ステップタイトル */}
        <ThemedText style={styles.title}>{step.title}</ThemedText>

        {/* ステップ説明 */}
        <ThemedText style={[styles.description, { color: textSecondary }]}>
          {step.description}
        </ThemedText>

        {/* ステップインジケーター */}
        <View style={styles.dotsContainer}>
          {ONBOARDING_STEPS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index <= currentStep ? tint : "rgba(0, 0, 0, 0.1)",
                },
              ]}
            />
          ))}
        </View>
      </ScrollView>

      {/* ボタン */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Pressable
          onPress={handleNext}
          style={[styles.button, { backgroundColor: tint }]}
        >
          <ThemedText style={styles.buttonText}>
            {currentStep === ONBOARDING_STEPS.length - 1 ? "始める" : "次へ"}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  logo: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },
  skipButton: {
    fontSize: 16,
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  icon: {
    fontSize: 80,
    lineHeight: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
    textAlign: "center",
    marginBottom: 48,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    color: "#fff",
  },
});
