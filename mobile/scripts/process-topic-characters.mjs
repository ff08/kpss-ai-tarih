/**
 * topic-path PNG'lerinde düz siyah / çok koyu arka planı alfa ile kaldırır.
 * Kullanım: cd mobile && npm run process-characters
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSET_DIR = path.join(__dirname, "..", "assets", "topic-path");

/** Bu değerin altındaki RGB pikseller arka plan sayılır (0–255). */
const BG_THRESHOLD = 32;

async function processFile(filePath) {
  const img = sharp(filePath);
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const out = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const a = data[o + 3];
    out[o] = r;
    out[o + 1] = g;
    out[o + 2] = b;
    if (r <= BG_THRESHOLD && g <= BG_THRESHOLD && b <= BG_THRESHOLD) {
      out[o + 3] = 0;
    } else {
      out[o + 3] = a;
    }
  }
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(filePath + ".tmp");
  fs.renameSync(filePath + ".tmp", filePath);
  console.log("OK", path.basename(filePath));
}

const files = fs.existsSync(ASSET_DIR)
  ? fs.readdirSync(ASSET_DIR).filter((f) => f.endsWith(".png"))
  : [];

if (files.length === 0) {
  console.error("PNG bulunamadı:", ASSET_DIR);
  process.exit(1);
}

for (const f of files) {
  await processFile(path.join(ASSET_DIR, f));
}

console.log("Bitti:", files.length, "dosya");
