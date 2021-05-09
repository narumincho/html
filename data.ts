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
 * ナルミンチョが使う言語
 */
export type Language = "Japanese" | "English" | "Esperanto";

/** Twitter Card。Twitterでシェアしたときの表示をどうするか */
export type TwitterCard = "SummaryCard" | "SummaryCardWithLargeImage";

/** 多くのHTMLElementに指定できる属性 */
export type CommonAttributes = {
  id?: string;
  class?: string;
};

const commonAttributesToMap = (
  attributes: CommonAttributes
): ReadonlyMap<string, string | null> => {
  const attributeMap: Map<string, string | null> = new Map();
  if (attributes.id !== undefined) {
    attributeMap.set("id", attributes.id);
  }
  if (attributes.class !== undefined) {
    attributeMap.set("class", attributes.class);
  }
  return attributeMap;
};

/**
 * ページの見出し
 * ```html
 * <h1></h1>
 * ```
 */
export const h1 = (
  attributes: CommonAttributes,
  children: ReadonlyArray<HtmlElement> | string
): HtmlElement =>
  htmlElement("h1", commonAttributesToMap(attributes), children);

/**
 * 見出し
 * ```html
 * <h2></h2>
 * ```
 */
export const h2 = (
  attributes: CommonAttributes,
  children: ReadonlyArray<HtmlElement> | string
): HtmlElement =>
  htmlElement("h2", commonAttributesToMap(attributes), children);

/**
 * 見出し
 * ```html
 * <h3></h3>
 * ```
 */
export const h3 = (
  attributes: CommonAttributes,
  children: ReadonlyArray<HtmlElement> | string
): HtmlElement =>
  htmlElement("h3", commonAttributesToMap(attributes), children);

/**
 * ```html
 * <div></div>
 * ```
 */
export const div = (
  attributes: CommonAttributes,
  children: ReadonlyArray<HtmlElement> | string
): HtmlElement =>
  htmlElement("div", commonAttributesToMap(attributes), children);

/**
 * ```html
 * <a href={attributes.url}></a>
 * ```
 */
export const anchor = (
  attributes: CommonAttributes & {
    url: URL;
  },
  children: ReadonlyArray<HtmlElement> | string
): HtmlElement =>
  htmlElement(
    "a",
    new Map([
      ...commonAttributesToMap(attributes),
      ["href", attributes.url.toString()],
    ]),
    children
  );

/**
 * ```html
 * <img alt={attributes.alt} src={attributes.src}>
 * ```
 */
export const image = (
  attributes: CommonAttributes & {
    /** 画像のテキストによる説明 */
    alt: string;
    /** 画像のURL. */
    src: URL;
  }
): HtmlElement =>
  htmlElementNoEndTag(
    "img",
    new Map([
      ...commonAttributesToMap(attributes),
      ["alt", attributes.alt],
      ["src", attributes.src.toString()],
    ])
  );

/**
 * ```html
 * <svg></svg>
 * ```
 */
export const svg = (
  attributes: CommonAttributes & {
    viewBox: { x: number; y: number; width: number; height: number };
  },
  children: ReadonlyArray<HtmlElement>
): HtmlElement =>
  htmlElement(
    "svg",
    new Map([
      ...commonAttributesToMap(attributes),
      [
        "viewBox",
        [
          attributes.viewBox.x,
          attributes.viewBox.y,
          attributes.viewBox.width,
          attributes.viewBox.height,
        ].join(" "),
      ],
    ]),
    children
  );

/**
 * ```html
 * <path />
 * ```
 */
export const path = (
  attributes: CommonAttributes & {
    d: string;
    fill: string;
  }
): HtmlElement =>
  htmlElement(
    "path",
    new Map([
      ...commonAttributesToMap(attributes),
      ["d", attributes.d],
      ["fill", attributes.fill],
    ]),
    ""
  );

/** SVGの要素のアニメーションを指定する. 繰り返す回数は無限回と指定している */
type SvgAnimation = {
  attributeName: "cy" | "r" | "stroke";
  /** 時間 */
  dur: number;
  /** 開始時の値 */
  from: number | string;
  /** 終了時の値 */
  to: number | string;
};

/**
 * ```html
 * <circle><circle>
 * ```
 */
export const circle = (
  attributes: CommonAttributes & {
    cx: number;
    cy: number;
    fill: string;
    r: number;
    stroke: string;
    animations?: ReadonlyArray<SvgAnimation>;
  }
): HtmlElement => {
  return htmlElement(
    "circle",
    new Map([
      ...commonAttributesToMap(attributes),
      ["cx", attributes.cx.toString()],
      ["cy", attributes.cy.toString()],
      ["fill", attributes.fill],
      ["r", attributes.r.toString()],
      ["stroke", attributes.stroke],
    ]),
    attributes.animations === undefined
      ? ""
      : attributes.animations.map(animate)
  );
};

/**
 * ```html
 * <animate />
 * ```
 */
const animate = (svgAnimation: SvgAnimation): HtmlElement =>
  htmlElement(
    "animate",
    new Map([
      ["attributeName", svgAnimation.attributeName],
      ["dur", svgAnimation.dur.toString()],
      ["from", svgAnimation.from.toString()],
      ["repeatCount", "indefinite"],
      ["to", svgAnimation.to.toString()],
    ]),
    ""
  );

/**
 * @narumincho/htmlにないHTML要素を使いたいときに使うもの。
 * 低レベルAPI
 * @param name 要素名
 * @param attributes 属性
 * @param children 子要素
 */
export const htmlElement = (
  name: string,
  attributes: ReadonlyMap<string, string | null>,
  children: ReadonlyArray<HtmlElement> | string
): HtmlElement => ({
  name,
  attributes,
  children:
    typeof children === "string"
      ? { tag: "Text", text: children }
      : { tag: "HtmlElementList", value: children },
});

/**
 * エスケープしないカスタマイズ要素。低レベルAPI
 * ```html
 * <script type="x-shader/x-vertex">
 * attribute vec3 position;
 * uniform   mat4 mvpMatrix;
 *
 * void main(void) {
 *     gl_Position = mvpMatrix * vec4(position, 1.0);
 * }
 * </script>
 * ```
 * @param name 要素名
 * @param attributes 属性
 * @param text エスケープしないテキスト
 */
export const htmlElementRawText = (
  name: string,
  attributes: ReadonlyMap<string, string | null>,
  text: string
): HtmlElement => ({
  name,
  attributes,
  children: {
    tag: "RawText",
    text,
  },
});

/**
 * 閉じタグがないカスタマイズ要素。低レベルAPI
 * `<meta name="rafya">`
 * @param name 要素名
 * @param attributes 属性
 */
export const htmlElementNoEndTag = (
  name: string,
  attributes: ReadonlyMap<string, string | null>
): HtmlElement => ({
  name,
  attributes,
  children: {
    tag: "NoEndTag",
  },
});

/**
 * HtmlElement
 */
export type HtmlElement = {
  /**
   * 要素名 `h1` や `div` など
   */
  readonly name: string;
  /**
   * 属性名は正しい必要がある。
   * value=nullの意味は、属性値がないということ。
   * `<button disabled>`
   */
  readonly attributes: ReadonlyMap<string, string | null>;
  /**
   * 子の要素
   * `<path d="M1,2 L20,53"/>`のような閉じカッコの省略はしない
   */
  readonly children: HtmlChildren;
};

/**
 * 子要素のパターン。パターンマッチングのみに使う
 */
export type HtmlChildren =
  | {
      readonly tag: "HtmlElementList";
      readonly value: ReadonlyArray<HtmlElement>;
    }
  | {
      readonly tag: "Text";
      readonly text: string;
    }
  | {
      readonly tag: "RawText";
      readonly text: string;
    }
  | {
      readonly tag: "NoEndTag";
    };
