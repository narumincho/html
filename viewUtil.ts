import { CSSObject, css } from "@emotion/css";
import {
  Children,
  Element,
  childrenElementList,
  childrenText,
} from "./htmlOption";

/**
 * ```html
 * <div>
 * ```
 */
export const div = (
  option: {
    id?: string;
    style?: CSSObject;
  },
  children: ReadonlyMap<string, Element> | string
): Element => ({
  tag: "div",
  id: idOrUndefined(option.id),
  class: css(option.style),
  children: childrenFromStringOrElementMap(children),
});

/**
 * ```html
 * <a href="URL">
 * ```
 */
export const anchor = (
  option: {
    id?: string;
    url: URL;
    style?: CSSObject;
  },
  children: ReadonlyMap<string, Element> | string
): Element => ({
  tag: "anchor",
  id: idOrUndefined(option.id),
  class: css(option.style),
  url: option.url.toString(),
  children: childrenFromStringOrElementMap(children),
});

/**
 * ```html
 * <button>
 * ```
 */
export const button = (
  option: {
    id?: string;
    style?: CSSObject;
  },
  children: ReadonlyMap<string, Element> | string
): Element => ({
  tag: "button",
  id: idOrUndefined(option.id),
  class: css(option.style),
  children: childrenFromStringOrElementMap(children),
});

/**
 * ```html
 * <img alt="画像の代替テキスト" src="URL か blob URL">
 * ```
 */
export const image = (option: {
  id?: string;
  style?: CSSObject;
  alt: string;
  /** 画像のURL. なぜ URL 型にしないかと言うと, BlobURLがURL型に入らないから */
  src: string;
}): Element => ({
  tag: "img",
  id: idOrUndefined(option.id),
  class: css(option.style),
  alt: option.alt,
  src: option.src,
});

/**
 * ```html
 * <input type="radio">
 * ```
 */
export const inputRadio = (option: {
  id?: string;
  style?: CSSObject;
  checked: boolean;
  /** 選択肢の選択を1にする動作のため. どの選択肢に属しているかを指定する */
  groupName: string;
}): Element => ({
  tag: "inputRadio",
  id: idOrUndefined(option.id),
  class: css(option.style),
  checked: option.checked,
  name: option.groupName,
});

/**
 * ```html
 * <input type="text">
 * ```
 */
export const inputOneLineText = (option: {
  id?: string;
  style?: CSSObject;
  value: string;
}): Element => ({
  tag: "inputText",
  id: idOrUndefined(option.id),
  class: css(option.style),
  value: option.value,
});

/**
 * ```html
 * <textarea>
 * ```
 */
export const inputMultiLineText = (option: {
  id?: string;
  style?: CSSObject;
  value: string;
}): Element => ({
  tag: "textArea",
  id: idOrUndefined(option.id),
  class: css(option.style),
  value: option.value,
});

/**
 * ```html
 * <label>
 * ```
 */
export const label = (
  option: { id?: string; style?: CSSObject; targetElementId: string },
  children: ReadonlyMap<string, Element> | string
): Element => ({
  tag: "label",
  id: idOrUndefined(option.id),
  class: css(option.style),
  for: option.targetElementId,
  children: childrenFromStringOrElementMap(children),
});

/**
 * ```html
 * <svg>
 * ```
 */
export const svg = (
  option: {
    id?: string;
    viewBox: { x: number; y: number; width: number; height: number };
    style?: CSSObject;
  },
  children: ReadonlyMap<string, Element>
): Element => ({
  tag: "svg",
  id: idOrUndefined(option.id),
  class: css(option.style),
  viewBoxX: option.viewBox.x,
  viewBoxY: option.viewBox.y,
  viewBoxWidth: option.viewBox.width,
  viewBoxHeight: option.viewBox.height,
  children: childrenElementList(children),
});

/**
 * ```html
 * <path>
 * ```
 */
export const path = (option: {
  id?: string;
  style?: CSSObject;
  d: string;
  fill: string;
}): Element => ({
  tag: "path",
  id: idOrUndefined(option.id),
  class: css(option.style),
  d: option.d,
  fill: option.fill,
});

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
 * <circle>
 * ```
 */
export const circle = (option: {
  id?: string;
  style?: CSSObject;
  cx: number;
  cy: number;
  fill: string;
  r: number;
  stroke: string;
  animations?: ReadonlyArray<SvgAnimation>;
}): Element => ({
  tag: "circle",
  id: idOrUndefined(option.id),
  class: css(option.style),
  cx: option.cx,
  cy: option.cy,
  r: option.r,
  fill: option.fill,
  stroke: option.stroke,
  children:
    option.animations === undefined
      ? childrenText("")
      : childrenElementList(
          c(
            option.animations.map((animation) => [
              animation.attributeName,
              animate(animation),
            ])
          )
        ),
});

/**
 * ```html
 * <animate>
 * ```
 */
const animate = (svgAnimation: SvgAnimation): Element => ({
  tag: "animate",
  attributeName: svgAnimation.attributeName,
  dur: svgAnimation.dur,
  repeatCount: "indefinite",
  from: svgAnimation.from.toString(),
  to: svgAnimation.to.toString(),
});

const idOrUndefined = (idValue: string | undefined): string =>
  idValue === undefined ? "" : idValue;

/**
 * view の body の class 名を スタイルから算出する.
 *
 * CSS も nview で管理するようになれば不要
 */
export const styleToBodyClass = (style?: CSSObject): string => css(style);

const childrenFromStringOrElementMap = (
  children: ReadonlyMap<string, Element> | string
): Children =>
  typeof children === "string"
    ? childrenText(children)
    : childrenElementList(children);

export const c = (
  keyAndElementList: ReadonlyArray<readonly [string, Element]>
): ReadonlyMap<string, Element> => new Map(keyAndElementList);
