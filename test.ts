import * as toString from "./toString";
import { View, childrenElementList } from "./view";
import { div, styleToBodyClass } from "./viewUtil";
import { colorToHexString } from "./util";

describe("toString", () => {
  const sampleHtml: View<never> = {
    appName: "テストアプリ",
    pageName: "テストページ",
    language: "Japanese",
    iconPath: "/icon",
    coverImageUrl: new URL("https://narumincho.com/assets/kamausagi.png"),
    description: "ページの説明",
    twitterCard: "SummaryCard",
    url: new URL("https://narumincho.com"),
    scriptUrlList: [],
    styleUrlList: [],
    bodyClass: styleToBodyClass(),
    children: childrenElementList(new Map([["e", div({}, "それな")]])),
    themeColor: undefined,
  };
  const htmlAsString: string = toString.toString(sampleHtml);
  console.log(htmlAsString);
  it("include doctype html", () => {
    expect(htmlAsString).toMatchSnapshot();
  });
});

describe("color", () => {
  it("white", () => {
    expect(colorToHexString({ r: 1, g: 1, b: 1 })).toEqual("#ffffff");
  });
  it("black", () => {
    expect(colorToHexString({ r: 0, g: 0, b: 0 })).toEqual("#000000");
  });
  it("red", () => {
    expect(colorToHexString({ r: 1, g: 0, b: 0 })).toEqual("#ff0000");
  });
  it("medium", () => {
    expect(colorToHexString({ r: 0.5, g: 0.2, b: 0.1 })).toEqual("#803319");
  });
});
