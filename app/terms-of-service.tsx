import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function TermsOfServiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? "light"].tint;

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
        <ThemedText style={styles.headerTitle}>利用規約</ThemedText>
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

        <Section title="1. サービスの利用">
          <ThemedText style={styles.body}>
            本アプリ（SubscK）は、ユーザーのサブスクリプション管理を支援するために提供されています。ユーザーは、本利用規約に同意することで、本アプリを使用する権利を得ます。
          </ThemedText>
        </Section>

        <Section title="2. ユーザーの責任">
          <ThemedText style={styles.body}>
            ユーザーは、本アプリの使用に関して以下の責任を負います:
          </ThemedText>
          <BulletPoint text="入力したデータの正確性を確認する" />
          <BulletPoint text="デバイスのセキュリティを維持する" />
          <BulletPoint text="本アプリを違法な目的で使用しない" />
          <BulletPoint text="他のユーザーの権利を侵害しない" />
        </Section>

        <Section title="3. 知的財産権">
          <ThemedText style={styles.body}>
            本アプリおよびそのコンテンツは、著作権法により保護されています。ユーザーは、本アプリを個人的な使用目的でのみ使用することができます。
          </ThemedText>
        </Section>

        <Section title="4. 免責事項">
          <ThemedText style={styles.body}>
            本アプリは「現状のまま」提供されます。開発者は、本アプリの使用から生じるいかなる損害についても責任を負いません。
          </ThemedText>
        </Section>

        <Section title="5. データの削除">
          <ThemedText style={styles.body}>
            ユーザーは、いつでも本アプリから自分のデータを削除することができます。削除されたデータは復元できません。
          </ThemedText>
        </Section>

        <Section title="6. サービスの中断">
          <ThemedText style={styles.body}>
            開発者は、予告なく本アプリのサービスを中断または終了する権利を有します。
          </ThemedText>
        </Section>

        <Section title="7. 規約の変更">
          <ThemedText style={styles.body}>
            本利用規約は予告なく変更される場合があります。重大な変更がある場合は、ユーザーに通知します。
          </ThemedText>
        </Section>

        <Section title="8. 準拠法">
          <ThemedText style={styles.body}>
            本利用規約は、日本国の法律に準拠します。
          </ThemedText>
        </Section>

        <Section title="9. お問い合わせ">
          <ThemedText style={styles.body}>
            利用規約に関するご質問やご懸念がある場合は、アプリ内のサポート機能からお問い合わせください。
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
