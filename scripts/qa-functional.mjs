/**
 * Functional regression test of the EXISTING site features, with the 3D layer on and off.
 * Dev only (playwright-core + local Edge/Chrome). Usage:
 *   node scripts/qa-functional.mjs <baseUrl> [--mobile]
 * Exercises: tasting modal (button + 3D event), category filter, catering wizard end-to-end
 * (POST /api/catering), navbar anchor scrolling, language toggle, mobile maps chooser,
 * and Explore mode when 3D is on.
 */
import { chromium } from "playwright-core";
import fs from "node:fs";

const [, , baseUrl = "http://localhost:3100/", ...flags] = process.argv;
const mobile = flags.includes("--mobile");
const exe = [process.env.QA_BROWSER, "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Google/Chrome/Application/chrome.exe"].find(
  (p) => p && fs.existsSync(p)
);
const browser = await chromium.launch({ executablePath: exe, headless: true });
const results = [];

async function run(mode) {
  const ctx = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    isMobile: mobile,
    hasTouch: mobile,
  });
  await ctx.addInitScript(() => {
    // count AudioContext creation: sound must never start without a user gesture
    window.__audioCtxCount = 0;
    const AC = window.AudioContext;
    if (AC) window.AudioContext = class extends AC { constructor(...a) { super(...a); window.__audioCtxCount++; } };
  });
  await ctx.addInitScript((m) => {
    try {
      localStorage.setItem("excelsa_motion", m);
      localStorage.setItem("excelsa_locale", "en");
      sessionStorage.setItem("excelsa_intro_seen", "1");
    } catch {}
  }, mode);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("dialog", (d) => {
    errors.push(`unexpected dialog: ${d.message()}`);
    d.dismiss();
  });
  const check = async (name, fn) => {
    try {
      await fn();
      results.push({ mode, mobile, name, ok: true });
    } catch (e) {
      results.push({ mode, mobile, name, ok: false, error: String(e).split("\n")[0].slice(0, 240) });
    }
  };
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  /** In single-screen 3D mode, sections live in the reading view: travel there via the Index. */
  const reveal = async (sectionId, label) => {
    if (mode !== "on") {
      await page.locator("#" + sectionId).scrollIntoViewIfNeeded();
      return;
    }
    await page.locator('header button[aria-haspopup="dialog"]').click();
    await page.locator("#site-index button", { hasText: label }).first().click();
    await page.locator(".xp-card button").first().click();
    await page.waitForFunction(() => document.documentElement.getAttribute("data-panel") === "open", null, { timeout: 4000 });
    await page.waitForTimeout(700);
  };

  await check("3d state", async () => {
    const v = await page.evaluate(() => document.documentElement.getAttribute("data-3d"));
    if ((mode === "on") !== (v === "on")) throw new Error(`data-3d=${v}`);
  });

  await check("no audio before user gesture", async () => {
    const n = await page.evaluate(() => window.__audioCtxCount);
    if (n !== 0) throw new Error(`AudioContext created ${n}x without a gesture`);
  });

  if (mode === "on" && !mobile) {
    await check("sound toggle starts audio only on click (aria-pressed)", async () => {
      const btn = page.locator('header button[aria-label^="Sound"]');
      await btn.click();
      await page.waitForTimeout(300);
      const n = await page.evaluate(() => window.__audioCtxCount);
      const pressed = await btn.getAttribute("aria-pressed");
      if (n !== 1 || pressed !== "true") throw new Error(`ctx=${n} pressed=${pressed}`);
      await btn.click();
      if ((await btn.getAttribute("aria-pressed")) !== "false") throw new Error("did not turn off");
    });
  }

  await check("tasting modal via card button", async () => {
    await reveal("menu", "Tasting guide");
    await page.locator("#menu button", { hasText: "Tasting Notes & Origin" }).first().click();
    await page.locator('main [role="dialog"][aria-modal="true"]').waitFor({ state: "visible", timeout: 5000 });
    await page.locator('button[aria-label="Close modal"]').click();
    await page.locator('main [role="dialog"][aria-modal="true"]').waitFor({ state: "detached", timeout: 5000 });
  });

  await check("tasting modal via 3D event", async () => {
    await page.evaluate(() => window.dispatchEvent(new CustomEvent("excelsa:open-tasting", { detail: { id: "po-01" } })));
    const dlg = page.locator('main [role="dialog"][aria-modal="true"]');
    await dlg.waitFor({ state: "visible", timeout: 5000 });
    const txt = await dlg.innerText();
    if (!txt.includes("V60 Geisha Reserve")) throw new Error("wrong item in modal");
    await page.locator('button[aria-label="Close modal"]').click();
    await dlg.waitFor({ state: "detached", timeout: 5000 });
  });

  await check("category filter", async () => {
    await page.locator("#menu button", { hasText: "Espresso Bar" }).click();
    await page.waitForTimeout(300);
    const n = await page.locator("#menu button", { hasText: "Tasting Notes & Origin" }).count();
    if (n !== 3) throw new Error(`expected 3 espresso cards, got ${n}`);
    await page.locator("#menu button", { hasText: "All Offerings" }).click();
  });

  await check("catering wizard end-to-end (POST /api/catering)", async () => {
    const c = page.locator("#catering");
    await reveal("catering", "Event catering");
    await c.locator("button", { hasText: "Continue to Packages" }).click();
    await c.locator('button[aria-label="Increase quantity"]').first().click();
    await c.locator("button", { hasText: "Venue & Contact Details" }).click();
    await c.locator('input[type="date"]').fill("2026-12-20");
    await c.locator("select").selectOption("Al Waab");
    await c.locator('input[type="text"]').first().fill("QA Test (automated)");
    await c.locator('input[type="tel"]').fill("+974 5106 1111");
    const resp = page.waitForResponse((r) => r.url().includes("/api/catering") && r.request().method() === "POST", { timeout: 15000 });
    await c.locator('button[type="submit"]').click();
    const r = await resp;
    if (r.status() !== 200) throw new Error(`api status ${r.status()}`);
    const body = await r.json();
    if (!body.success || !String(body.referenceId).startsWith("EXC-")) throw new Error("bad api body");
    await c.getByText("Inquiry Received").waitFor({ timeout: 5000 });
  });

  if (!mobile) {
    await check("header 'Book catering' link reaches the catering section", async () => {
      await page.keyboard.press("Escape");
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      await page.locator('header a[href="#catering"]').click();
      await page.waitForTimeout(2500);
      if (mode === "on") {
        const st = await page.evaluate(() => [document.documentElement.getAttribute("data-area"), document.documentElement.getAttribute("data-panel")]);
        if (st[0] !== "catering" || st[1] !== "open") throw new Error("area/panel = " + st);
      } else {
        const top = await page.evaluate(() => document.getElementById("catering").getBoundingClientRect().top);
        if (Math.abs(top) > 140) throw new Error("#catering top=" + top);
      }
    });
  }

  await check("language toggle -> RTL and back", async () => {
    await page.evaluate(() => window.scrollTo(0, 0));
    const btn = mobile ? page.locator("header button:visible", { hasText: "عربي" }) : page.locator('header button[title="Switch Language"]');
    await btn.first().click();
    await page.waitForFunction(() => document.documentElement.dir === "rtl", null, { timeout: 4000 });
    const back = mobile ? page.locator("header button:visible", { hasText: "EN" }) : page.locator('header button[title="Switch Language"]');
    await back.first().click();
    await page.waitForFunction(() => document.documentElement.dir === "ltr", null, { timeout: 4000 });
  });

  if (mobile) {
    await check("mobile one-tap maps chooser", async () => {
      await page.locator('aside[aria-label="Quick Action Bar"] button', { hasText: "Directions" }).click();
      await page.getByText("Choose Your Maps App").waitFor({ timeout: 4000 });
      await page.locator('a', { hasText: "Google Maps" }).first().waitFor();
      await page.keyboard.press("Escape");
    });
  }

  if (mode === "on") {
    await check("single-screen: travel, point of interest, tasting modal from the 3D bar", async () => {
      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await page.waitForFunction(() => document.querySelector(".xp-canvas")?.getAttribute("data-ready") === "true", null, { timeout: 30000 });
      const next = page.locator(".xp-bar button").last();
      await next.click();
      await next.click();
      await page.waitForFunction(() => document.documentElement.getAttribute("data-area") === "menu", null, { timeout: 4000 });
      await page.waitForTimeout(3500); // camera flight
      const pin = page.locator(".xp-pin:visible").first();
      await pin.waitFor({ state: "visible", timeout: 6000 }).catch((e) => { throw new Error("pin: " + e.message.split("\n")[0]); });
      if (mobile) await pin.tap({ force: true });
      else await pin.click({ force: true });
      await page.locator(".xp-poi").waitFor({ state: "visible", timeout: 4000 });
      await page.locator(".xp-poi button", { hasText: "Tasting Notes & Origin" }).click();
      await page.locator('main [role="dialog"][aria-modal="true"]').waitFor({ state: "visible", timeout: 5000 });
      await page.locator('button[aria-label="Close modal"]').click();
      await page.keyboard.press("Escape");
      await page.locator(".xp-poi").waitFor({ state: "detached", timeout: 4000 });
    });
  }

  if (mode === "on" && !mobile) {
    await check("single-screen keyboard: arrows travel, Enter opens reading view, Esc returns focus, Tab to pins", async () => {
      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await page.waitForFunction(() => document.querySelector(".xp-canvas")?.getAttribute("data-ready") === "true", null, { timeout: 30000 });
      await page.keyboard.press("ArrowRight");
      await page.waitForFunction(() => document.documentElement.getAttribute("data-area") === "story", null, { timeout: 3000 });
      const primary = page.locator(".xp-card button").first();
      await primary.focus();
      await page.keyboard.press("Enter");
      await page.waitForFunction(() => document.documentElement.getAttribute("data-panel") === "open", null, { timeout: 3000 });
      await page.waitForTimeout(300);
      const inPanel = await page.evaluate(() => !!document.activeElement?.closest("#story"));
      if (!inPanel) throw new Error("focus did not move into the reading view");
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => !document.documentElement.hasAttribute("data-panel"), null, { timeout: 3000 });
      await page.waitForTimeout(200);
      const back = await page.evaluate(() => !!document.activeElement?.closest(".xp-card"));
      if (!back) throw new Error("focus not returned to the area card");
      await page.waitForTimeout(2500);
      let onPin = false;
      for (let i = 0; i < 10 && !onPin; i++) {
        await page.keyboard.press("Tab");
        onPin = await page.evaluate(() => document.activeElement?.classList.contains("xp-pin") ?? false);
      }
      if (!onPin) throw new Error("could not Tab to a point of interest");
      await page.keyboard.press("Enter");
      await page.locator(".xp-poi").waitFor({ state: "visible", timeout: 3000 });
      await page.keyboard.press("Escape");
    });
    await check("drag-to-look changes the view", async () => {
      await page.waitForTimeout(800);
      const a = await page.screenshot();
      await page.mouse.move(1000, 520);
      await page.mouse.down();
      await page.mouse.move(760, 460, { steps: 12 });
      await page.mouse.up();
      await page.waitForTimeout(1200);
      const b2 = await page.screenshot();
      if (Buffer.compare(a, b2) === 0) throw new Error("view did not change after drag");
    });
  }

  if (mode === "on") {
    await check("WebGL context loss falls back to the classic site", async () => {
      await page.reload({ waitUntil: "networkidle" });
      await page.waitForFunction(() => document.querySelector(".xp-canvas")?.getAttribute("data-ready") === "true", null, { timeout: 30000 });
      await page.evaluate(() => {
        const c = document.querySelector(".xp-canvas canvas");
        const gl = c.getContext("webgl2") || c.getContext("webgl");
        gl.getExtension("WEBGL_lose_context").loseContext();
      });
      await page.waitForFunction(() => !document.documentElement.hasAttribute("data-3d") && !document.querySelector(".xp-canvas"), null, { timeout: 5000 });
      // classic site still fully usable
      await page.locator("#menu").scrollIntoViewIfNeeded();
      await page.locator("#menu button", { hasText: "Tasting Notes & Origin" }).first().click();
      await page.locator('[role="dialog"][aria-modal="true"]').waitFor({ state: "visible", timeout: 5000 });
      await page.locator('button[aria-label="Close modal"]').click();
      // the context-loss warning three.js logs is expected here
      for (let i = errors.length - 1; i >= 0; i--) if (/context lost/i.test(errors[i])) errors.splice(i, 1);
    });
  }

  if (errors.length) results.push({ mode, mobile, name: "console/page errors", ok: false, error: errors.slice(0, 5).join(" | ") });
  await ctx.close();
}

for (const mode of ["on", "off"]) await run(mode);
await browser.close();
const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  [3d=${r.mode}${r.mobile ? ", mobile" : ""}] ${r.name}${r.ok ? "" : ` -> ${r.error}`}`);
console.log(`${results.length - failed.length}/${results.length} passed`);
process.exitCode = failed.length ? 1 : 0;
