import { Category, BillingCycle } from "@/types/subscription";

export interface JapaneseSubscription {
  id: string;
  name: string;
  category: Category;
  defaultAmount: number;
  currency: string;
  cycle: BillingCycle;
  description: string;
  website?: string;
  logoUrl?: string;
}

/**
 * 日本で使われている主要なサブスクリプションサービス
 * 価格は2024年12月時点の情報
 */
export const JAPANESE_SUBSCRIPTIONS: JapaneseSubscription[] = [
  // 動画配信
  {
    id: "netflix",
    name: "Netflix",
    category: "video",
    defaultAmount: 1490,
    currency: "JPY",
    cycle: "monthly",
    description: "動画配信サービス",
    website: "netflix.com",
  },
  {
    id: "amazon-prime-video",
    name: "Amazon Prime Video",
    category: "video",
    defaultAmount: 600,
    currency: "JPY",
    cycle: "monthly",
    description: "Amazonプライム会員特典",
    website: "amazon.co.jp",
  },
  {
    id: "hulu",
    name: "Hulu",
    category: "video",
    defaultAmount: 1026,
    currency: "JPY",
    cycle: "monthly",
    description: "動画配信サービス",
    website: "hulu.jp",
  },
  {
    id: "disney-plus",
    name: "Disney+",
    category: "video",
    defaultAmount: 990,
    currency: "JPY",
    cycle: "monthly",
    description: "ディズニー公式動画配信",
    website: "disneyplus.disney.co.jp",
  },
  {
    id: "u-next",
    name: "U-NEXT",
    category: "video",
    defaultAmount: 2189,
    currency: "JPY",
    cycle: "monthly",
    description: "日本最大級の動画配信",
    website: "unext.jp",
  },
  {
    id: "abema",
    name: "ABEMA",
    category: "video",
    defaultAmount: 960,
    currency: "JPY",
    cycle: "monthly",
    description: "テレビ・ドラマ・アニメ配信",
    website: "abema.tv",
  },
  {
    id: "dazn",
    name: "DAZN",
    category: "video",
    defaultAmount: 3700,
    currency: "JPY",
    cycle: "monthly",
    description: "スポーツ配信サービス",
    website: "dazn.com",
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    category: "video",
    defaultAmount: 1180,
    currency: "JPY",
    cycle: "monthly",
    description: "広告なし・オフライン再生",
    website: "youtube.com",
  },
  {
    id: "tver",
    name: "TVer",
    category: "video",
    defaultAmount: 0,
    currency: "JPY",
    cycle: "monthly",
    description: "民放公式テレビ配信（無料）",
    website: "tver.jp",
  },

  // 音楽
  {
    id: "spotify",
    name: "Spotify",
    category: "music",
    defaultAmount: 980,
    currency: "JPY",
    cycle: "monthly",
    description: "音楽ストリーミング",
    website: "spotify.com",
  },
  {
    id: "apple-music",
    name: "Apple Music",
    category: "music",
    defaultAmount: 1080,
    currency: "JPY",
    cycle: "monthly",
    description: "Apple公式音楽配信",
    website: "music.apple.com",
  },
  {
    id: "amazon-music",
    name: "Amazon Music Unlimited",
    category: "music",
    defaultAmount: 980,
    currency: "JPY",
    cycle: "monthly",
    description: "Amazon音楽配信",
    website: "amazon.co.jp",
  },
  {
    id: "line-music",
    name: "LINE MUSIC",
    category: "music",
    defaultAmount: 980,
    currency: "JPY",
    cycle: "monthly",
    description: "LINE公式音楽配信",
    website: "music.line.me",
  },
  {
    id: "awa",
    name: "AWA",
    category: "music",
    defaultAmount: 980,
    currency: "JPY",
    cycle: "monthly",
    description: "日本の音楽配信",
    website: "awa.fm",
  },
  {
    id: "rakuten-music",
    name: "Rakuten Music",
    category: "music",
    defaultAmount: 980,
    currency: "JPY",
    cycle: "monthly",
    description: "楽天の音楽配信",
    website: "music.rakuten.co.jp",
  },

  // クラウドストレージ
  {
    id: "icloud-plus",
    name: "iCloud+",
    category: "cloud",
    defaultAmount: 130,
    currency: "JPY",
    cycle: "monthly",
    description: "Apple公式クラウド（50GB）",
    website: "icloud.com",
  },
  {
    id: "google-one",
    name: "Google One",
    category: "cloud",
    defaultAmount: 100,
    currency: "JPY",
    cycle: "monthly",
    description: "Google公式クラウド（100GB）",
    website: "one.google.com",
  },
  {
    id: "dropbox",
    name: "Dropbox Plus",
    category: "cloud",
    defaultAmount: 1200,
    currency: "JPY",
    cycle: "monthly",
    description: "クラウドストレージ（2TB）",
    website: "dropbox.com",
  },
  {
    id: "onedrive",
    name: "Microsoft 365",
    category: "cloud",
    defaultAmount: 1284,
    currency: "JPY",
    cycle: "monthly",
    description: "Office + OneDrive（1TB）",
    website: "microsoft.com",
  },

  // 仕事効率化
  {
    id: "notion",
    name: "Notion Plus",
    category: "productivity",
    defaultAmount: 1000,
    currency: "JPY",
    cycle: "monthly",
    description: "ノート・データベース",
    website: "notion.so",
  },
  {
    id: "evernote",
    name: "Evernote Premium",
    category: "productivity",
    defaultAmount: 1100,
    currency: "JPY",
    cycle: "monthly",
    description: "ノートアプリ",
    website: "evernote.com",
  },
  {
    id: "slack",
    name: "Slack Pro",
    category: "productivity",
    defaultAmount: 1050,
    currency: "JPY",
    cycle: "monthly",
    description: "チームコミュニケーション",
    website: "slack.com",
  },
  {
    id: "zoom",
    name: "Zoom Pro",
    category: "productivity",
    defaultAmount: 2699,
    currency: "JPY",
    cycle: "monthly",
    description: "ビデオ会議（無制限）",
    website: "zoom.us",
  },
  {
    id: "figma",
    name: "Figma Pro",
    category: "productivity",
    defaultAmount: 1200,
    currency: "JPY",
    cycle: "monthly",
    description: "デザインツール",
    website: "figma.com",
  },
  {
    id: "canva",
    name: "Canva Pro",
    category: "productivity",
    defaultAmount: 1500,
    currency: "JPY",
    cycle: "monthly",
    description: "デザイン・グラフィック",
    website: "canva.com",
  },
  {
    id: "adobe-creative-cloud",
    name: "Adobe Creative Cloud",
    category: "productivity",
    defaultAmount: 6248,
    currency: "JPY",
    cycle: "monthly",
    description: "Photoshop・Illustrator等",
    website: "adobe.com",
  },
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    category: "productivity",
    defaultAmount: 2000,
    currency: "JPY",
    cycle: "monthly",
    description: "ChatGPT 高速・優先",
    website: "openai.com",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "productivity",
    defaultAmount: 1000,
    currency: "JPY",
    cycle: "monthly",
    description: "AI コーディング支援",
    website: "github.com",
  },

  // ゲーム
  {
    id: "ps-plus",
    name: "PlayStation Plus",
    category: "gaming",
    defaultAmount: 850,
    currency: "JPY",
    cycle: "monthly",
    description: "PS4/PS5 オンラインプレイ",
    website: "playstation.com",
  },
  {
    id: "xbox-gamepass",
    name: "Xbox Game Pass",
    category: "gaming",
    defaultAmount: 1100,
    currency: "JPY",
    cycle: "monthly",
    description: "Xbox ゲームライブラリ",
    website: "xbox.com",
  },
  {
    id: "nintendo-online",
    name: "Nintendo Switch Online",
    category: "gaming",
    defaultAmount: 306,
    currency: "JPY",
    cycle: "monthly",
    description: "Switch オンラインプレイ",
    website: "nintendo.com",
  },

  // ニュース・情報
  {
    id: "nikkei",
    name: "日経電子版",
    category: "news",
    defaultAmount: 4900,
    currency: "JPY",
    cycle: "monthly",
    description: "ニュース・経済情報",
    website: "nikkei.com",
  },
  {
    id: "newspicks",
    name: "NewsPicks",
    category: "news",
    defaultAmount: 1500,
    currency: "JPY",
    cycle: "monthly",
    description: "ビジネスニュース",
    website: "newspicks.com",
  },
  {
    id: "note",
    name: "note プレミアム",
    category: "news",
    defaultAmount: 500,
    currency: "JPY",
    cycle: "monthly",
    description: "クリエイター支援プラットフォーム",
    website: "note.com",
  },

  // フィットネス
  {
    id: "apple-fitness",
    name: "Apple Fitness+",
    category: "fitness",
    defaultAmount: 980,
    currency: "JPY",
    cycle: "monthly",
    description: "Apple公式フィットネス",
    website: "apple.com",
  },
  {
    id: "lean-body",
    name: "LEAN BODY",
    category: "fitness",
    defaultAmount: 980,
    currency: "JPY",
    cycle: "monthly",
    description: "オンラインフィットネス",
    website: "leanbody.jp",
  },
  {
    id: "soelu",
    name: "SOELU",
    category: "fitness",
    defaultAmount: 3278,
    currency: "JPY",
    cycle: "monthly",
    description: "オンラインヨガ・フィットネス",
    website: "soelu.com",
  },

  // その他
  {
    id: "audible",
    name: "Audible",
    category: "other",
    defaultAmount: 1500,
    currency: "JPY",
    cycle: "monthly",
    description: "オーディオブック",
    website: "audible.co.jp",
  },
  {
    id: "kindle-unlimited",
    name: "Kindle Unlimited",
    category: "other",
    defaultAmount: 980,
    currency: "JPY",
    cycle: "monthly",
    description: "電子書籍読み放題",
    website: "amazon.co.jp",
  },
  {
    id: "wantedly",
    name: "Wantedly",
    category: "other",
    defaultAmount: 3300,
    currency: "JPY",
    cycle: "monthly",
    description: "ビジネスSNS",
    website: "wantedly.com",
  },
];

/**
 * サブスク名から検索
 */
export function searchJapaneseSubscriptions(query: string): JapaneseSubscription[] {
  const lowerQuery = query.toLowerCase();
  return JAPANESE_SUBSCRIPTIONS.filter(
    (sub) =>
      sub.name.toLowerCase().includes(lowerQuery) ||
      sub.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * IDからサブスク情報を取得
 */
export function getJapaneseSubscriptionById(id: string): JapaneseSubscription | undefined {
  return JAPANESE_SUBSCRIPTIONS.find((sub) => sub.id === id);
}

/**
 * カテゴリ別にサブスクを取得
 */
export function getJapaneseSubscriptionsByCategory(
  category: Category
): JapaneseSubscription[] {
  return JAPANESE_SUBSCRIPTIONS.filter((sub) => sub.category === category);
}

/**
 * 人気のサブスク（よく使われているもの）を取得
 */
export function getPopularJapaneseSubscriptions(): JapaneseSubscription[] {
  const popularIds = [
    "netflix",
    "spotify",
    "amazon-prime-video",
    "youtube-premium",
    "icloud-plus",
    "apple-music",
    "hulu",
    "disney-plus",
  ];
  return JAPANESE_SUBSCRIPTIONS.filter((sub) => popularIds.includes(sub.id));
}
