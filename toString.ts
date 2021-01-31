import {
  Children,
  Color,
  Element,
  View,
  childrenElementListTag,
  childrenTextTag,
} from "./view";
import { Language, TwitterCard } from "./data";
import { colorToHexString } from "./util";

/** @deprecated */
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
 * 見出し
 * @deprecated
 */
export const h1 = (
  attributes: Attributes,
  children: ReadonlyArray<RawElement> | string
): RawElement => rawElement("h1", attributesToMap(attributes), children);

/**
 * 見出し
 * @deprecated
 */
export const h2 = (
  attributes: Attributes,
  children: ReadonlyArray<RawElement> | string
): RawElement => rawElement("h2", attributesToMap(attributes), children);

/**
 * 見出し
 * @deprecated
 */
export const h3 = (
  attributes: Attributes,
  children: ReadonlyArray<RawElement> | string
): RawElement => rawElement("h3", attributesToMap(attributes), children);

/**
 * 区切り
 * @deprecated
 */
export const section = (
  attributes: Attributes,
  children: ReadonlyArray<RawElement>
): RawElement => rawElement("section", attributesToMap(attributes), children);

/**
 * 引用
 * @deprecated
 */
export const quote = (
  attributes: Attributes & { cite?: URL },
  children: ReadonlyArray<RawElement> | string
): RawElement =>
  rawElement(
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
 * @deprecated
 */
export const code = (
  attributes: Attributes,
  children: ReadonlyArray<RawElement> | string
): RawElement => rawElement("code", attributesToMap(attributes), children);

/**
 * @narumincho/htmlにないHTML要素を使いたいときに使うもの。
 * 低レベルAPI @deprecated
 * @param name 要素名
 * @param attributes 属性
 * @param children 子要素
 */
const rawElement = (
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
const rawElementRawText = (
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
export const rawElementNoEndTag = (
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

/**
 * View を HTML に変換する. イベントの登録は行われない
 */
export const toString = <Message>(view: View<Message>): string =>
  "<!doctype html>" +
  htmlElementToString({
    name: "html",
    attributes: new Map(
      view.language === undefined
        ? []
        : [["lang", languageToIETFLanguageTag(view.language)]]
    ),
    children: {
      tag: "HtmlElementList",
      value: [
        headElement(view),
        {
          name: "body",
          attributes: new Map([["class", view.bodyClass]]),
          children: appendNoScriptDescription(
            view.appName,
            childrenToRawChildren(view.children)
          ),
        },
      ],
    },
  });

const appendNoScriptDescription = (
  appName: string,
  rawChildren: RawChildren
): RawChildren => {
  const noScriptElement: RawElement = {
    name: "noscript",
    attributes: new Map(),
    children: {
      tag: "Text",
      text:
        appName +
        "ではJavaScriptを使用します。ブラウザの設定で有効にしてください。",
    },
  };
  switch (rawChildren.tag) {
    case "HtmlElementList":
      return {
        tag: "HtmlElementList",
        value: [noScriptElement, ...rawChildren.value],
      };
    case "NoEndTag":
      return {
        tag: "HtmlElementList",
        value: [noScriptElement],
      };
    case "RawText":
    case "Text":
      return {
        tag: "HtmlElementList",
        value: [
          noScriptElement,
          { name: "div", attributes: new Map(), children: rawChildren },
        ],
      };
  }
};

const childrenToRawChildren = <Message>(
  children: Children<Message>
): RawChildren => {
  switch (children.tag) {
    case childrenElementListTag:
      return {
        tag: "HtmlElementList",
        value: [...children.value].map(([_, child]) =>
          elementToRawElement(child)
        ),
      };
    case childrenTextTag:
      return { tag: "Text", text: children.value };
  }
};

const elementToRawElement = <Message>(
  element: Element<Message>
): RawElement => {
  switch (element.tag) {
    case "animate":
      return {
        name: "animate",
        attributes: new Map([
          ["attributeName", element.attributeName],
          ["dur", element.dur.toString()],
          ["from", element.from],
          ["repeatCount", element.repeatCount],
          ["to", element.to],
        ]),
        children: { tag: "HtmlElementList", value: [] },
      };
    case "button":
      return {
        name: "button",
        attributes: new Map([
          ["class", element.class],
          ["id", element.id],
        ]),
        children: childrenToRawChildren(element.children),
      };
    case "circle":
      return {
        name: "circle",
        attributes: new Map([
          ["class", element.class],
          ["id", element.id],
          ["cx", element.cx.toString()],
          ["cy", element.cy.toString()],
          ["fill", element.fill],
          ["id", element.id],
          ["r", element.r.toString()],
          ["stroke", element.stroke],
        ]),
        children: childrenToRawChildren(element.children),
      };
    case "div":
      return {
        name: "div",
        attributes: new Map([
          ["class", element.class],
          ["id", element.id],
        ]),
        children: childrenToRawChildren(element.children),
      };
    case "externalLink":
      return {
        name: "a",
        attributes: new Map([
          ["class", element.class],
          ["id", element.id],
          ["href", element.url],
        ]),
        children: childrenToRawChildren(element.children),
      };
    case "img":
      return {
        name: "img",
        attributes: new Map([
          ["alt", element.alt],
          ["class", element.class],
          ["id", element.id],
          ["src", element.src],
        ]),
        children: { tag: "NoEndTag" },
      };
    case "inputRadio":
      return {
        name: "input",
        attributes: new Map([
          ["type", "radio"],
          ["class", element.class],
          ["id", element.id],
          ["name", element.name],
        ]),
        children: { tag: "NoEndTag" },
      };
    case "inputText":
      return {
        name: "input",
        attributes: new Map([
          ["type", "text"],
          ["class", element.class],
          ["id", element.id],
        ]),
        children: { tag: "NoEndTag" },
      };
    case "label":
      return {
        name: "label",
        attributes: new Map([
          ["class", element.class],
          ["for", element.for],
          ["id", element.id],
        ]),
        children: childrenToRawChildren(element.children),
      };
    case "localLink":
      return {
        name: "a",
        attributes: new Map([
          ["class", element.class],
          ["id", element.id],
          ["href", element.url],
        ]),
        children: childrenToRawChildren(element.children),
      };
    case "path":
      return {
        name: "path",
        attributes: new Map([
          ["class", element.class],
          ["d", element.d],
          ["fill", element.fill],
          ["id", element.id],
        ]),
        children: { tag: "NoEndTag" },
      };
    case "svg":
      return {
        name: "svg",
        attributes: new Map([
          ["class", element.class],
          ["id", element.id],
          [
            "viewBox",
            `${element.viewBoxX} ${element.viewBoxY} ${element.viewBoxWidth} ${element.viewBoxHeight}`,
          ],
        ]),
        children: childrenToRawChildren(element.children),
      };
    case "textArea":
      return {
        name: "textarea",
        attributes: new Map([
          ["class", element.class],
          ["id", element.id],
        ]),
        children: { tag: "NoEndTag" },
      };
  }
};

const headElement = <Message>(html: View<Message>): RawElement =>
  rawElement("head", new Map(), [
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

const charsetElement: RawElement = rawElementNoEndTag(
  "meta",
  new Map([["charset", "utf-8"]])
);

const viewportElement: RawElement = rawElementNoEndTag(
  "meta",
  new Map([
    ["name", "viewport"],
    ["content", "width=device-width,initial-scale=1.0"],
  ])
);

const pageNameElement = (pageName: string): RawElement =>
  rawElement("title", new Map(), pageName);

const descriptionElement = (description: string): RawElement =>
  rawElementNoEndTag(
    "meta",
    new Map([
      ["name", "description"],
      ["content", description],
    ])
  );

const themeColorElement = (themeColor: Color): RawElement =>
  rawElementNoEndTag(
    "meta",
    new Map([
      ["name", "theme-color"],
      ["content", colorToHexString(themeColor)],
    ])
  );

const iconElement = (iconPath: string): RawElement =>
  rawElementNoEndTag(
    "link",
    new Map([
      ["rel", "icon"],
      ["href", iconPath],
    ])
  );

const manifestElement = (path: ReadonlyArray<string>): RawElement =>
  rawElementNoEndTag(
    "link",
    new Map([
      ["rel", "manifest"],
      ["href", "/" + path.map(escapeUrl).join("/")],
    ])
  );

const cssStyleElement = (cssCode: string): RawElement =>
  rawElementRawText("style", new Map(), cssCode);

const twitterCardElement = (twitterCard: TwitterCard): RawElement =>
  rawElementNoEndTag(
    "meta",
    new Map([
      ["name", "twitter:card"],
      ["content", twitterCardToString(twitterCard)],
    ])
  );

const ogUrlElement = (url: URL): RawElement =>
  rawElementNoEndTag(
    "meta",
    new Map([
      ["property", "og:url"],
      ["content", url.toString()],
    ])
  );

const ogTitleElement = (title: string): RawElement =>
  rawElementNoEndTag(
    "meta",
    new Map([
      ["property", "og:title"],
      ["content", title],
    ])
  );

const ogSiteName = (siteName: string): RawElement =>
  rawElementNoEndTag(
    "meta",
    new Map([
      ["property", "og:site_name"],
      ["content", siteName],
    ])
  );

const ogDescription = (description: string): RawElement =>
  rawElementNoEndTag(
    "meta",
    new Map([
      ["property", "og:description"],
      ["content", description],
    ])
  );

const ogImage = (url: URL): RawElement =>
  rawElementNoEndTag(
    "meta",
    new Map([
      ["property", "og:image"],
      ["content", url.toString()],
    ])
  );

const javaScriptElement = (javaScriptCode: string): RawElement =>
  rawElementRawText("script", new Map([["type", "module"]]), javaScriptCode);

const javaScriptElementByUrl = (url: URL): RawElement =>
  rawElement(
    "script",
    new Map([
      ["defer", null],
      ["src", url.toString()],
    ]),
    []
  );

const styleElementByUrl = (url: URL): RawElement =>
  rawElementNoEndTag(
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
