/**
 * サブスクリプションサービスのアイコン取得ユーティリティ
 * Clearbit APIを使用して企業ロゴを取得
 */

export interface IconOptions {
  size?: number;
  format?: "png" | "jpg";
}

/**
 * サービス名からアイコンURLを生成（Clearbit API）
 * @param serviceName サービス名（例：Netflix）
 * @param options オプション
 * @returns アイコンURL
 */
export function getClearbitIconUrl(
  serviceName: string,
  options: IconOptions = {}
): string {
  const { size = 128, format = "png" } = options;
  const domain = serviceName.toLowerCase().replace(/\s+/g, "");
  return `https://logo.clearbit.com/${domain}.com?size=${size}&format=${format}`;
}

/**
 * ローカルで定義されたアイコンマッピング
 * Clearbit APIが失敗した場合のフォールバック
 */
export const LOCAL_ICON_MAP: Record<string, string> = {
  netflix: "N",
  spotify: "S",
  "apple-music": "A",
  "amazon-music": "A",
  "youtube-premium": "Y",
  "google-one": "G",
  "icloud-plus": "I",
  dropbox: "D",
  notion: "N",
  slack: "S",
  zoom: "Z",
  figma: "F",
  canva: "C",
  "ps-plus": "P",
  "xbox-gamepass": "X",
  "nintendo-online": "N",
  hulu: "H",
  "disney-plus": "D",
  "u-next": "U",
  abema: "A",
  dazn: "D",
  "amazon-prime-video": "A",
  "line-music": "L",
  awa: "A",
  "rakuten-music": "R",
  "audible": "A",
  "kindle-unlimited": "K",
  "nikkei": "N",
  "newspicks": "N",
  "note": "N",
  "apple-fitness": "A",
  "lean-body": "L",
  "soelu": "S",
  "evernote": "E",
  "adobe-creative-cloud": "A",
  "chatgpt-plus": "C",
  "github-copilot": "G",
  "wantedly": "W",
  "tver": "T",
};

/**
 * サービスIDからアイコン文字を取得
 * @param serviceId サービスID
 * @returns アイコン文字
 */
export function getIconChar(serviceId: string): string {
  return LOCAL_ICON_MAP[serviceId] || "?";
}

/**
 * URLからアイコン画像を取得（キャッシング機能付き）
 */
const iconCache = new Map<string, string>();

export async function fetchIconUrl(
  serviceName: string,
  serviceId?: string
): Promise<string | null> {
  try {
    const cacheKey = serviceId || serviceName;

    // キャッシュをチェック
    if (iconCache.has(cacheKey)) {
      return iconCache.get(cacheKey) || null;
    }

    // Clearbit APIからアイコンを取得
    const url = getClearbitIconUrl(serviceName);

    // URLの有効性を確認（HEADリクエスト）
    const response = await fetch(url, { method: "HEAD" });

    if (response.ok) {
      iconCache.set(cacheKey, url);
      return url;
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch icon for ${serviceName}:`, error);
    return null;
  }
}

/**
 * 複数のサービスのアイコンを一括取得
 */
export async function fetchMultipleIcons(
  services: Array<{ name: string; id?: string }>
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();

  const promises = services.map(async (service) => {
    const icon = await fetchIconUrl(service.name, service.id);
    results.set(service.id || service.name, icon);
  });

  await Promise.all(promises);
  return results;
}
