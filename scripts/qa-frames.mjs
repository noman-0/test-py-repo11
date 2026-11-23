/**
 * QA frame capture for the single-screen 3D experience (dev only; local Edge/Chrome).
 *
 *   node scripts/qa-frames.mjs <baseUrl> <outDir> [--intro] [--areas] [--locale=ar] [--mobile]
 *
 *  --intro   fresh session, screenshots during the brand intro
 *  --areas   travels through all six areas with the bottom-bar stepper; captures the area card,
 *            the first point-of-interest card and the reading view of each area
 * Writes report-<locale>.json (console/page errors). Never touches project files.
 */
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const [, , baseUrl = "http://localhost:3100/", outDir = "qa-frames", ...flags] = process.argv;
const has = (f) => flags.includes(f);
const opt = (k, d) => (flags.find((f) => f.startsWith(`--${k}=`)) || "").split("=")[1] || d;
const locale = opt("locale", "en");
const mobile = has("--mobile");
const [vw, vh] = opt("viewport", mobile ? "390x844" : "1440x900").split("x").map(Number);

const exe = [process.env.QA_BROWSER, "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Google/Chrome/Application/chrome.exe"].find(
  (p) => p && fs.existsSync(p)
);
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ["--ignore-gpu-blocklist"] });
const report = { consoleErrors: [], pageErrors: [], notes: [] };
const tag = mobile ? `${locale}-m` : locale;

async function newPage({ skipIntro }) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  await ctx.addInitScript(
    ([loc, skip]) => {
      try {
        localStorage.setItem("excelsa_locale", loc);
        localStorage.setItem("excelsa_motion", "on");
        if (skip) sessionStorage.setItem("excelsa_intro_seen", "1");
      } catch {}
    },
    [locale, skipIntro]
  );
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && report.consoleErrors.push(m.text().slice(0, 300)));
  page.on("pageerror", (e) => report.pageErrors.push(String(e).slice(0, 300)));
  return { ctx, page };
}
const shot = (page, name) => page.screenshot({ path: path.join(outDir, `${tag}-${name}.png`) });

if (has("--intro")) {
  const { ctx, page } = await newPage({ skipIntro: false });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await shot(page, "intro-0-boot");
  const playing = await page
    .waitForFunction(() => document.documentElement.getAttribute("data-intro") === "playing", null, { timeout: 20000 })
    .then(() => true)
    .catch(() => false);
  if (!playing) report.notes.push("intro did not play (expected on touch devices)");
  const t0 = Date.now();
  for (const at of [500, 1500, 2600, 3900, 5600]) {
    await page.waitForTimeout(Math.max(0, at - (Date.now() - t0)));
    await shot(page, `intro-${at}`);
  }
  await ctx.close();
}

if (has("--areas")) {
  const { ctx, page } = await newPage({ skipIntro: true });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector(".xp-canvas")?.getAttribute("data-ready") === "true", null, { timeout: 30000 }).catch(() => report.notes.push("canvas never ready"));
  await page.waitForTimeout(1200);
  const areas = ["hero", "story", "menu", "catering", "atmosphere", "hub"];
  for (let i = 0; i < areas.length; i++) {
    const a = areas[i];
    if (i > 0) {
      await page.locator(".xp-bar button").last().click();
      await page.waitForTimeout(3600);
    }
    await shot(page, `area-${a}`);
    const pin = page.locator(".xp-pin:visible").first();
    if (await pin.count()) {
      await pin.click({ force: true }).catch(() => undefined);
      await page.waitForTimeout(600);
      await shot(page, `area-${a}-poi`);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
    }
    if (a !== "hero") {
      await page.locator(".xp-card button").first().click();
      await page.waitForTimeout(1100);
      await shot(page, `area-${a}-reading`);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(700);
    }
  }
  await ctx.close();
}

await browser.close();
fs.writeFileSync(path.join(outDir, `report-${tag}.json`), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ errors: report.consoleErrors.length + report.pageErrors.length, ...report }, null, 1).slice(0, 2500));
