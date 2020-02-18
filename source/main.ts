import { URL } from "url";

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
  children: ReadonlyArray<Element> | string
): Element => ({
  name: "div",
  attributes: attributesToMap(attributes),
  children:
    typeof children === "string"
      ? { _: HtmlElementChildren_.Text, text: children }
      : { _: HtmlElementChildren_.HtmlElementList, value: children }
});

/**
 * リンク
 */
export const anchorLink = (
  attributes: Attributes & { url: URL },
  children: ReadonlyArray<Element> | string
): Element => ({
  name: "a",
  attributes: new Map([
    ...attributesToMap(attributes),
    ["href", attributes.url.toString()]
  ]),
  children:
    typeof children === "string"
      ? { _: HtmlElementChildren_.Text, text: children }
      : { _: HtmlElementChildren_.HtmlElementList, value: children }
});

/**
 * 画像
 */
export const image = (
  attributes: Attributes & { url: URL; alternativeText: string }
): Element => ({
  name: "img",
  attributes: new Map([
    ...attributesToMap(attributes),
    ["src", attributes.url.toString()],
    ["alt", attributes.alternativeText]
  ]),
  children: { _: HtmlElementChildren_.NoEndTag }
});

/**
 * 見出し
 */
export const h1 = (
  attributes: Attributes,
  children: ReadonlyArray<Element> | string
): Element => ({
  name: "h1",
  attributes: attributesToMap(attributes),
  children:
    typeof children === "string"
      ? { _: HtmlElementChildren_.Text, text: children }
      : { _: HtmlElementChildren_.HtmlElementList, value: children }
});

/**
 * 見出し
 */
export const h2 = (
  attributes: Attributes,
  children: ReadonlyArray<Element> | string
): Element => ({
  name: "h2",
  attributes: attributesToMap(attributes),
  children:
    typeof children === "string"
      ? { _: HtmlElementChildren_.Text, text: children }
      : { _: HtmlElementChildren_.HtmlElementList, value: children }
});

/**
 * 見出し
 */
export const h3 = (
  attributes: Attributes,
  children: ReadonlyArray<Element> | string
): Element => ({
  name: "h3",
  attributes: attributesToMap(attributes),
  children:
    typeof children === "string"
      ? { _: HtmlElementChildren_.Text, text: children }
      : { _: HtmlElementChildren_.HtmlElementList, value: children }
});

/**
 * 区切り
 */
export const section = (
  attributes: Attributes,
  children: ReadonlyArray<Element>
): Element => ({
  name: "section",
  attributes: attributesToMap(attributes),
  children:
    typeof children === "string"
      ? { _: HtmlElementChildren_.Text, text: children }
      : { _: HtmlElementChildren_.HtmlElementList, value: children }
});

/**
 * 引用
 */
export const blockquote = (
  attributes: Attributes & { cite?: URL },
  children: ReadonlyArray<Element> | string
): Element => ({
  name: "quote",
  attributes:
    attributes.cite === undefined
      ? attributesToMap(attributes)
      : new Map([
          ...attributesToMap(attributes),
          ["cite", attributes.cite.toString()]
        ]),
  children:
    typeof children === "string"
      ? { _: HtmlElementChildren_.Text, text: children }
      : { _: HtmlElementChildren_.HtmlElementList, value: children }
});

/**
 * プログラムのコード
 */
export const code = (
  attributes: Attributes,
  children: ReadonlyArray<Element> | string
): Element => ({
  name: "blockquote",
  attributes: attributesToMap(attributes),
  children:
    typeof children === "string"
      ? { _: HtmlElementChildren_.Text, text: children }
      : { _: HtmlElementChildren_.HtmlElementList, value: children }
});

/**
 * 1行テキストボックス。
 * nameでブラウザに覚えてもらうときのキーを指定できる
 */
export const singleLineTextBox = (
  attributes: Attributes & { name: string }
): Element => ({
  name: "input",
  attributes: new Map([
    ...attributesToMap(attributes),
    ["name", attributes.name]
  ]),
  children: {
    _: HtmlElementChildren_.NoEndTag
  }
});

/**
 * ボタン
 */
export const button = (
  attributes: Attributes,
  children: ReadonlyArray<Element> | string
): Element => ({
  name: "button",
  attributes: attributesToMap(attributes),
  children:
    typeof children === "string"
      ? { _: HtmlElementChildren_.Text, text: children }
      : { _: HtmlElementChildren_.HtmlElementList, value: children }
});

/**
 * HtmlElement (need validated)
 */
export type Element = {
  name: string;
  /**
   * 属性名は正しい必要がある。
   * value=nullの意味は、属性値がないということ。
   * `<button disabled>`
   */
  attributes: ReadonlyMap<string, string | null>;
  /**
   * 子供。nullで閉じカッコなし `<img src="url" alt="image">`
   * `[]`や`""`の場合は `<script src="url"></script>`
   * `<path d="M1,2 L20,53"/>`のような閉じカッコの省略はしない
   */
  children: HtmlElementChildren;
};

/**
 * 子要素のパターン。パターンマッチングのみに使う
 */
export type HtmlElementChildren =
  | {
      _: HtmlElementChildren_.HtmlElementList;
      value: ReadonlyArray<Element>;
    }
  | {
      _: HtmlElementChildren_.Text;
      text: string;
    }
  | {
      _: HtmlElementChildren_.RawText;
      text: string;
    }
  | {
      _: HtmlElementChildren_.NoEndTag;
    };

/**
 * パターンマッチングのみに使う
 */
export const enum HtmlElementChildren_ {
  HtmlElementList,
  /**
   * 中の文字列をエスケープする
   */
  Text,
  /**
   * 中の文字列をそのまま扱う `<script>`用
   */
  RawText,
  /**
   * 閉じカッコなし `<img src="url" alt="image">`
   */
  NoEndTag
}

export const escapeInHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/`/g, "&#x60;");

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
  /** オリジン https://definy-lang.web.app のようなスキーマとドメインとポート番号をまとめたもの */
  readonly origin: string;
  /** パス */
  readonly path: ReadonlyArray<string>;
  /** マニフェストのパス */
  readonly manifestPath?: ReadonlyArray<string>;
  /** Twitter Card。Twitterでシェアしたときの表示をどうするか */
  readonly twitterCard: TwitterCard;
  /** スタイル。CSS */
  readonly style?: string;
  /** ES Modules形式のJavaScript */
  readonly script?: string;
  /** スクリプトのURL */
  readonly scriptUrlList: ReadonlyArray<string>;
  /** javaScriptが有効である必要があるか trueの場合は`<body>`に`<noscript>`での警告が表示される */
  readonly javaScriptMustBeAvailable: boolean;
  /** 中身 */
  readonly body: ReadonlyArray<Element>;
};

export const enum Language {
  /** 日本語 `ja` */
  Japanese,
  /** 英語 `en` */
  English
}

const languageToIETFLanguageTag = (language: Language): string => {
  switch (language) {
    case Language.Japanese:
      return "ja";
    case Language.English:
      return "en";
  }
};

export const enum TwitterCard {
  /** 画像を横に並べて表示 */
  SummaryCard,
  /** 画像を大きく表示 */
  SummaryCardWithLargeImage
}

const twitterCardToString = (twitterCard: TwitterCard): string => {
  switch (twitterCard) {
    case TwitterCard.SummaryCard:
      return "summary";
    case TwitterCard.SummaryCardWithLargeImage:
      return "summary_large_image";
  }
};

export const toString = (html: Html): string =>
  "<!doctype html>" +
  htmlElementToString({
    name: "html",
    attributes: new Map(
      html.language === undefined
        ? []
        : [["lang", languageToIETFLanguageTag(html.language)]]
    ),
    children: {
      _: HtmlElementChildren_.HtmlElementList,
      value: [
        headElement(html),
        {
          name: "body",
          attributes: new Map(),
          children: {
            _: HtmlElementChildren_.HtmlElementList,
            value: html.body.concat(
              html.javaScriptMustBeAvailable
                ? [
                    {
                      name: "noscript",
                      attributes: new Map(),
                      children: {
                        _: HtmlElementChildren_.Text,
                        text:
                          html.appName +
                          "ではJavaScriptを使用します。ブラウザの設定で有効にしてください。"
                      }
                    }
                  ]
                : []
            )
          }
        }
      ]
    }
  });

const headElement = (html: Html): Element => ({
  name: "head",
  attributes: new Map(),
  children: {
    _: HtmlElementChildren_.HtmlElementList,
    value: [
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
      ogUrlElement(html.origin, html.path),
      ogTitleElement(html.pageName),
      ogSiteName(html.appName),
      ogDescription(html.description),
      ogImage(html.coverImageUrl),
      ...(html.script === undefined ? [] : [javaScriptElement(html.script)]),
      ...html.scriptUrlList.map(javaScriptElementByUrl)
    ]
  }
});

const charsetElement: Element = {
  name: "meta",
  attributes: new Map([["charset", "utf-8"]]),
  children: {
    _: HtmlElementChildren_.NoEndTag
  }
};

const viewportElement: Element = {
  name: "meta",
  attributes: new Map([
    ["name", "viewport"],
    ["content", "width=device-width,initial-scale=1.0"]
  ]),
  children: {
    _: HtmlElementChildren_.NoEndTag
  }
};

const pageNameElement = (pageName: string): Element => ({
  name: "title",
  attributes: new Map(),
  children: {
    _: HtmlElementChildren_.Text,
    text: pageName
  }
});

const descriptionElement = (description: string): Element => ({
  name: "meta",
  attributes: new Map([
    ["name", "description"],
    ["content", description]
  ]),
  children: {
    _: HtmlElementChildren_.NoEndTag
  }
});

const themeColorElement = (themeColor: string): Element => ({
  name: "meta",
  attributes: new Map([
    ["name", "theme-color"],
    ["content", themeColor]
  ]),
  children: {
    _: HtmlElementChildren_.NoEndTag
  }
});

const iconElement = (iconPath: ReadonlyArray<string>): Element => ({
  name: "link",
  attributes: new Map([
    ["rel", "icon"],
    ["href", "/" + iconPath.map(escapeUrl).join("/")]
  ]),
  children: {
    _: HtmlElementChildren_.NoEndTag
  }
});

const manifestElement = (path: ReadonlyArray<string>): Element => ({
  name: "link",
  attributes: new Map([
    ["rel", "manifest"],
    ["href", "/" + path.map(escapeUrl).join("/")]
  ]),
  children: {
    _: HtmlElementChildren_.NoEndTag
  }
});

const cssStyleElement = (code: string): Element => ({
  name: "style",
  attributes: new Map(),
  children: {
    _: HtmlElementChildren_.RawText,
    text: code
  }
});

const twitterCardElement = (twitterCard: TwitterCard): Element => ({
  name: "meta",
  attributes: new Map([
    ["name", "twitter:card"],
    ["content", twitterCardToString(twitterCard)]
  ]),
  children: { _: HtmlElementChildren_.NoEndTag }
});

const ogUrlElement = (
  origin: string,
  path: ReadonlyArray<string>
): Element => ({
  name: "meta",
  attributes: new Map([
    ["property", "og:url"],
    ["content", origin + "/" + path.map(escapeUrl).join("/")]
  ]),
  children: { _: HtmlElementChildren_.NoEndTag }
});

const ogTitleElement = (title: string): Element => ({
  name: "meta",
  attributes: new Map([
    ["property", "og:title"],
    ["content", title]
  ]),
  children: {
    _: HtmlElementChildren_.NoEndTag
  }
});

const ogSiteName = (siteName: string): Element => ({
  name: "meta",
  attributes: new Map([
    ["property", "og:site_name"],
    ["content", siteName]
  ]),
  children: {
    _: HtmlElementChildren_.NoEndTag
  }
});

const ogDescription = (description: string): Element => ({
  name: "meta",
  attributes: new Map([
    ["property", "og:description"],
    ["content", description]
  ]),
  children: {
    _: HtmlElementChildren_.NoEndTag
  }
});

const ogImage = (url: URL): Element => ({
  name: "meta",
  attributes: new Map([
    ["property", "og:image"],
    ["content", url.toString()]
  ]),
  children: {
    _: HtmlElementChildren_.NoEndTag
  }
});

const javaScriptElement = (code: string): Element => ({
  name: "script",
  attributes: new Map([["type", "module"]]),
  children: { _: HtmlElementChildren_.RawText, text: code }
});

const javaScriptElementByUrl = (url: string): Element => ({
  name: "script",
  attributes: new Map([
    ["defer", null],
    ["src", url]
  ]),
  children: {
    _: HtmlElementChildren_.HtmlElementList,
    value: []
  }
});

const escapeUrl = (text: string): string =>
  encodeURIComponent(text).replace(
    /[!'()*]/gu,
    (c: string) => "%" + c.charCodeAt(0).toString(16)
  );

const htmlElementToString = (htmlElement: Element): string => {
  const startTag =
    "<" + htmlElement.name + attributesToString(htmlElement.attributes) + ">";
  const endTag = "</" + htmlElement.name + ">";
  switch (htmlElement.children._) {
    case HtmlElementChildren_.HtmlElementList:
      return (
        startTag +
        htmlElement.children.value.map(htmlElementToString).join("") +
        endTag
      );
    case HtmlElementChildren_.Text:
      return startTag + escapeInHtml(htmlElement.children.text) + endTag;
    case HtmlElementChildren_.RawText:
      return startTag + htmlElement.children.text + endTag;
    case HtmlElementChildren_.NoEndTag:
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
