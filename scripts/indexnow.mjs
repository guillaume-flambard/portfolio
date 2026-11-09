// Tell Bing, Yandex and the other IndexNow engines that the sitemap URLs changed.
// Run after a deploy that adds or rewrites pages: `npm run indexnow`.
// The key is public by design: IndexNow checks it at https://memolabs.dev/<key>.txt.
const HOST = "memolabs.dev";
const KEY = "54b3ef48d72a93bce44638c2d82210a2";

const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});

console.log(`IndexNow: ${urlList.length} URLs, HTTP ${res.status}`);
// 200 and 202 both mean accepted; anything else is worth reading.
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
