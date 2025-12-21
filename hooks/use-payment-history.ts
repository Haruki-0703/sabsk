import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PaymentHistory,
  PaymentHistoryStats,
  MonthlyPaymentData,
  YearlyPaymentData,
  calculatePaymentStats,
  groupPaymentsByMonth,
  groupPaymentsByYear,
} from '@/types/payment-history';

const PAYMENT_HISTORY_KEY = '@subsk_payment_history';

export function usePaymentHistory() {
  const [history, setHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // 支払い履歴を読み込む
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(PAYMENT_HISTORY_KEY);
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load payment history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 支払い履歴を保存
  const saveHistory = useCallback(async (newHistory: PaymentHistory[]) => {
    try {
      await AsyncStorage.setItem(PAYMENT_HISTORY_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Failed to save payment history:', error);
    }
  }, []);

  // 支払い履歴を追加
  const addPayment = useCallback(
    (payment: Omit<PaymentHistory, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const newPayment: PaymentHistory = {
        ...payment,
        id: `payment_${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      const updated = [...history, newPayment];
      saveHistory(updated);
      return newPayment;
    },
    [history, saveHistory]
  );

  // 支払い履歴を更新
  const updatePayment = useCallback(
    (id: string, updates: Partial<PaymentHistory>) => {
      const updated = history.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
      saveHistory(updated);
    },
    [history, saveHistory]
  );

  // 支払い履歴を削除
  const deletePayment = useCallback(
    (id: string) => {
      const updated = history.filter((p) => p.id !== id);
      saveHistory(updated);
    },
    [history, saveHistory]
  );

  // 特定のサブスクの支払い履歴を取得
  const getPaymentsBySubscription = useCallback(
    (subscriptionId: string): PaymentHistory[] => {
      return history.filter((p) => p.subscriptionId === subscriptionId);
    },
    [history]
  );

  // 月別の支払い履歴を取得
  const getMonthlyPayments = useCallback((): MonthlyPaymentData[] => {
    return groupPaymentsByMonth(history);
  }, [history]);

  // 年別の支払い履歴を取得
  const getYearlyPayments = useCallback((): YearlyPaymentData[] => {
    return groupPaymentsByYear(history);
  }, [history]);

  // 支払い統計を取得
  const getStats = useCallback((): PaymentHistoryStats => {
    return calculatePaymentStats(history);
  }, [history]);

  // 日付範囲で支払い履歴をフィルター
  const getPaymentsByDateRange = useCallback(
    (startDate: string, endDate: string): PaymentHistory[] => {
      return history.filter(
        (p) => p.paymentDate >= startDate && p.paymentDate <= endDate
      );
    },
    [history]
  );

  return {
    history,
    loading,
    addPayment,
    updatePayment,
    deletePayment,
    getPaymentsBySubscription,
    getMonthlyPayments,
    getYearlyPayments,
    getStats,
    getPaymentsByDateRange,
    reload: loadHistory,
  };
}
