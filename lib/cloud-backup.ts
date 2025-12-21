import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subscription } from '@/types/subscription';
import { PaymentHistory } from '@/types/payment-history';

export interface CloudBackupData {
  version: string;
  timestamp: string;
  subscriptions: Subscription[];
  paymentHistory: PaymentHistory[];
}

const BACKUP_METADATA_KEY = '@subsk_backup_metadata';

/**
 * ローカルデータをバックアップデータとしてエクスポート
 */
export async function exportBackupData(
  subscriptions: Subscription[],
  paymentHistory: PaymentHistory[]
): Promise<CloudBackupData> {
  return {
    version: '1.5.0',
    timestamp: new Date().toISOString(),
    subscriptions,
    paymentHistory,
  };
}

/**
 * バックアップデータをローカルにインポート
 */
export async function importBackupData(backupData: CloudBackupData): Promise<void> {
  try {
    // 既存データをバックアップ
    const existingSubscriptions = await AsyncStorage.getItem('subscriptions');
    const existingPaymentHistory = await AsyncStorage.getItem('@subsk_payment_history');
    
    if (existingSubscriptions) {
      await AsyncStorage.setItem(
        '@subsk_backup_previous_subscriptions',
        existingSubscriptions
      );
    }
    if (existingPaymentHistory) {
      await AsyncStorage.setItem(
        '@subsk_backup_previous_payment_history',
        existingPaymentHistory
      );
    }

    // 新しいデータをインポート
    await AsyncStorage.setItem('subscriptions', JSON.stringify(backupData.subscriptions));
    await AsyncStorage.setItem(
      '@subsk_payment_history',
      JSON.stringify(backupData.paymentHistory)
    );

    // メタデータを保存
    await AsyncStorage.setItem(
      BACKUP_METADATA_KEY,
      JSON.stringify({
        lastImportTime: new Date().toISOString(),
        lastImportVersion: backupData.version,
      })
    );
  } catch (error) {
    console.error('Failed to import backup data:', error);
    throw error;
  }
}

/**
 * バックアップメタデータを取得
 */
export async function getBackupMetadata() {
  try {
    const data = await AsyncStorage.getItem(BACKUP_METADATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get backup metadata:', error);
    return null;
  }
}

/**
 * 前回のバックアップをリストア
 */
export async function restorePreviousBackup(): Promise<void> {
  try {
    const previousSubscriptions = await AsyncStorage.getItem(
      '@subsk_backup_previous_subscriptions'
    );
    const previousPaymentHistory = await AsyncStorage.getItem(
      '@subsk_backup_previous_payment_history'
    );

    if (previousSubscriptions) {
      await AsyncStorage.setItem('subscriptions', previousSubscriptions);
    }
    if (previousPaymentHistory) {
      await AsyncStorage.setItem('@subsk_payment_history', previousPaymentHistory);
    }
  } catch (error) {
    console.error('Failed to restore previous backup:', error);
    throw error;
  }
}

/**
 * JSONファイルとしてバックアップデータを生成
 */
export function generateBackupJSON(backupData: CloudBackupData): string {
  return JSON.stringify(backupData, null, 2);
}

/**
 * JSONからバックアップデータをパース
 */
export function parseBackupJSON(jsonString: string): CloudBackupData {
  try {
    const data = JSON.parse(jsonString);
    
    // バージョンチェック
    if (!data.version || !data.timestamp) {
      throw new Error('Invalid backup format');
    }

    return data as CloudBackupData;
  } catch (error) {
    console.error('Failed to parse backup JSON:', error);
    throw new Error('Invalid backup file');
  }
}
