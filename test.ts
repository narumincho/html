import * as toString from "./toString";
import * as view from "./view";
import * as viewUtil from "./viewUtil";

describe("test", () => {
  const sampleHtml: view.View<never> = {
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
    bodyClass: viewUtil.styleToBodyClass(),
    children: view.childrenElementList(
      new Map([["e", viewUtil.div({}, "それな")]])
    ),
    themeColor: undefined,
  };
  const htmlAsString: string = toString.toString(sampleHtml);
  console.log(htmlAsString);
  it("include doctype html", () => {
    expect(htmlAsString).toMatchSnapshot();
  });
});
