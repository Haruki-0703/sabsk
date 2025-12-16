export type BillingCycle = 'monthly' | 'yearly' | 'weekly';

export type Category = 
  | 'entertainment'
  | 'music'
  | 'video'
  | 'productivity'
  | 'cloud'
  | 'gaming'
  | 'news'
  | 'fitness'
  | 'other';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  cycle: BillingCycle;
  nextBillingDate: string; // ISO date string
  category: Category;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  entertainment: 'エンタメ',
  music: '音楽',
  video: '動画',
  productivity: '仕事効率化',
  cloud: 'クラウド',
  gaming: 'ゲーム',
  news: 'ニュース',
  fitness: 'フィットネス',
  other: 'その他',
};

export const CYCLE_LABELS: Record<BillingCycle, string> = {
  monthly: '月額',
  yearly: '年額',
  weekly: '週額',
};

// 月額換算のヘルパー関数
export function toMonthlyAmount(amount: number, cycle: BillingCycle): number {
  switch (cycle) {
    case 'weekly':
      return amount * 4.33; // 平均週数
    case 'yearly':
      return amount / 12;
    case 'monthly':
    default:
      return amount;
  }
}

// 金額フォーマット
export function formatCurrency(amount: number, currency: string = 'JPY'): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

// 日付フォーマット
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// UUID生成
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
