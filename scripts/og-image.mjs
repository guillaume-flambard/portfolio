// Renders the social share images (public/og-fr.png, public/og-en.png) from the homepage copy.
// Run after changing the hero text: `node scripts/og-image.mjs`. Needs Google Chrome installed.
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const root = new URL("..", import.meta.url);
const tokens = readFileSync(new URL("src/styles/tokens.css", root), "utf8");
const token = (name) => tokens.match(new RegExp(`--${name}:\\s*([^;]+);`))[1].trim();
const [bg, ink, muted, line, accent] = ["bg", "ink", "muted", "line", "accent"].map(token);

const proof = {
  fr: "Medsharing · Symbyoz · Echo Travel et Blue Owl (CTO) · Data for Good",
  en: "Medsharing · Symbyoz · Echo Travel and Blue Owl (CTO) · Data for Good",
};
const demos = { fr: "26 démos en ligne · entièrement à distance", en: "26 live demos · fully remote" };

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function page(locale) {
  const home = JSON.parse(readFileSync(new URL(`src/i18n/messages/${locale}.json`, root), "utf8")).home;
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: ${bg}; color: ${ink}; font-family: Oswald, sans-serif;
    display: flex; flex-direction: column; justify-content: space-between; padding: 64px 72px 0; }
  .eyebrow { display: flex; align-items: center; gap: 16px; color: ${accent}; font-size: 20px; font-weight: 400;
    letter-spacing: .16em; text-transform: uppercase; }
  .eyebrow i { width: 44px; height: 2px; background: ${accent}; }
  h1 { margin-top: 30px; font-size: 64px; line-height: 1.06; font-weight: 600; text-transform: uppercase; max-width: 22ch; text-wrap: balance; }
  h1 span { color: ${accent}; }
  .proof { margin-top: 26px; color: ${muted}; font-size: 27px; font-weight: 300; }
  footer { border-top: 1px solid ${line}; margin: 0 -72px; padding: 24px 72px; display: flex; justify-content: space-between;
    color: ${muted}; font-size: 19px; letter-spacing: .16em; text-transform: uppercase; }
</style></head><body>
  <div>
    <p class="eyebrow"><i></i>Guillaume Flambard · Freelance</p>
    <h1>${escape(home.h1a)} <span>${escape(home.h1accent)}</span></h1>
    <p class="proof">${escape(proof[locale])}</p>
  </div>
  <footer><span>memolabs.dev</span><span>${escape(demos[locale])}</span></footer>
</body></html>`;
}

const browser = await chromium.launch({ channel: "chrome" });
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const locale of ["fr", "en"]) {
  await tab.setContent(page(locale), { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: new URL(`public/og-${locale}.png`, root).pathname });
  console.log(`public/og-${locale}.png`);
}
await browser.close();
