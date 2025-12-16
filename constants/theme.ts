/**
 * SubscK - サブスク管理アプリ テーマ設定
 * Apple Human Interface Guidelinesに準拠したカラーパレット
 */

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#000000",
    textSecondary: "#8E8E93",
    background: "#F2F2F7",
    cardBackground: "#FFFFFF",
    tint: "#007AFF",
    icon: "#8E8E93",
    tabIconDefault: "#8E8E93",
    tabIconSelected: "#007AFF",
    destructive: "#FF3B30",
    success: "#34C759",
    border: "#C6C6C8",
  },
  dark: {
    text: "#FFFFFF",
    textSecondary: "#8E8E93",
    background: "#000000",
    cardBackground: "#1C1C1E",
    tint: "#0A84FF",
    icon: "#8E8E93",
    tabIconDefault: "#8E8E93",
    tabIconSelected: "#0A84FF",
    destructive: "#FF453A",
    success: "#30D158",
    border: "#38383A",
  },
};

// カテゴリカラー
export const CategoryColors: Record<string, string> = {
  entertainment: "#FF9500",
  music: "#AF52DE",
  video: "#FF2D55",
  productivity: "#007AFF",
  cloud: "#5AC8FA",
  gaming: "#34C759",
  news: "#FF3B30",
  fitness: "#FF9500",
  other: "#8E8E93",
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// スペーシング
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// ボーダー半径
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
