import * as html from "../source/main";

describe("test", () => {
  const sampleHtml: html.Html = {
    appName: "アプリ名",
    pageName: "ページ名",
    language: html.Language.Japanese,
    iconPath: ["icon"],
    coverImageUrl: "https://narumincho.com/cover-image",
    description: "ページの説明",
    twitterCard: html.TwitterCard.SummaryCard,
    javaScriptMustBeAvailable: false,
    origin: "https://narumincho.com",
    path: [],
    scriptUrlList: [],
    body: [html.div({}, "それな")]
  };
  const htmlAsString: string = html.toString(sampleHtml);
  console.log(htmlAsString);
  it("include doctype html", () => {
    expect(htmlAsString).toMatch(/!doctype html/u);
  });
});
