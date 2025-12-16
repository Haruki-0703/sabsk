import AsyncStorage from "@react-native-async-storage/async-storage";

import { Subscription, toMonthlyAmount } from "@/types/subscription";

const STORAGE_KEY = "subscriptions";
const WIDGET_DATA_KEY = "widget_data";

export interface WidgetData {
  monthlyTotal: number;
  yearlyTotal: number;
  subscriptionCount: number;
  topSubscriptions: {
    name: string;
    amount: number;
  }[];
  lastUpdated: string;
}

/**
 * ウィジェット用のデータを計算して保存
 */
export async function updateWidgetData(): Promise<WidgetData> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    const subscriptions: Subscription[] = data ? JSON.parse(data) : [];

    // 月額合計計算
    const monthlyTotal = subscriptions.reduce((total, sub) => {
      return total + toMonthlyAmount(sub.amount, sub.cycle);
    }, 0);

    // 上位3つのサブスク
    const sortedSubs = [...subscriptions].sort((a, b) => {
      return toMonthlyAmount(b.amount, b.cycle) - toMonthlyAmount(a.amount, a.cycle);
    });

    const widgetData: WidgetData = {
      monthlyTotal,
      yearlyTotal: monthlyTotal * 12,
      subscriptionCount: subscriptions.length,
      topSubscriptions: sortedSubs.slice(0, 3).map((sub) => ({
        name: sub.name,
        amount: toMonthlyAmount(sub.amount, sub.cycle),
      })),
      lastUpdated: new Date().toISOString(),
    };

    // ウィジェットデータを保存
    await AsyncStorage.setItem(WIDGET_DATA_KEY, JSON.stringify(widgetData));

    return widgetData;
  } catch (error) {
    console.error("Failed to update widget data:", error);
    throw error;
  }
}

/**
 * ウィジェットデータを取得
 */
export async function getWidgetData(): Promise<WidgetData | null> {
  try {
    const data = await AsyncStorage.getItem(WIDGET_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to get widget data:", error);
    return null;
  }
}

/**
 * 金額をフォーマット
 */
export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}
