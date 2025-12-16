// サービスロゴのマッピング
// Clearbit Logo APIを使用してファビコンを取得

// 既知のサービスとそのドメインのマッピング
const SERVICE_DOMAINS: Record<string, string> = {
  // 動画配信
  netflix: "netflix.com",
  "amazon prime": "amazon.com",
  "amazon prime video": "amazon.com",
  "prime video": "amazon.com",
  hulu: "hulu.com",
  "disney+": "disneyplus.com",
  "disney plus": "disneyplus.com",
  "u-next": "unext.jp",
  unext: "unext.jp",
  abema: "abema.tv",
  "abema tv": "abema.tv",
  dazn: "dazn.com",
  "apple tv+": "apple.com",
  "apple tv": "apple.com",
  youtube: "youtube.com",
  "youtube premium": "youtube.com",
  "youtube music": "youtube.com",
  tver: "tver.jp",
  
  // 音楽
  spotify: "spotify.com",
  "apple music": "apple.com",
  "amazon music": "amazon.com",
  "line music": "music.line.me",
  "awa": "awa.fm",
  
  // クラウドストレージ
  icloud: "apple.com",
  "icloud+": "apple.com",
  "google one": "google.com",
  "google drive": "google.com",
  dropbox: "dropbox.com",
  onedrive: "microsoft.com",
  "microsoft 365": "microsoft.com",
  office365: "microsoft.com",
  
  // 仕事効率化
  notion: "notion.so",
  evernote: "evernote.com",
  slack: "slack.com",
  zoom: "zoom.us",
  figma: "figma.com",
  canva: "canva.com",
  adobe: "adobe.com",
  "adobe creative cloud": "adobe.com",
  github: "github.com",
  chatgpt: "openai.com",
  "chatgpt plus": "openai.com",
  openai: "openai.com",
  
  // ゲーム
  "playstation plus": "playstation.com",
  "ps plus": "playstation.com",
  "xbox game pass": "xbox.com",
  "nintendo switch online": "nintendo.com",
  "nintendo online": "nintendo.com",
  
  // ニュース・メディア
  "nikkei": "nikkei.com",
  "日経電子版": "nikkei.com",
  "newspicks": "newspicks.com",
  
  // フィットネス
  "apple fitness+": "apple.com",
  "apple fitness": "apple.com",
  
  // その他
  amazon: "amazon.com",
  line: "line.me",
  "line スタンプ": "line.me",
};

/**
 * サービス名からロゴURLを取得
 * Clearbit Logo APIを使用
 */
export function getServiceLogoUrl(serviceName: string): string | null {
  const normalizedName = serviceName.toLowerCase().trim();
  
  // 既知のサービスからドメインを検索
  const domain = SERVICE_DOMAINS[normalizedName];
  
  if (domain) {
    // Clearbit Logo API (無料で利用可能)
    return `https://logo.clearbit.com/${domain}`;
  }
  
  // ドメインが見つからない場合は、サービス名をドメインとして試す
  // 例: "Notion" -> "notion.com"
  const guessedDomain = `${normalizedName.replace(/\s+/g, "")}.com`;
  return `https://logo.clearbit.com/${guessedDomain}`;
}

/**
 * サービス名から既知のドメインかどうかを判定
 */
export function isKnownService(serviceName: string): boolean {
  const normalizedName = serviceName.toLowerCase().trim();
  return normalizedName in SERVICE_DOMAINS;
}

/**
 * ロゴURLが有効かどうかをチェック
 */
export async function validateLogoUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}
