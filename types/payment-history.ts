/**
 * 支払い履歴の型定義
 */

export interface PaymentHistory {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  paymentDate: string; // ISO 8601形式
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  status: 'paid' | 'pending' | 'failed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentHistoryStats {
  totalPaid: number;
  averageMonthly: number;
  averageYearly: number;
  paymentCount: number;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
}

export interface MonthlyPaymentData {
  month: string; // YYYY-MM形式
  amount: number;
  count: number;
}

export interface YearlyPaymentData {
  year: number;
  amount: number;
  count: number;
}

/**
 * 支払い履歴を月別に集計
 */
export function groupPaymentsByMonth(payments: PaymentHistory[]): MonthlyPaymentData[] {
  const grouped: Record<string, { amount: number; count: number }> = {};

  payments.forEach((payment) => {
    const month = payment.paymentDate.substring(0, 7); // YYYY-MM
    if (!grouped[month]) {
      grouped[month] = { amount: 0, count: 0 };
    }
    grouped[month].amount += payment.amount;
    grouped[month].count += 1;
  });

  return Object.entries(grouped)
    .map(([month, data]) => ({
      month,
      ...data,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * 支払い履歴を年別に集計
 */
export function groupPaymentsByYear(payments: PaymentHistory[]): YearlyPaymentData[] {
  const grouped: Record<number, { amount: number; count: number }> = {};

  payments.forEach((payment) => {
    const year = parseInt(payment.paymentDate.substring(0, 4));
    if (!grouped[year]) {
      grouped[year] = { amount: 0, count: 0 };
    }
    grouped[year].amount += payment.amount;
    grouped[year].count += 1;
  });

  return Object.entries(grouped)
    .map(([year, data]) => ({
      year: parseInt(year),
      ...data,
    }))
    .sort((a, b) => a.year - b.year);
}

/**
 * 支払い履歴の統計情報を計算
 */
export function calculatePaymentStats(payments: PaymentHistory[]): PaymentHistoryStats {
  if (payments.length === 0) {
    return {
      totalPaid: 0,
      averageMonthly: 0,
      averageYearly: 0,
      paymentCount: 0,
    };
  }

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const sortedDates = payments.map((p) => p.paymentDate).sort();
  const lastPaymentDate = sortedDates[sortedDates.length - 1];
  const firstPaymentDate = sortedDates[0];

  // 月数を計算
  const lastDate = new Date(lastPaymentDate);
  const firstDate = new Date(firstPaymentDate);
  const monthsDiff = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 + 
                     (lastDate.getMonth() - firstDate.getMonth());
  const monthsCount = Math.max(1, monthsDiff + 1);

  return {
    totalPaid,
    averageMonthly: totalPaid / monthsCount,
    averageYearly: (totalPaid / monthsCount) * 12,
    paymentCount: payments.length,
    lastPaymentDate,
  };
}
