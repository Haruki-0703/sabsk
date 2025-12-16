# SubscK - サブスク管理アプリ デザインドキュメント

## バージョン: v1.0.0

## アプリ概要
**コア価値**: 「毎月いくら払っているか」を一瞬で把握し、解約忘れを防ぐ。

## デザインの方向性
Apple純正アプリのような、余白多めで清潔感のあるデザイン。iOS Human Interface Guidelinesに準拠。

---

## Screen List（画面一覧）

### 1. ホーム画面（Home）
- **役割**: 月額合計金額の表示、サブスク一覧のサマリー
- **主要コンテンツ**:
  - 月額合計金額（大きく目立つ表示）
  - 今月の支払い予定
  - サブスク一覧（カードリスト形式）
  - 追加ボタン（FAB）

### 2. サブスク追加/編集画面（Add/Edit）
- **役割**: 新規サブスク登録、既存サブスクの編集
- **主要コンテンツ**:
  - サービス名入力
  - 金額入力
  - 請求サイクル選択（月額/年額）
  - 次回請求日
  - カテゴリ選択
  - メモ欄

### 3. 詳細画面（Detail）
- **役割**: サブスクの詳細情報表示
- **主要コンテンツ**:
  - サービス情報
  - 支払い履歴
  - 編集/削除ボタン

### 4. 設定画面（Settings）
- **役割**: アプリ設定、通知設定
- **主要コンテンツ**:
  - 通知設定
  - 通貨設定
  - データエクスポート
  - アプリ情報

---

## Primary Content and Functionality

### ホーム画面の機能
1. **月額合計表示**: 全サブスクの月額換算合計を大きく表示
2. **サブスクリスト**: 登録済みサブスクをカード形式で一覧表示
3. **クイック追加**: フローティングボタンで素早く追加
4. **フィルター**: カテゴリ別絞り込み

### データモデル
```typescript
interface Subscription {
  id: string;
  name: string;           // サービス名
  amount: number;         // 金額
  currency: string;       // 通貨（JPY）
  cycle: 'monthly' | 'yearly' | 'weekly';  // 請求サイクル
  nextBillingDate: Date;  // 次回請求日
  category: string;       // カテゴリ
  note?: string;          // メモ
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Key User Flows

### フロー1: サブスク追加
1. ホーム画面で「+」ボタンをタップ
2. 追加画面が開く（モーダル）
3. サービス名を入力
4. 金額を入力
5. 請求サイクルを選択
6. 次回請求日を設定
7. 「保存」をタップ
8. ホーム画面に戻り、リストに追加される

### フロー2: サブスク編集
1. ホーム画面でサブスクカードをタップ
2. 詳細画面が開く
3. 「編集」ボタンをタップ
4. 編集画面で情報を変更
5. 「保存」をタップ
6. 詳細画面に戻る

### フロー3: サブスク削除
1. 詳細画面で「削除」ボタンをタップ
2. 確認ダイアログ表示
3. 「削除」を確認
4. ホーム画面に戻る

---

## Color Choices

### ライトモード
- **Primary Accent**: `#007AFF` (iOS Blue) - メインアクション、リンク
- **Background**: `#F2F2F7` (iOS System Gray 6) - 画面背景
- **Card Background**: `#FFFFFF` - カード背景
- **Text Primary**: `#000000` - メインテキスト
- **Text Secondary**: `#8E8E93` (iOS System Gray) - サブテキスト
- **Destructive**: `#FF3B30` (iOS Red) - 削除アクション
- **Success**: `#34C759` (iOS Green) - 成功状態

### ダークモード
- **Primary Accent**: `#0A84FF` (iOS Blue Dark) - メインアクション
- **Background**: `#000000` - 画面背景
- **Card Background**: `#1C1C1E` - カード背景
- **Text Primary**: `#FFFFFF` - メインテキスト
- **Text Secondary**: `#8E8E93` - サブテキスト
- **Destructive**: `#FF453A` - 削除アクション
- **Success**: `#30D158` - 成功状態

### カテゴリカラー
- Entertainment: `#FF9500` (Orange)
- Music: `#AF52DE` (Purple)
- Video: `#FF2D55` (Pink)
- Productivity: `#007AFF` (Blue)
- Cloud: `#5AC8FA` (Light Blue)
- Other: `#8E8E93` (Gray)

---

## Typography

- **Title (Large)**: 32pt, Bold - 月額合計金額
- **Title**: 28pt, Bold - 画面タイトル
- **Headline**: 20pt, Semibold - セクションヘッダー
- **Body**: 17pt, Regular - 本文
- **Subhead**: 15pt, Regular - サブテキスト
- **Caption**: 13pt, Regular - 補足情報

---

## Spacing & Layout

- **Grid**: 8pt基準
- **Screen Padding**: 16pt
- **Card Padding**: 16pt
- **Card Radius**: 12pt
- **Button Radius**: 10pt
- **Card Gap**: 12pt
- **Touch Target**: 最小44pt

---

## Navigation Structure

```
Tab Bar (Bottom)
├── Home (house.fill)
│   ├── Add Modal
│   └── Detail Screen
│       └── Edit Modal
└── Settings (gearshape.fill)
```

---

## Component Specifications

### サブスクカード
- 高さ: 80pt
- 左側: サービスアイコン/カテゴリカラー
- 中央: サービス名、次回請求日
- 右側: 金額表示

### 月額合計カード
- 大きな金額表示（32pt Bold）
- サブタイトル「月額合計」
- 背景: グラデーションまたはアクセントカラー

### 追加ボタン（FAB）
- サイズ: 56pt
- 位置: 右下（Safe Area考慮）
- アイコン: plus
- シャドウ付き
