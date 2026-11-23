/**
 * QA snapshot tool (dev only). Drives the locally installed Edge/Chrome via playwright-core.
 *
 *   node scripts/qa-snapshot.mjs <baseUrl> <outDir> [--reduced] [--no-webgl] [--3d | --off] [--only=desktop-en]
 *
 * Captures full-page screenshots for desktop/tablet/mobile x EN/AR and writes report.json with
 * console errors, page errors, failed requests, document height and basic a11y facts.
 * Writes only into <outDir>; never touches project files.
 */
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const [, , baseUrl = "http://localhost:3100/", outDir = "qa-out", ...flags] = process.argv;
const reduced = flags.includes("--reduced");
const noWebgl = flags.includes("--no-webgl");
const want3d = flags.includes("--3d");
const wantOff = flags.includes("--off");
const only = (flags.find((f) => f.startsWith("--only=")) || "").slice(7);

const CANDIDATES = [
  process.env.QA_BROWSER,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
].filter(Boolean);
const executablePath = CANDIDATES.find((p) => fs.existsSync(p));
if (!executablePath) throw new Error("No Chromium-based browser found; set QA_BROWSER");

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, isMobile: false, hasTouch: false },
  tablet: { width: 834, height: 1112, isMobile: true, hasTouch: true },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true },
};

fs.mkdirSync(outDir, { recursive: true });
const args = ["--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];
if (noWebgl) args.push("--disable-webgl", "--disable-3d-apis");
const browser = await chromium.launch({ executablePath, headless: true, args });
const report = [];

for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
  for (const locale of ["en", "ar"]) {
    const id = `${vpName}-${locale}`;
    if (only && only !== id) continue;
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
      deviceScaleFactor: 1,
      reducedMotion: reduced ? "reduce" : "no-preference",
    });
    await ctx.addInitScript(
      ([loc, threeD]) => {
        try {
          localStorage.setItem("excelsa_locale", loc);
          if (threeD) localStorage.setItem("excelsa_motion", threeD);
          // skip the intro in automated snapshots so content is visible
          sessionStorage.setItem("excelsa_intro_seen", "1");
        } catch {}
      },
      [locale, want3d ? "on" : wantOff ? "off" : ""]
    );
    const page = await ctx.newPage();
    const entry = { id, consoleErrors: [], pageErrors: [], failedRequests: [] };
    page.on("console", (m) => m.type() === "error" && entry.consoleErrors.push(m.text().slice(0, 300)));
    page.on("pageerror", (e) => entry.pageErrors.push(String(e).slice(0, 300)));
    page.on("requestfailed", (r) => entry.failedRequests.push(`${r.url()} ${r.failure()?.errorText}`));
    page.on("response", (r) => r.status() >= 400 && entry.failedRequests.push(`${r.status()} ${r.url()}`));
    await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(1500);
    // scroll through to trigger in-view animations / lazy scenes, then back to top
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += Math.round(vp.height * 0.8)) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    Object.assign(
      entry,
      await page.evaluate(() => ({
        dir: document.documentElement.dir,
        lang: document.documentElement.lang,
        data3d: document.documentElement.dataset.threeD ?? document.documentElement.getAttribute("data-3d"),
        height: document.documentElement.scrollHeight,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        canvases: document.querySelectorAll("canvas").length,
        sections: [...document.querySelectorAll("section[id]")].map((s) => s.id),
        forms: document.querySelectorAll("form").length,
        buttonsWithoutName: [...document.querySelectorAll("button")].filter(
          (b) => !(b.innerText.trim() || b.getAttribute("aria-label") || b.getAttribute("title"))
        ).length,
        imgsWithoutAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
      }))
    );
    await page.screenshot({ path: path.join(outDir, `${id}.png`), fullPage: true });
    await page.screenshot({ path: path.join(outDir, `${id}-fold.png`) });
    report.push(entry);
    await ctx.close();
  }
}
await browser.close();
fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
const bad = report.filter((r) => r.pageErrors.length || r.consoleErrors.length || r.horizontalOverflow);
console.log(JSON.stringify(report.map(({ id, dir, data3d, height, canvases, horizontalOverflow, consoleErrors, pageErrors, failedRequests, buttonsWithoutName }) => ({ id, dir, data3d, height, canvases, horizontalOverflow, consoleErrors: consoleErrors.length, pageErrors: pageErrors.length, failed: failedRequests.length, buttonsWithoutName }))));
if (bad.length) console.log("ISSUES:", JSON.stringify(bad.map((b) => ({ id: b.id, c: b.consoleErrors, p: b.pageErrors, f: b.failedRequests })), null, 1));
