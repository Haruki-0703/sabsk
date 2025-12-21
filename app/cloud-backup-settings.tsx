import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useCloudAuth } from "@/hooks/use-cloud-auth";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function CloudBackupSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const textSecondary = useThemeColor({}, "textSecondary");
  const cardBackground = useThemeColor({}, "cardBackground");
  const tint = Colors[colorScheme ?? "light"].tint;

  const { user, loading, loginLocal, loginWithGoogle, loginWithApple, logout, loadUser } =
    useCloudAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const handleLoginLocal = async () => {
    try {
      setIsLoggingIn(true);
      await loginLocal("user@subsk.local", "SubscK User");
    } catch (error) {
      console.error("Local login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLoginGoogle = async () => {
    try {
      setIsLoggingIn(true);
      await loginWithGoogle();
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLoginApple = async () => {
    try {
      setIsLoggingIn(true);
      await loginWithApple();
    } catch (error) {
      console.error("Apple login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={tint} />
        </Pressable>
        <ThemedText style={styles.title}>クラウドバックアップ</ThemedText>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {user ? (
          <>
            {/* ログイン状態 */}
            <View style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { color: textSecondary }]}>
                ログイン状態
              </ThemedText>
              <View style={[styles.userCard, { backgroundColor: cardBackground }]}>
                <View style={styles.userInfo}>
                  <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
                  <ThemedText style={[styles.userProvider, { color: textSecondary }]}>
                    {user.provider === "local"
                      ? "ローカル"
                      : user.provider === "google"
                        ? "Google"
                        : "Apple"}
                  </ThemedText>
                  {user.lastSyncTime && (
                    <ThemedText style={[styles.syncTime, { color: textSecondary }]}>
                      最終同期: {new Date(user.lastSyncTime).toLocaleString("ja-JP")}
                    </ThemedText>
                  )}
                </View>
              </View>
            </View>

            {/* バックアップ情報 */}
            <View style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { color: textSecondary }]}>
                バックアップ情報
              </ThemedText>
              <View style={[styles.infoCard, { backgroundColor: cardBackground }]}>
                <ThemedText style={styles.infoText}>
                  データは自動的にクラウドに同期されます。
                </ThemedText>
              </View>
            </View>

            {/* ログアウトボタン */}
            <View style={styles.section}>
              <Pressable
                onPress={handleLogout}
                style={[styles.button, { backgroundColor: "#FF3B30" }]}
              >
                <ThemedText style={styles.buttonText}>ログアウト</ThemedText>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            {/* ログイン説明 */}
            <View style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { color: textSecondary }]}>
                クラウドバックアップについて
              </ThemedText>
              <View style={[styles.infoCard, { backgroundColor: cardBackground }]}>
                <ThemedText style={styles.infoText}>
                  ログインすることで、サブスク情報をクラウドに保存し、複数デバイス間で同期できます。
                </ThemedText>
              </View>
            </View>

            {/* ログインオプション */}
            <View style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { color: textSecondary }]}>
                ログイン方法
              </ThemedText>

              {/* ローカルログイン */}
              <Pressable
                onPress={handleLoginLocal}
                disabled={isLoggingIn || loading}
                style={[
                  styles.button,
                  { backgroundColor: tint },
                  (isLoggingIn || loading) && styles.buttonDisabled,
                ]}
              >
                {isLoggingIn ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <IconSymbol name="lock.fill" size={20} color="#fff" />
                    <ThemedText style={styles.buttonText}>ローカルで使用</ThemedText>
                  </>
                )}
              </Pressable>

              {/* Google ログイン */}
              <Pressable
                onPress={handleLoginGoogle}
                disabled={isLoggingIn || loading}
                style={[
                  styles.button,
                  { backgroundColor: "#4285F4" },
                  (isLoggingIn || loading) && styles.buttonDisabled,
                ]}
              >
                {isLoggingIn ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <IconSymbol name="g.circle.fill" size={20} color="#fff" />
                    <ThemedText style={styles.buttonText}>Google でログイン</ThemedText>
                  </>
                )}
              </Pressable>

              {/* Apple ログイン */}
              <Pressable
                onPress={handleLoginApple}
                disabled={isLoggingIn || loading}
                style={[
                  styles.button,
                  { backgroundColor: "#000" },
                  (isLoggingIn || loading) && styles.buttonDisabled,
                ]}
              >
                {isLoggingIn ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <IconSymbol name="apple.logo" size={20} color="#fff" />
                    <ThemedText style={styles.buttonText}>Apple でログイン</ThemedText>
                  </>
                )}
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
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
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },
  spacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  userCard: {
    padding: 16,
    borderRadius: 12,
  },
  userInfo: {
    gap: 8,
  },
  userEmail: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
  },
  userProvider: {
    fontSize: 13,
    lineHeight: 18,
  },
  syncTime: {
    fontSize: 12,
    lineHeight: 16,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
    minHeight: 50,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    color: "#fff",
  },
});
