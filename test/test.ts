import * as html from "../source/main";
import { URL } from "url";

describe("test", () => {
  const sampleHtml: html.Html = {
    appName: "アプリ名",
    pageName: "ページ名",
    language: html.Language.Japanese,
    iconPath: ["icon"],
    coverImageUrl: new URL("https://narumincho.com/assets/kamausagi.png"),
    description: "ページの説明",
    twitterCard: html.TwitterCard.SummaryCard,
    javaScriptMustBeAvailable: false,
    url: new URL("https://narumincho.com"),
    scriptUrlList: [],
    styleUrlList: [],
    body: [html.div({}, "それな")],
  };
  const htmlAsString: string = html.toString(sampleHtml);
  console.log(htmlAsString);
  it("include doctype html", () => {
    expect(htmlAsString).toMatchSnapshot();
  });
});
