#!/usr/bin/env node
/**
 * fetch-instagram-thumb.mjs
 * Downloads an Instagram post/reel thumbnail via yt-dlp, converts to WebP with sharp.
 *
 * Usage:
 *   node scripts/fetch-instagram-thumb.mjs <url> <slot> [caption words...]
 *
 * Slot accepts: 1-6, "top left", "top center", "top right",
 *               "bottom left", "bottom center", "bottom right"
 *
 * Outputs to: public/Images/instagram/post-{slotNum}.webp
 * Prints machine-readable lines:
 *   SLOT_INDEX=<0-5>
 *   SLOT_FILE=/Images/instagram/post-{slotNum}.webp
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync, readdirSync, unlinkSync } from "fs";
import { resolve } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// ── Argument parsing ──────────────────────────────────────────────────────────

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(
    "Usage: node scripts/fetch-instagram-thumb.mjs <url> <slot> [caption...]"
  );
  process.exit(1);
}

const url = args[0];
// Everything from args[1] that isn't clearly part of the caption
// Slot can be multi-word ("top left") — we need to detect where it ends.
// Strategy: consume words until we've matched a slot token.
const SLOT_MAP = {
  "1": 0, "slot1": 0, "topleft": 0, "top-left": 0,
  "2": 1, "slot2": 1, "topcenter": 1, "top-center": 1,
  "3": 2, "slot3": 2, "topright": 2, "top-right": 2,
  "4": 3, "slot4": 3, "bottomleft": 3, "bottom-left": 3,
  "5": 4, "slot5": 4, "bottomcenter": 4, "bottom-center": 4,
  "6": 5, "slot6": 5, "bottomright": 5, "bottom-right": 5,
};

function parseSlot(words) {
  // Try single word first, then two words joined
  const single = words[0]?.toLowerCase().replace(/\s+/g, "");
  if (single !== undefined && SLOT_MAP[single] !== undefined)
    return { index: SLOT_MAP[single], consumed: 1 };
  if (words.length >= 2) {
    const double = (words[0] + words[1]).toLowerCase().replace(/\s+/g, "");
    if (SLOT_MAP[double] !== undefined)
      return { index: SLOT_MAP[double], consumed: 2 };
  }
  return null;
}

const slotWords = args.slice(1);
const parsed = parseSlot(slotWords);
if (!parsed) {
  console.error(
    `Unknown slot: "${slotWords.slice(0, 2).join(" ")}". ` +
      `Use 1–6, "top left", "bottom right", etc.`
  );
  process.exit(1);
}

const slotIndex = parsed.index;
const slotNum = slotIndex + 1;

// ── Paths ─────────────────────────────────────────────────────────────────────

const outDir = resolve("public/Images/instagram");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const tempBase = resolve("_insta_thumb_temp");
const outWebp = resolve(outDir, `post-${slotNum}.webp`);

// ── Download with yt-dlp ──────────────────────────────────────────────────────

// Clean up any leftover temp files from previous runs
for (const f of readdirSync(".").filter((n) => n.startsWith("_insta_thumb_temp"))) {
  try { unlinkSync(f); } catch {}
}

console.log(`[fetch-instagram-thumb] Downloading thumbnail for slot ${slotNum}…`);

try {
  execSync(
    `yt-dlp --write-thumbnail --skip-download --no-playlist -o "${tempBase}" "${url}"`,
    { stdio: "inherit" }
  );
} catch (err) {
  console.error(
    "\nyt-dlp failed. Is it installed?\n" +
      "  pip install yt-dlp\n" +
      "  OR: https://github.com/yt-dlp/yt-dlp/releases\n"
  );
  process.exit(1);
}

// Find the downloaded thumbnail file (yt-dlp appends the real extension)
const thumbFile = readdirSync(".").find((n) => n.startsWith("_insta_thumb_temp"));
if (!thumbFile) {
  console.error("yt-dlp completed but no thumbnail file was found.");
  process.exit(1);
}

// ── Convert to WebP with sharp ────────────────────────────────────────────────

let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error("sharp not found — run `npm install` first.");
  unlinkSync(thumbFile);
  process.exit(1);
}

await sharp(thumbFile).webp({ quality: 85 }).toFile(outWebp);
unlinkSync(thumbFile);

console.log(`[fetch-instagram-thumb] Saved: public/Images/instagram/post-${slotNum}.webp`);

// Fetch the post caption (best-effort — does not abort on failure)
let shortCaption = "";
try {
  const raw = execSync(
    `yt-dlp --print description --no-playlist "${url}"`,
    { encoding: "utf8", stdio: ["inherit", "pipe", "pipe"] }
  ).trim();
  const words = raw.replace(/\n/g, " ").split(/\s+/).filter(Boolean);
  shortCaption = words.slice(0, 8).join(" ");
} catch {
  // caption is optional — silence the error
}

// Machine-readable output for the skill to parse
console.log(`SLOT_INDEX=${slotIndex}`);
console.log(`SLOT_FILE=/Images/instagram/post-${slotNum}.webp`);
console.log(`POST_CAPTION=${shortCaption}`);
