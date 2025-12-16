import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

import { 
  Subscription, 
  generateId, 
  toMonthlyAmount 
} from "@/types/subscription";

const STORAGE_KEY = "subscriptions";

// サンプルデータ
const SAMPLE_DATA: Subscription[] = [
  {
    id: generateId(),
    name: "Netflix",
    amount: 1490,
    currency: "JPY",
    cycle: "monthly",
    nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: "video",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Spotify",
    amount: 980,
    currency: "JPY",
    cycle: "monthly",
    nextBillingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    category: "music",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "iCloud+",
    amount: 130,
    currency: "JPY",
    cycle: "monthly",
    nextBillingDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    category: "cloud",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // データ読み込み
  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setSubscriptions(JSON.parse(data));
      } else {
        // 初回起動時はサンプルデータを設定
        setSubscriptions(SAMPLE_DATA);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
      }
    } catch (error) {
      console.error("Failed to load subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  // データ保存
  const saveSubscriptions = async (newSubscriptions: Subscription[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSubscriptions));
      setSubscriptions(newSubscriptions);
    } catch (error) {
      console.error("Failed to save subscriptions:", error);
    }
  };

  // サブスク追加
  const addSubscription = useCallback(async (
    data: Omit<Subscription, "id" | "createdAt" | "updatedAt">
  ) => {
    const now = new Date().toISOString();
    const newSubscription: Subscription = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const newList = [...subscriptions, newSubscription];
    await saveSubscriptions(newList);
    return newSubscription;
  }, [subscriptions]);

  // サブスク更新
  const updateSubscription = useCallback(async (
    id: string,
    data: Partial<Omit<Subscription, "id" | "createdAt">>
  ) => {
    const newList = subscriptions.map((sub) =>
      sub.id === id
        ? { ...sub, ...data, updatedAt: new Date().toISOString() }
        : sub
    );
    await saveSubscriptions(newList);
  }, [subscriptions]);

  // サブスク削除
  const deleteSubscription = useCallback(async (id: string) => {
    const newList = subscriptions.filter((sub) => sub.id !== id);
    await saveSubscriptions(newList);
  }, [subscriptions]);

  // 月額合計計算
  const monthlyTotal = subscriptions.reduce((total, sub) => {
    return total + toMonthlyAmount(sub.amount, sub.cycle);
  }, 0);

  // 年額合計計算
  const yearlyTotal = monthlyTotal * 12;

  // IDでサブスク取得
  const getSubscriptionById = useCallback((id: string) => {
    return subscriptions.find((sub) => sub.id === id);
  }, [subscriptions]);

  return {
    subscriptions,
    loading,
    monthlyTotal,
    yearlyTotal,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getSubscriptionById,
    reload: loadSubscriptions,
  };
}
