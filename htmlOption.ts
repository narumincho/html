import { HtmlElement } from "./toString";

export type htmlOption = {
  /**
   * ページ名
   *
   * Google 検索のページ名や, タブ, ブックマークのタイトル, OGPのタイトルなどに使用される
   */
  readonly pageName: string;

  /**
   * アプリ名 / サイト名 (HTML出力のみ反映)
   */
  readonly appName: string;

  /**
   * ページの説明 (HTML出力のみ反映)
   */
  readonly description: string;

  /**
   * テーマカラー
   */
  readonly themeColor: Color | undefined;

  /**
   * アイコン画像のURL
   */
  readonly iconUrl: URL;

  /**
   * 使用している言語
   */
  readonly language: Language | undefined;

  /**
   * OGPに使われるカバー画像のURL (CORSの制限を受けない)
   */
  readonly coverImageUrl: URL;

  /** ページのURL */
  readonly url: URL;

  /** Twitter Card。Twitterでシェアしたときの表示をどうするか */
  readonly twitterCard: TwitterCard;

  /** 全体に適応されるスタイル. CSS */
  readonly style?: string;

  /** スタイルのURL */
  readonly styleUrlList?: ReadonlyArray<URL>;

  /** ES Modules形式のJavaScript */
  readonly script?: string;

  /** スクリプトのURL */
  readonly scriptUrlList?: ReadonlyArray<URL>;

  /** body の class */
  readonly bodyClass?: string;

  /** body の 子要素 */
  readonly children: ReadonlyArray<HtmlElement>;
};

/** 色を表現する rgbは 0...1 の範囲でなければならない */
export type Color = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
};

/**
 * 色を色コードに変換する
 * ```ts
 * { r: 1, g: 1, b: 1 }
 * ```
 * ↓
 * ```ts
 * "#ffffff"
 * ```
 */
export const colorToHexString = (color: Color): string =>
  "#" +
  numberTo1byteString(color.r) +
  numberTo1byteString(color.g) +
  numberTo1byteString(color.b);

/**
 * 0...1 を 00...ff に変換する
 */
const numberTo1byteString = (value: number): string =>
  Math.max(Math.min(Math.floor(value * 256), 255), 0)
    .toString(16)
    .padStart(2, "0");

/**
 * ナルミンチョが使う言語
 */
export type Language = "Japanese" | "English" | "Esperanto";

/** Twitter Card。Twitterでシェアしたときの表示をどうするか */
export type TwitterCard = "SummaryCard" | "SummaryCardWithLargeImage";
