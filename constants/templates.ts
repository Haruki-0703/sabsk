import { Category, BillingCycle } from "@/types/subscription";

export interface SubscriptionTemplate {
  id: string;
  name: string;
  category: Category;
  amount: number;
  cycle: BillingCycle;
  description: string;
  popular: boolean; // 人気度（ホーム画面に表示するかどうか）
}

export const SUBSCRIPTION_TEMPLATES: SubscriptionTemplate[] = [
  // 動画配信
  {
    id: "netflix",
    name: "Netflix",
    category: "video",
    amount: 1490,
    cycle: "monthly",
    description: "動画配信サービス",
    popular: true,
  },
  {
    id: "amazon-prime",
    name: "Amazon Prime Video",
    category: "video",
    amount: 600,
    cycle: "monthly",
    description: "Amazonプライム会員特典",
    popular: true,
  },
  {
    id: "hulu",
    name: "Hulu",
    category: "video",
    amount: 1026,
    cycle: "monthly",
    description: "動画配信サービス",
    popular: true,
  },
  {
    id: "disney-plus",
    name: "Disney+",
    category: "video",
    amount: 990,
    cycle: "monthly",
    description: "ディズニー公式動画配信",
    popular: false,
  },
  {
    id: "u-next",
    name: "U-NEXT",
    category: "video",
    amount: 2189,
    cycle: "monthly",
    description: "日本最大級の動画配信",
    popular: false,
  },
  {
    id: "abema",
    name: "ABEMA",
    category: "video",
    amount: 960,
    cycle: "monthly",
    description: "テレビ・ドラマ・アニメ配信",
    popular: false,
  },
  {
    id: "dazn",
    name: "DAZN",
    category: "video",
    amount: 3700,
    cycle: "monthly",
    description: "スポーツ配信サービス",
    popular: false,
  },
  {
    id: "apple-tv",
    name: "Apple TV+",
    category: "video",
    amount: 900,
    cycle: "monthly",
    description: "Apple公式動画配信",
    popular: false,
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    category: "video",
    amount: 1180,
    cycle: "monthly",
    description: "広告なし・オフライン再生",
    popular: true,
  },

  // 音楽
  {
    id: "spotify",
    name: "Spotify",
    category: "music",
    amount: 980,
    cycle: "monthly",
    description: "音楽ストリーミング",
    popular: true,
  },
  {
    id: "apple-music",
    name: "Apple Music",
    category: "music",
    amount: 1080,
    cycle: "monthly",
    description: "Apple公式音楽配信",
    popular: true,
  },
  {
    id: "amazon-music",
    name: "Amazon Music Unlimited",
    category: "music",
    amount: 980,
    cycle: "monthly",
    description: "Amazon音楽配信",
    popular: false,
  },
  {
    id: "line-music",
    name: "LINE MUSIC",
    category: "music",
    amount: 980,
    cycle: "monthly",
    description: "LINE公式音楽配信",
    popular: false,
  },
  {
    id: "awa",
    name: "AWA",
    category: "music",
    amount: 980,
    cycle: "monthly",
    description: "日本の音楽配信",
    popular: false,
  },

  // クラウドストレージ
  {
    id: "icloud-plus",
    name: "iCloud+",
    category: "cloud",
    amount: 130,
    cycle: "monthly",
    description: "Apple公式クラウド（50GB）",
    popular: true,
  },
  {
    id: "google-one",
    name: "Google One",
    category: "cloud",
    amount: 100,
    cycle: "monthly",
    description: "Google公式クラウド（100GB）",
    popular: true,
  },
  {
    id: "dropbox",
    name: "Dropbox Plus",
    category: "cloud",
    amount: 1200,
    cycle: "monthly",
    description: "クラウドストレージ（2TB）",
    popular: false,
  },
  {
    id: "onedrive",
    name: "Microsoft 365",
    category: "cloud",
    amount: 1284,
    cycle: "monthly",
    description: "Office + OneDrive（1TB）",
    popular: false,
  },

  // 仕事効率化
  {
    id: "notion",
    name: "Notion Plus",
    category: "productivity",
    amount: 1000,
    cycle: "monthly",
    description: "ノート・データベース",
    popular: true,
  },
  {
    id: "evernote",
    name: "Evernote Premium",
    category: "productivity",
    amount: 1100,
    cycle: "monthly",
    description: "ノートアプリ",
    popular: false,
  },
  {
    id: "slack",
    name: "Slack Pro",
    category: "productivity",
    amount: 1050,
    cycle: "monthly",
    description: "チームコミュニケーション",
    popular: false,
  },
  {
    id: "zoom",
    name: "Zoom Pro",
    category: "productivity",
    amount: 2699,
    cycle: "monthly",
    description: "ビデオ会議（無制限）",
    popular: false,
  },
  {
    id: "figma",
    name: "Figma Pro",
    category: "productivity",
    amount: 1200,
    cycle: "monthly",
    description: "デザインツール",
    popular: false,
  },
  {
    id: "canva",
    name: "Canva Pro",
    category: "productivity",
    amount: 1500,
    cycle: "monthly",
    description: "デザイン・グラフィック",
    popular: true,
  },
  {
    id: "adobe",
    name: "Adobe Creative Cloud",
    category: "productivity",
    amount: 6248,
    cycle: "monthly",
    description: "Photoshop・Illustrator等",
    popular: false,
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "productivity",
    amount: 1000,
    cycle: "monthly",
    description: "AI コーディング支援",
    popular: false,
  },
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    category: "productivity",
    amount: 2000,
    cycle: "monthly",
    description: "ChatGPT 高速・優先",
    popular: true,
  },

  // ゲーム
  {
    id: "ps-plus",
    name: "PlayStation Plus",
    category: "gaming",
    amount: 850,
    cycle: "monthly",
    description: "PS4/PS5 オンラインプレイ",
    popular: false,
  },
  {
    id: "xbox-gamepass",
    name: "Xbox Game Pass",
    category: "gaming",
    amount: 1100,
    cycle: "monthly",
    description: "Xbox ゲームライブラリ",
    popular: false,
  },
  {
    id: "nintendo-online",
    name: "Nintendo Switch Online",
    category: "gaming",
    amount: 306,
    cycle: "monthly",
    description: "Switch オンラインプレイ",
    popular: false,
  },

  // その他
  {
    id: "nikkei",
    name: "日経電子版",
    category: "other",
    amount: 4900,
    cycle: "monthly",
    description: "ニュース・経済情報",
    popular: false,
  },
  {
    id: "newspicks",
    name: "NewsPicks",
    category: "other",
    amount: 1500,
    cycle: "monthly",
    description: "ビジネスニュース",
    popular: false,
  },
];

/**
 * テンプレートを検索
 */
export function searchTemplates(query: string): SubscriptionTemplate[] {
  const lowerQuery = query.toLowerCase();
  return SUBSCRIPTION_TEMPLATES.filter(
    (template) =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * 人気のテンプレートを取得
 */
export function getPopularTemplates(): SubscriptionTemplate[] {
  return SUBSCRIPTION_TEMPLATES.filter((template) => template.popular);
}

/**
 * カテゴリ別にテンプレートを取得
 */
export function getTemplatesByCategory(category: Category): SubscriptionTemplate[] {
  return SUBSCRIPTION_TEMPLATES.filter((template) => template.category === category);
}
