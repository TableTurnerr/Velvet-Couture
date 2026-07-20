import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import { join, parse } from "node:path";

const IMAGES_DIR = new URL("../public/Images/", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

const TARGETS = {
  "hero.jpg":   { width: 1600, quality: 78 },
  "bakery.jpg": { width: 1400, quality: 78 },
  "dish-1.jpg": { width: 1200, quality: 78 },
  "dish-2.jpg": { width: 1200, quality: 78 },
  "dish-3.jpg": { width: 1200, quality: 78 },
  "dish-4.jpg": { width: 1200, quality: 78 },
  "logo.jpg":   { width: 400,  quality: 88 },
};

const fmt = (b) => (b / 1024).toFixed(1) + " KB";

async function main() {
  const entries = await readdir(IMAGES_DIR);
  console.log("Source:", IMAGES_DIR);
  console.log("Files:", entries.join(", "));

  let totalIn = 0, totalOut = 0;

  for (const file of entries) {
    const cfg = TARGETS[file];
    if (!cfg) continue;
    const inPath = join(IMAGES_DIR, file);
    const { name } = parse(file);
    const outPath = join(IMAGES_DIR, `${name}.webp`);

    const inStat = await stat(inPath);
    totalIn += inStat.size;

    await sharp(inPath)
      .rotate()
      .resize({ width: cfg.width, withoutEnlargement: true })
      .webp({ quality: cfg.quality, effort: 6, smartSubsample: true })
      .toFile(outPath);

    const outStat = await stat(outPath);
    totalOut += outStat.size;
    const saved = (1 - outStat.size / inStat.size) * 100;
    console.log(`${file.padEnd(14)} -> ${name}.webp  ${fmt(inStat.size).padStart(10)} -> ${fmt(outStat.size).padStart(10)}  (-${saved.toFixed(0)}%)`);
  }

  console.log(`\nTotal: ${fmt(totalIn)} -> ${fmt(totalOut)}  (-${((1 - totalOut / totalIn) * 100).toFixed(0)}%)`);

  console.log("\nRemoving source .jpg files (logo.jpg kept until references are updated)...");
  for (const file of entries) {
    if (!TARGETS[file]) continue;
    if (file === "logo.jpg") continue;
    await unlink(join(IMAGES_DIR, file));
    console.log(`  removed ${file}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
