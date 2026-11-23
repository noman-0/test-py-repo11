/**
 * Renders the ILLUSTRATIVE menu stand-in images (dev tool).
 *
 *   node scripts/render-standins.mjs [--force]
 *
 * - Bundles scripts/standins/studio.tsx with esbuild (fetched via npx, not a project dependency)
 * - Serves it with /public on a temporary local port
 * - Captures each menu item from src/data/menuData.ts with the locally installed Edge/Chrome
 * - Writes to the EXACT image paths menuData already references (public/images/*.webp)
 * - NEVER overwrites an existing file unless --force (so client photos are safe)
 */
import { chromium } from "playwright-core";
import { execSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";

const force = process.argv.includes("--force");
const root = process.cwd();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "excelsa-standins-"));

// menu item id -> image path, read from the existing data file (single source of truth)
const menuSrc = fs.readFileSync(path.join(root, "src/data/menuData.ts"), "utf8");
const items = [...menuSrc.matchAll(/id:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"/g)].map((m) => ({ id: m[1], image: m[2] }));
if (!items.length) throw new Error("no menu items found");

console.log("bundling studio…");
execSync(
  `npx -y esbuild@0.24.0 scripts/standins/studio.tsx --bundle --format=esm --jsx=automatic --minify --log-level=error --define:process.env.NODE_ENV="\\"production\\"" --outfile="${path.join(tmp, "studio.js")}"`,
  { stdio: "inherit", cwd: root }
);
fs.writeFileSync(
  path.join(tmp, "studio.html"),
  `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:transparent}</style></head><body><div id="root"></div><script type="module" src="/studio.js"></script></body></html>`
);

const types = { ".js": "text/javascript", ".html": "text/html", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg" };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = p === "/studio.html" || p === "/studio.js" ? path.join(tmp, p) : path.join(root, "public", p);
  if (!file.startsWith(tmp) && !file.startsWith(path.join(root, "public"))) return res.writeHead(403).end();
  fs.readFile(file, (err, buf) => {
    if (err) return res.writeHead(404).end();
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" }).end(buf);
  });
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;

const exe = [process.env.QA_BROWSER, "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Google/Chrome/Application/chrome.exe"].find(
  (p) => p && fs.existsSync(p)
);
const browser = await chromium.launch({ executablePath: exe, headless: true, args: ["--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
page.on("pageerror", (e) => console.error("page error:", String(e)));

for (const { id, image } of items) {
  const out = path.join(root, "public", image);
  if (fs.existsSync(out) && !force) {
    console.log(`skip (exists): ${image}`);
    continue;
  }
  await page.goto(`http://127.0.0.1:${port}/studio.html?id=${encodeURIComponent(id)}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
  await page.waitForTimeout(400);
  const dataUrl = await page.evaluate(() => window.__capture());
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(dataUrl.split(",")[1], "base64"));
  console.log(`wrote ${image} (${Math.round(fs.statSync(out).size / 1024)} KB)`);
}

await browser.close();
server.close();
fs.rmSync(tmp, { recursive: true, force: true });
