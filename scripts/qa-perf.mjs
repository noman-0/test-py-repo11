/**
 * Frame-rate probe for the 3D experience (dev only; local Edge/Chrome via playwright-core).
 *   node scripts/qa-perf.mjs <baseUrl>
 * Scrolls the whole journey for ~10 s and samples requestAnimationFrame timing + long tasks,
 * on desktop (no throttle) and on a phone viewport with 4x CPU throttling. Reports the quality
 * tier the device detection chose.
 */
import { chromium } from "playwright-core";
import fs from "node:fs";

const [, , baseUrl = "http://localhost:3100/", modeArg] = process.argv;
const MODE = modeArg === "--off" ? "off" : "on";
const exe = [process.env.QA_BROWSER, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(
  (p) => p && fs.existsSync(p)
);
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ["--ignore-gpu-blocklist"] });

async function probe(name, { viewport, mobile, cpu }) {
  const ctx = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile });
  await ctx.addInitScript((mode) => {
    localStorage.setItem("excelsa_motion", mode);
    sessionStorage.setItem("excelsa_intro_seen", "1");
  }, MODE);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  if (MODE === "on") await page.waitForFunction(() => document.querySelector(".xp-canvas")?.getAttribute("data-ready") === "true", null, { timeout: 60000 });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(async () => {
    const frames = [];
    const longTasks = [];
    const po = new PerformanceObserver((l) => l.getEntries().forEach((e) => longTasks.push(e.duration)));
    try {
      po.observe({ type: "longtask", buffered: false });
    } catch {}
    const H = document.documentElement.scrollHeight - innerHeight;
    const dur = 10000;
    const t0 = performance.now();
    let last = t0;
    await new Promise((res) => {
      const tick = (t) => {
        frames.push(t - last);
        last = t;
        const p = Math.min(1, (t - t0) / dur);
        window.scrollTo(0, H * p);
        if (p < 1) requestAnimationFrame(tick);
        else res();
      };
      requestAnimationFrame(tick);
    });
    po.disconnect();
    frames.shift();
    const sorted = [...frames].sort((a, b) => a - b);
    const avg = frames.reduce((a, b) => a + b, 0) / frames.length;
    return {
      fpsAvg: +(1000 / avg).toFixed(1),
      fpsP5: +(1000 / sorted[Math.floor(sorted.length * 0.95)]).toFixed(1),
      frames: frames.length,
      longTasks: longTasks.length,
      longTaskMaxMs: Math.round(Math.max(0, ...longTasks)),
      canvasPx: (() => {
        const c = document.querySelector(".xp-canvas canvas");
        return c ? `${c.width}x${c.height}` : "none";
      })(),
    };
  });
  console.log(`[3d=${MODE}] ${name}`, JSON.stringify(r));
  await ctx.close();
}

await probe("desktop 1440x900 (no throttle)", { viewport: { width: 1440, height: 900 }, mobile: false, cpu: 1 });
await probe("phone 390x844 (4x CPU throttle)", { viewport: { width: 390, height: 844 }, mobile: true, cpu: 4 });
await browser.close();
