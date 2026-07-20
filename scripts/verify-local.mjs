import { chromium } from "playwright";
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const root = path.join(process.cwd(), "out");
const screenshots = path.join(process.cwd(), "screenshots");
await mkdir(screenshots, { recursive: true });

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1");
  const cleanPath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  const candidates = cleanPath
    ? [path.join(root, cleanPath), path.join(root, cleanPath, "index.html"), path.join(root, `${cleanPath}.html`)]
    : [path.join(root, "index.html")];

  for (const file of candidates) {
    try {
      const info = await stat(file);
      if (!info.isFile()) continue;
      res.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
      createReadStream(file).pipe(res);
      return;
    } catch {}
  }

  res.statusCode = 404;
  res.end("Not found");
});

await new Promise((resolve) => server.listen(4173, "127.0.0.1", resolve));

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (error) => consoleErrors.push(error.message));

await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.evaluate(async () => {
  for (const image of Array.from(document.images)) {
    image.loading = "eager";
    image.scrollIntoView({ block: "center" });
    await new Promise((resolve) => setTimeout(resolve, 80));
  }
  window.scrollTo(0, 0);
});
await page.screenshot({ path: path.join(screenshots, "velvet-desktop.png"), fullPage: true });

const desktop = await page.evaluate(() => ({
  title: document.title,
  h1: document.querySelector("h1")?.textContent?.trim() || "",
  oldBrandHits: document.body.innerText.match(/Al-Baghd|Baghdady|Iraqi|Richardson|Dallas|halal|baklava|samoon|kunafa/gi)?.length || 0,
  imageCount: document.images.length,
  brokenImages: Array.from(document.images).filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.getAttribute("src")),
  bookingLinks: Array.from(document.querySelectorAll("a[href*='janeapp.com']")).length,
}));

await page.setViewportSize({ width: 390, height: 900 });
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.evaluate(async () => {
  for (const image of Array.from(document.images)) {
    image.loading = "eager";
    image.scrollIntoView({ block: "center" });
    await new Promise((resolve) => setTimeout(resolve, 80));
  }
  window.scrollTo(0, 0);
});
await page.screenshot({ path: path.join(screenshots, "velvet-mobile.png"), fullPage: true });

const mobile = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  h1: document.querySelector("h1")?.textContent?.trim() || "",
}));

await browser.close();
server.close();

const result = { desktop, mobile, consoleErrors };
console.log(JSON.stringify(result, null, 2));

if (desktop.brokenImages.length || desktop.oldBrandHits || mobile.scrollWidth > mobile.clientWidth || consoleErrors.length) {
  process.exitCode = 1;
}
