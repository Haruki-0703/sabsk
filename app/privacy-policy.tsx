import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? "light"].tint;
  const textSecondary = useThemeColor({}, "textSecondary");

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, 20) },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={tint} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>プライバシーポリシー</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.lastUpdated}>
          最終更新: 2024年12月
        </ThemedText>

        <Section title="1. はじめに">
          <ThemedText style={styles.body}>
            SubscK（以下「本アプリ」）は、ユーザーのプライバシーを尊重しています。本プライバシーポリシーは、本アプリがどのように情報を収集、使用、保護するかについて説明しています。
          </ThemedText>
        </Section>

        <Section title="2. 収集する情報">
          <ThemedText style={styles.body}>
            本アプリは以下の情報を収集します:
          </ThemedText>
          <BulletPoint text="ユーザーが入力したサブスクリプション情報（サービス名、金額、請求日など）" />
          <BulletPoint text="デバイスの識別情報（アプリの使用統計のため）" />
          <BulletPoint text="アプリの使用状況とエラーログ" />
        </Section>

        <Section title="3. 情報の使用">
          <ThemedText style={styles.body}>
            収集された情報は以下の目的で使用されます:
          </ThemedText>
          <BulletPoint text="本アプリの機能提供と改善" />
          <BulletPoint text="ユーザー体験の向上" />
          <BulletPoint text="技術的な問題の診断と修正" />
          <BulletPoint text="セキュリティと不正使用の防止" />
        </Section>

        <Section title="4. データの保存">
          <ThemedText style={styles.body}>
            ユーザーが入力したサブスクリプション情報は、ユーザーのデバイス上に安全に保存されます。本アプリはこれらの情報をサーバーに送信しません。
          </ThemedText>
        </Section>

        <Section title="5. 第三者との共有">
          <ThemedText style={styles.body}>
            本アプリは、ユーザーの同意なしに個人情報を第三者と共有しません。ただし、法律で要求される場合を除きます。
          </ThemedText>
        </Section>

        <Section title="6. セキュリティ">
          <ThemedText style={styles.body}>
            本アプリは、ユーザーの情報を保護するために適切なセキュリティ対策を実施しています。ただし、完全なセキュリティを保証することはできません。
          </ThemedText>
        </Section>

        <Section title="7. ユーザーの権利">
          <ThemedText style={styles.body}>
            ユーザーは、いつでも本アプリから自分のデータを削除することができます。
          </ThemedText>
        </Section>

        <Section title="8. ポリシーの変更">
          <ThemedText style={styles.body}>
            本ポリシーは予告なく変更される場合があります。重大な変更がある場合は、ユーザーに通知します。
          </ThemedText>
        </Section>

        <Section title="9. お問い合わせ">
          <ThemedText style={styles.body}>
            プライバシーに関するご質問やご懸念がある場合は、アプリ内のサポート機能からお問い合わせください。
          </ThemedText>
        </Section>
      </ScrollView>
    </ThemedView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {children}
    </View>
  );
}

function BulletPoint({ text }: { text: string }) {
  return (
    <View style={styles.bulletPoint}>
      <ThemedText style={styles.bullet}>•</ThemedText>
      <ThemedText style={styles.bulletText}>{text}</ThemedText>
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
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
  },
  placeholder: {
    minWidth: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  lastUpdated: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.6,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 15,
    lineHeight: 22,
    marginRight: 8,
    minWidth: 16,
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
});
