import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

import { Subscription } from "@/types/subscription";

const NOTIFICATION_SETTINGS_KEY = "notification_settings";

export interface NotificationSettings {
  enabled: boolean;
  daysBefore: number; // 請求日の何日前に通知するか
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  daysBefore: 1,
};

// 通知ハンドラーの設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  // 設定読み込み
  useEffect(() => {
    loadSettings();
    checkPermission();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (data) {
        setSettings(JSON.parse(data));
      }
    } catch (error) {
      console.error("Failed to load notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setHasPermission(status === "granted");
  };

  // 通知権限をリクエスト
  const requestPermission = useCallback(async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setHasPermission(status === "granted");
    return status === "granted";
  }, []);

  // 設定を保存
  const saveSettings = useCallback(async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to save notification settings:", error);
    }
  }, []);

  // 通知を有効/無効にする
  const toggleNotifications = useCallback(async (enabled: boolean) => {
    if (enabled && !hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }
    await saveSettings({ ...settings, enabled });
  }, [settings, hasPermission, requestPermission, saveSettings]);

  // 通知日数を変更
  const setDaysBefore = useCallback(async (days: number) => {
    await saveSettings({ ...settings, daysBefore: days });
  }, [settings, saveSettings]);

  // サブスクリプションの通知をスケジュール
  const scheduleNotification = useCallback(async (subscription: Subscription) => {
    if (!settings.enabled || !hasPermission) return;

    const nextBillingDate = new Date(subscription.nextBillingDate);
    const notificationDate = new Date(nextBillingDate);
    notificationDate.setDate(notificationDate.getDate() - settings.daysBefore);

    // 過去の日付の場合はスケジュールしない
    if (notificationDate <= new Date()) return;

    const identifier = `subscription-${subscription.id}`;

    // 既存の通知をキャンセル
    await Notifications.cancelScheduledNotificationAsync(identifier);

    // 新しい通知をスケジュール
    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title: "📅 サブスク請求日のお知らせ",
        body: `${subscription.name}の請求日が${settings.daysBefore === 0 ? "今日" : `${settings.daysBefore}日後`}です`,
        data: { subscriptionId: subscription.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notificationDate,
      },
    });
  }, [settings, hasPermission]);

  // すべてのサブスクリプションの通知をスケジュール
  const scheduleAllNotifications = useCallback(async (subscriptions: Subscription[]) => {
    if (!settings.enabled || !hasPermission) return;

    // すべての既存通知をキャンセル
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 各サブスクリプションの通知をスケジュール
    for (const subscription of subscriptions) {
      await scheduleNotification(subscription);
    }
  }, [settings, hasPermission, scheduleNotification]);

  // 特定のサブスクリプションの通知をキャンセル
  const cancelNotification = useCallback(async (subscriptionId: string) => {
    const identifier = `subscription-${subscriptionId}`;
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }, []);

  return {
    settings,
    hasPermission,
    loading,
    requestPermission,
    toggleNotifications,
    setDaysBefore,
    scheduleNotification,
    scheduleAllNotifications,
    cancelNotification,
  };
}
