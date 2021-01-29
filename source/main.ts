import { Language, TwitterCard } from "./data";

export type Attributes = {
  id?: string;
  class?: string;
};

const attributesToMap = (
  attributes: Attributes
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
 * 意味の持たないまとまり
 */
export const div = (
  attributes: Attributes,
  children: ReadonlyArray<RawElement> | string
): RawElement => element("div", attributesToMap(attributes), children);

/**
 * リンク
 */
export const anchorLink = (
  attributes: Attributes & { url: URL },
  children: ReadonlyArray<RawElement> | string
): RawElement =>
  element(
    "a",
    new Map([
      ...attributesToMap(attributes),
      ["href", attributes.url.toString()],
    ]),
    children
  );

/**
 * 画像
 */
export const image = (
  attributes: Attributes & { url: URL; alternativeText: string }
): RawElement =>
  elementNoEndTag(
    "img",
    new Map([
      ...attributesToMap(attributes),
      ["src", attributes.url.toString()],
      ["alt", attributes.alternativeText],
    ])
  );

/**
 * 見出し
 */
export const h1 = (
  attributes: Attributes,
  children: ReadonlyArray<RawElement> | string
): RawElement => element("h1", attributesToMap(attributes), children);

/**
 * 見出し
 */
export const h2 = (
  attributes: Attributes,
  children: ReadonlyArray<RawElement> | string
): RawElement => element("h2", attributesToMap(attributes), children);

/**
 * 見出し
 */
export const h3 = (
  attributes: Attributes,
  children: ReadonlyArray<RawElement> | string
): RawElement => element("h3", attributesToMap(attributes), children);

/**
 * 区切り
 */
export const section = (
  attributes: Attributes,
  children: ReadonlyArray<RawElement>
): RawElement => element("section", attributesToMap(attributes), children);

/**
 * 引用
 */
export const quote = (
  attributes: Attributes & { cite?: URL },
  children: ReadonlyArray<RawElement> | string
): RawElement =>
  element(
    "quote",
    attributes.cite === undefined
      ? attributesToMap(attributes)
      : new Map([
          ...attributesToMap(attributes),
          ["cite", attributes.cite.toString()],
        ]),
    children
  );

/**
 * プログラムのコード
 */
export const code = (
  attributes: Attributes,
  children: ReadonlyArray<RawElement> | string
): RawElement => element("code", attributesToMap(attributes), children);

/**
 * 1行テキストボックス。
 * nameでブラウザに覚えてもらうときのキーを指定できる
 */
export const singleLineTextBox = (
  attributes: Attributes & { name: string }
): RawElement =>
  elementNoEndTag(
    "input",
    new Map([...attributesToMap(attributes), ["name", attributes.name]])
  );

/**
 * ボタン
 */
export const button = (
  attributes: Attributes,
  children: ReadonlyArray<RawElement> | string
): RawElement => element("button", attributesToMap(attributes), children);

/**
 * @narumincho/htmlにないHTML要素を使いたいときに使うもの。
 * 低レベルAPI
 * @param name 要素名
 * @param attributes 属性
 * @param children 子要素
 */
export const element = (
  name: string,
  attributes: ReadonlyMap<string, string | null>,
  children: ReadonlyArray<RawElement> | string
): RawElement => ({
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
const elementRawText = (
  name: string,
  attributes: ReadonlyMap<string, string | null>,
  text: string
): RawElement => ({
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
export const elementNoEndTag = (
  name: string,
  attributes: ReadonlyMap<string, string | null>
): RawElement => ({
  name,
  attributes,
  children: {
    tag: "NoEndTag",
  },
});

/**
 * HtmlElement (need validated)
 */
export type RawElement = {
  name: string;
  /**
   * 属性名は正しい必要がある。
   * value=nullの意味は、属性値がないということ。
   * `<button disabled>`
   */
  attributes: ReadonlyMap<string, string | null>;
  /**
   * 子供。
   * `<path d="M1,2 L20,53"/>`のような閉じカッコの省略はしない
   */
  children: RawChildren;
};

/**
 * 子要素のパターン。パターンマッチングのみに使う
 */
export type RawChildren =
  | {
      tag: "HtmlElementList";
      value: ReadonlyArray<RawElement>;
    }
  | {
      tag: "Text";
      text: string;
    }
  | {
      tag: "RawText";
      text: string;
    }
  | {
      tag: "NoEndTag";
    };

export const escapeInHtml = (text: string): string =>
  text
    .replace(/&/gu, "&amp;")
    .replace(/>/gu, "&gt;")
    .replace(/</gu, "&lt;")
    .replace(/"/gu, "&quot;")
    .replace(/'/gu, "&#x27;")
    .replace(/`/gu, "&#x60;");

export type Html = {
  /** 使用している言語 */
  readonly language?: Language;
  /** アプリの名前 */
  readonly appName: string;
  /** タブなどに表示されるページのタイトル */
  readonly pageName: string;
  /** ページの説明 */
  readonly description: string;
  /** テーマカラー。`#3d7e9a` のようなカラーコード */
  readonly themeColor?: string;
  /** アイコン画像のパス */
  readonly iconPath: ReadonlyArray<string>;
  /** OGPに使われるカバー画像のURL */
  readonly coverImageUrl: URL;
  /** ページのURL */
  readonly url: URL;
  /** マニフェストのパス */
  readonly manifestPath?: ReadonlyArray<string>;
  /** Twitter Card。Twitterでシェアしたときの表示をどうするか */
  readonly twitterCard: TwitterCard;
  /** スタイル。CSS */
  readonly style?: string;
  /** スタイルのURL */
  readonly styleUrlList: ReadonlyArray<URL>;
  /** ES Modules形式のJavaScript */
  readonly script?: string;
  /** スクリプトのURL */
  readonly scriptUrlList: ReadonlyArray<URL>;
  /** javaScriptが有効である必要があるか trueの場合は`<body>`に`<noscript>`での警告が表示される */
  readonly javaScriptMustBeAvailable: boolean;
  /** 中身 */
  readonly body: ReadonlyArray<RawElement>;
};

const languageToIETFLanguageTag = (language: Language): string => {
  switch (language) {
    case "Japanese":
      return "ja";
    case "English":
      return "en";
    case "Esperanto":
      return "eo";
  }
};

const twitterCardToString = (twitterCard: TwitterCard): string => {
  switch (twitterCard) {
    case "SummaryCard":
      return "summary";
    case "SummaryCardWithLargeImage":
      return "summary_large_image";
  }
};

export const toString = (html: Html): string =>
  "<!doctype html>" +
  htmlElementToString(
    element(
      "html",
      new Map(
        html.language === undefined
          ? []
          : [["lang", languageToIETFLanguageTag(html.language)]]
      ),
      [
        headElement(html),
        element(
          "body",
          new Map(),
          html.body.concat(
            html.javaScriptMustBeAvailable
              ? [
                  {
                    name: "noscript",
                    attributes: new Map(),
                    children: {
                      tag: "Text",
                      text:
                        html.appName +
                        "ではJavaScriptを使用します。ブラウザの設定で有効にしてください。",
                    },
                  },
                ]
              : []
          )
        ),
      ]
    )
  );

const headElement = (html: Html): RawElement =>
  element("head", new Map(), [
    charsetElement,
    viewportElement,
    pageNameElement(html.pageName),
    descriptionElement(html.description),
    ...(html.themeColor === undefined
      ? []
      : [themeColorElement(html.themeColor)]),
    iconElement(html.iconPath),
    ...(html.manifestPath === undefined
      ? []
      : [manifestElement(html.manifestPath)]),
    ...(html.style === undefined ? [] : [cssStyleElement(html.style)]),
    twitterCardElement(html.twitterCard),
    ogUrlElement(html.url),
    ogTitleElement(html.pageName),
    ogSiteName(html.appName),
    ogDescription(html.description),
    ogImage(html.coverImageUrl),
    ...(html.script === undefined ? [] : [javaScriptElement(html.script)]),
    ...html.scriptUrlList.map(javaScriptElementByUrl),
    ...html.styleUrlList.map(styleElementByUrl),
  ]);

const charsetElement: RawElement = elementNoEndTag(
  "meta",
  new Map([["charset", "utf-8"]])
);

const viewportElement: RawElement = elementNoEndTag(
  "meta",
  new Map([
    ["name", "viewport"],
    ["content", "width=device-width,initial-scale=1.0"],
  ])
);

const pageNameElement = (pageName: string): RawElement =>
  element("title", new Map(), pageName);

const descriptionElement = (description: string): RawElement =>
  elementNoEndTag(
    "meta",
    new Map([
      ["name", "description"],
      ["content", description],
    ])
  );

const themeColorElement = (themeColor: string): RawElement =>
  elementNoEndTag(
    "meta",
    new Map([
      ["name", "theme-color"],
      ["content", themeColor],
    ])
  );

const iconElement = (iconPath: ReadonlyArray<string>): RawElement =>
  elementNoEndTag(
    "link",
    new Map([
      ["rel", "icon"],
      ["href", "/" + iconPath.map(escapeUrl).join("/")],
    ])
  );

const manifestElement = (path: ReadonlyArray<string>): RawElement =>
  elementNoEndTag(
    "link",
    new Map([
      ["rel", "manifest"],
      ["href", "/" + path.map(escapeUrl).join("/")],
    ])
  );

const cssStyleElement = (cssCode: string): RawElement =>
  elementRawText("style", new Map(), cssCode);

const twitterCardElement = (twitterCard: TwitterCard): RawElement =>
  elementNoEndTag(
    "meta",
    new Map([
      ["name", "twitter:card"],
      ["content", twitterCardToString(twitterCard)],
    ])
  );

const ogUrlElement = (url: URL): RawElement =>
  elementNoEndTag(
    "meta",
    new Map([
      ["property", "og:url"],
      ["content", url.toString()],
    ])
  );

const ogTitleElement = (title: string): RawElement =>
  elementNoEndTag(
    "meta",
    new Map([
      ["property", "og:title"],
      ["content", title],
    ])
  );

const ogSiteName = (siteName: string): RawElement =>
  elementNoEndTag(
    "meta",
    new Map([
      ["property", "og:site_name"],
      ["content", siteName],
    ])
  );

const ogDescription = (description: string): RawElement =>
  elementNoEndTag(
    "meta",
    new Map([
      ["property", "og:description"],
      ["content", description],
    ])
  );

const ogImage = (url: URL): RawElement =>
  elementNoEndTag(
    "meta",
    new Map([
      ["property", "og:image"],
      ["content", url.toString()],
    ])
  );

const javaScriptElement = (javaScriptCode: string): RawElement =>
  elementRawText("script", new Map([["type", "module"]]), javaScriptCode);

const javaScriptElementByUrl = (url: URL): RawElement =>
  element(
    "script",
    new Map([
      ["defer", null],
      ["src", url.toString()],
    ]),
    []
  );

const styleElementByUrl = (url: URL): RawElement =>
  elementNoEndTag(
    "link",
    new Map([
      ["rel", "stylesheet"],
      ["href", url.toString()],
    ])
  );

const escapeUrl = (text: string): string =>
  encodeURIComponent(text).replace(
    /[!'()*]/gu,
    (c: string) => "%" + c.charCodeAt(0).toString(16)
  );

const htmlElementToString = (htmlElement: RawElement): string => {
  const startTag =
    "<" + htmlElement.name + attributesToString(htmlElement.attributes) + ">";
  const endTag = "</" + htmlElement.name + ">";
  switch (htmlElement.children.tag) {
    case "HtmlElementList":
      return (
        startTag +
        htmlElement.children.value.map(htmlElementToString).join("") +
        endTag
      );
    case "Text":
      return startTag + escapeInHtml(htmlElement.children.text) + endTag;
    case "RawText":
      return startTag + htmlElement.children.text + endTag;
    case "NoEndTag":
      return startTag;
  }
};

const attributesToString = (
  attributeMap: ReadonlyMap<string, string | null>
): string => {
  if (attributeMap.size === 0) {
    return "";
  }
  return (
    " " +
    [...attributeMap.entries()]
      .map(([key, value]): string =>
        value === null ? key : key + '="' + escapeInHtml(value) + '"'
      )
      .join(" ")
  );
};
