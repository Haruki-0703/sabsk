import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CloudUser {
  id: string;
  email: string;
  name?: string;
  provider: 'google' | 'apple' | 'local';
  lastSyncTime?: string;
}

const CLOUD_USER_KEY = '@subsk_cloud_user';
const CLOUD_TOKEN_KEY = '@subsk_cloud_token';

export function useCloudAuth() {
  const [user, setUser] = useState<CloudUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ローカルユーザーでログイン（オフラインモード）
  const loginLocal = useCallback(async (email: string, name?: string) => {
    try {
      setLoading(true);
      const localUser: CloudUser = {
        id: `local_${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        provider: 'local',
      };
      
      await AsyncStorage.setItem(CLOUD_USER_KEY, JSON.stringify(localUser));
      setUser(localUser);
      setError(null);
      return localUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Google でログイン（スタブ実装）
  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      // 実装時にはGoogle Sign-In SDKを使用
      const googleUser: CloudUser = {
        id: `google_${Date.now()}`,
        email: 'user@gmail.com', // 実装時は実際のメールアドレスを使用
        provider: 'google',
      };
      
      await AsyncStorage.setItem(CLOUD_USER_KEY, JSON.stringify(googleUser));
      setUser(googleUser);
      setError(null);
      return googleUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Apple でログイン（スタブ実装）
  const loginWithApple = useCallback(async () => {
    try {
      setLoading(true);
      // 実装時にはApple Sign-In SDKを使用
      const appleUser: CloudUser = {
        id: `apple_${Date.now()}`,
        email: 'user@icloud.com', // 実装時は実際のメールアドレスを使用
        provider: 'apple',
      };
      
      await AsyncStorage.setItem(CLOUD_USER_KEY, JSON.stringify(appleUser));
      setUser(appleUser);
      setError(null);
      return appleUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Apple login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ログアウト
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem(CLOUD_USER_KEY);
      await AsyncStorage.removeItem(CLOUD_TOKEN_KEY);
      setUser(null);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 保存されたユーザーを読み込む
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem(CLOUD_USER_KEY);
      if (userData) {
        const parsedUser = JSON.parse(userData) as CloudUser;
        setUser(parsedUser);
      }
    } catch (err) {
      console.error('Failed to load user:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 最終同期時刻を更新
  const updateLastSyncTime = useCallback(async () => {
    if (!user) return;

    try {
      const updatedUser: CloudUser = {
        ...user,
        lastSyncTime: new Date().toISOString(),
      };
      await AsyncStorage.setItem(CLOUD_USER_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error('Failed to update sync time:', err);
    }
  }, [user]);

  return {
    user,
    loading,
    error,
    loginLocal,
    loginWithGoogle,
    loginWithApple,
    logout,
    loadUser,
    updateLastSyncTime,
    isAuthenticated: !!user,
  };
}
