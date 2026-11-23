// Tell Bing (and other IndexNow engines: Yandex, Seznam, Naver) that our pages changed — they re-crawl within minutes
// instead of days. Bing also powers ChatGPT search and Microsoft Copilot.
//   npm run indexnow            → submits every URL in the live sitemap
//   npm run indexnow -- /pricing/ /refer/   → submits only these paths
// Run it after a deploy is live (Cloudflare finishes ~1 minute after git push).
import { SITE } from "../site/config.mjs";

const KEY = "f76646b503a9ed9de711edb3f7310e93"; // public by design: served at /<key>.txt to prove we own the site
const host = new URL(SITE.url).host;

const args = process.argv.slice(2).filter((a) => a.startsWith("/"));
let urls;
if (args.length) {
  urls = args.map((p) => SITE.url + p);
} else {
  const xml = await (await fetch(`${SITE.url}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const keyCheck = await fetch(`${SITE.url}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error(`Key file ${SITE.url}/${KEY}.txt is not live yet — deploy first.`);
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE.url}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: submitted ${urls.length} URL(s) → HTTP ${res.status} ${res.status === 200 || res.status === 202 ? "(accepted)" : await res.text()}`);
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
