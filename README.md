# @narumincho/html

Light UI Library for Web.

SSR, SSG ようのライブラリだったが, CSR もサポートしだしている. 部分的な適用はできず, 全体を型がしっかりついた状態で作れる. 機能は必要になったらずい維持対応していく.
(n-view に 改名したい)

[![npm version](https://badge.fury.io/js/%40narumincho%2Fhtml.svg)](https://badge.fury.io/js/%40narumincho%2Fhtml)

```ts
import * as html from "../source/main";
import { URL } from "url";

const sampleHtml: html.Html = {
  appName: "アプリ名",
  pageName: "ページ名",
  language: html.Language.Japanese,
  iconPath: ["icon"],
  coverImageUrl: new URL("https://narumincho.com/assets/kamausagi.png"),
  description: "ページの説明",
  twitterCard: html.TwitterCard.SummaryCard,
  javaScriptMustBeAvailable: false,
  origin: "https://narumincho.com",
  path: [],
  scriptUrlList: [],
  styleUrlList: [],
  body: [html.div({}, "それな")],
};

const htmlAsString: string = html.toString(sampleHtml);

console.log(htmlAsString); // <!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>ページ名</title><meta name="description" content="ページの説明"><link rel="icon" href="/icon"><meta name="twitter:card" content="summary"><meta property="og:url" content="https://narumincho.com/"><meta property="og:title" content="ページ名"><meta property="og:site_name" content="アプリ名"><meta property="og:description" content="ページの説明"><meta property="og:image" content="https://narumincho.com/assets/kamausagi.png"></head><body><div>それな</div></body></html>
```
