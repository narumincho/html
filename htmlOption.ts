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
  readonly children: Children;
};

export type Element =
  | Div
  | Anchor
  | Button
  | Img
  | InputRadio
  | InputText
  | TextArea
  | Label
  | Svg
  | SvgPath
  | SvgCircle
  | SvgAnimate;

export type Div = {
  readonly tag: "div";
  readonly id: string;
  readonly class: string;
  readonly children: Children;
};

export type Anchor = {
  readonly tag: "anchor";
  readonly id: string;
  readonly class: string;
  readonly url: string;
  readonly children: Children;
};

export type Button = {
  readonly tag: "button";
  readonly id: string;
  readonly class: string;
  readonly children: Children;
};

export type Img = {
  readonly tag: "img";
  readonly id: string;
  readonly class: string;
  readonly alt: string;
  readonly src: string;
};

export type InputRadio = {
  readonly tag: "inputRadio";
  readonly id: string;
  readonly class: string;
  readonly checked: boolean;
  /** 選択肢の選択を1にする動作のため. どの選択肢に属しているかを指定する */
  readonly name: string;
};

export type InputText = {
  readonly tag: "inputText";
  readonly id: string;
  readonly class: string;
  readonly value: string;
};

export type TextArea = {
  readonly tag: "textArea";
  readonly id: string;
  readonly class: string;
  readonly value: string;
};

export type Label = {
  readonly tag: "label";
  readonly id: string;
  readonly class: string;
  readonly for: string;
  readonly children: Children;
};

export type Svg = {
  readonly tag: "svg";
  readonly id: string;
  readonly class: string;
  readonly viewBoxX: number;
  readonly viewBoxY: number;
  readonly viewBoxWidth: number;
  readonly viewBoxHeight: number;
  readonly children: Children;
};

export type SvgPath = {
  readonly tag: "path";
  readonly id: string;
  readonly class: string;
  readonly d: string;
  readonly fill: string;
};

export type SvgCircle = {
  readonly tag: "circle";
  readonly id: string;
  readonly class: string;
  readonly fill: string;
  readonly stroke: string;
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly children: Children;
};

export type SvgAnimate = {
  readonly tag: "animate";
  readonly attributeName: string;
  readonly dur: number;
  readonly repeatCount: string;
  readonly from: string;
  readonly to: string;
};

export type Path = string & { readonly _path: undefined };

export const rootPath = "" as Path;

export const pathAppendKey = (path: Path, key: string): Path =>
  (path + "/" + key) as Path;

export type ClickMessageData<Message> = {
  ignoreNewTab: boolean;
  stopPropagation: boolean;
  message: Message;
};

export const childrenElementListTag = Symbol("Children - ElementList");
export const childrenTextTag = Symbol("Children - Text");

export const childrenElementList = (
  value: ReadonlyMap<string, Element>
): Children => ({ tag: childrenElementListTag, value });

export const childrenText = (value: string): Children => ({
  tag: childrenTextTag,
  value,
});

export type Children =
  | {
      readonly tag: typeof childrenElementListTag;
      readonly value: ReadonlyMap<string, Element>;
    }
  | {
      readonly tag: typeof childrenTextTag;
      readonly value: string;
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
