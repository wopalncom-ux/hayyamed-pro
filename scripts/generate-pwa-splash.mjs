/**
 * Generates PWA splash screens and a proper maskable icon.
 * Run once from the project root:  node scripts/generate-pwa-splash.mjs
 *
 * Outputs:
 *   public/splash/splash-1290x2796.png  iPhone 14 Pro Max
 *   public/splash/splash-1170x2532.png  iPhone 14 / 13 / 12
 *   public/splash/splash-750x1334.png   iPhone SE / 8
 *   public/splash/splash-2048x2732.png  iPad Pro 12.9"
 *   public/icons/icon-192-maskable.png  PWA maskable icon (20% safe zone)
 *   public/screenshots/screenshot-mobile.png   390×844 placeholder
 *   public/screenshots/screenshot-tablet.png  1024×1366 placeholder
 */
import { createRequire } from "module";
import { mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = join(__dirname, "..");

// Resolve sharp from Next.js's own node_modules if not a direct dependency
const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require("sharp");
} catch {
  try {
    sharp = require(join(root, "node_modules", "sharp"));
  } catch {
    console.error("❌ sharp not found. Run: npm install --save-dev sharp");
    process.exit(1);
  }
}

mkdirSync(join(root, "public", "splash"),       { recursive: true });
mkdirSync(join(root, "public", "icons"),         { recursive: true });
mkdirSync(join(root, "public", "screenshots"),   { recursive: true });

const BG     = "#1a56a0";
const BG_RGB = { r: 26, g: 86, b: 160 };

function splashSvg(w, h) {
  const unit   = Math.min(w, h);
  const boxS   = unit * 0.22;
  const boxX   = w / 2 - boxS / 2;
  const boxY   = h / 2 - boxS / 2 - unit * 0.04;
  const radius = boxS * 0.22;
  const fontSize  = boxS * 0.58;
  const textY     = h / 2 + fontSize * 0.35 - unit * 0.04;
  const subSize   = unit * 0.028;
  const subY      = h / 2 + boxS / 2 + subSize * 1.8;

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
       <rect width="${w}" height="${h}" fill="${BG}"/>
       <rect x="${boxX}" y="${boxY}" width="${boxS}" height="${boxS}"
         rx="${radius}" fill="white" fill-opacity="0.18"/>
       <text x="${w / 2}" y="${textY}"
         text-anchor="middle"
         font-family="-apple-system,BlinkMacSystemFont,Helvetica Neue,sans-serif"
         font-weight="700" font-size="${fontSize}" fill="white">H</text>
       <text x="${w / 2}" y="${subY}"
         text-anchor="middle"
         font-family="-apple-system,BlinkMacSystemFont,Helvetica Neue,sans-serif"
         font-weight="600" font-size="${subSize}" fill="rgba(255,255,255,0.55)"
         letter-spacing="3">HAYYA MED PRO</text>
     </svg>`
  );
}

function maskableSvg(size) {
  // 20 % safe zone on each side → inner icon area = 60 % of total
  const pad    = size * 0.2;
  const inner  = size - pad * 2;
  const radius = inner * 0.24;
  const fSize  = inner * 0.5;
  const cx     = size / 2;
  const cy     = size / 2;

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
       <rect width="${size}" height="${size}" fill="${BG}"/>
       <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}"
         rx="${radius}" fill="white" fill-opacity="0.18"/>
       <text x="${cx}" y="${cy + fSize * 0.35}"
         text-anchor="middle"
         font-family="-apple-system,BlinkMacSystemFont,Helvetica Neue,sans-serif"
         font-weight="700" font-size="${fSize}" fill="white">H</text>
     </svg>`
  );
}

function screenshotSvg(w, h) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
       <rect width="${w}" height="${h}" fill="#f8fafc"/>
       <rect width="${w}" height="${Math.round(h * 0.12)}" fill="${BG}"/>
       <text x="${w / 2}" y="${Math.round(h * 0.07)}"
         text-anchor="middle"
         font-family="-apple-system,BlinkMacSystemFont,sans-serif"
         font-weight="700" font-size="${Math.round(w * 0.045)}" fill="white">Hayya Med Pro</text>
       <rect x="${w * 0.08}" y="${h * 0.15}" width="${w * 0.84}" height="${h * 0.18}"
         rx="12" fill="white" stroke="#e2e8f0" stroke-width="1"/>
       <text x="${w / 2}" y="${h * 0.245}"
         text-anchor="middle"
         font-family="-apple-system,BlinkMacSystemFont,sans-serif"
         font-weight="600" font-size="${w * 0.042}" fill="#0f172a">CME Compliance Wallet</text>
       <text x="${w / 2}" y="${h * 0.285}"
         text-anchor="middle"
         font-family="-apple-system,BlinkMacSystemFont,sans-serif"
         font-size="${w * 0.03}" fill="#64748b">Track your credits automatically</text>
       <rect x="${w * 0.08}" y="${h * 0.36}" width="${w * 0.84}" height="${h * 0.48}"
         rx="12" fill="white" stroke="#e2e8f0" stroke-width="1"/>
       <text x="${w / 2}" y="${h * 0.59}"
         text-anchor="middle"
         font-family="-apple-system,BlinkMacSystemFont,sans-serif"
         font-weight="700" font-size="${w * 0.12}" fill="${BG}">72%</text>
       <text x="${w / 2}" y="${h * 0.64}"
         text-anchor="middle"
         font-family="-apple-system,BlinkMacSystemFont,sans-serif"
         font-size="${w * 0.03}" fill="#64748b">On Track</text>
     </svg>`
  );
}

async function make(svgBuf, outPath, fallbackW, fallbackH) {
  try {
    await sharp(svgBuf).png({ quality: 90 }).toFile(outPath);
  } catch {
    // Fallback: solid blue PNG (no SVG support in this sharp build)
    await sharp({
      create: { width: fallbackW, height: fallbackH, channels: 3, background: BG_RGB },
    }).png().toFile(outPath);
  }
}

const SPLASHES = [
  { name: "splash-1290x2796.png", w: 1290, h: 2796 },
  { name: "splash-1170x2532.png", w: 1170, h: 2532 },
  { name: "splash-750x1334.png",  w: 750,  h: 1334 },
  { name: "splash-2048x2732.png", w: 2048, h: 2732 },
];

console.log("\n🎨 Generating PWA splash screens…");
for (const { name, w, h } of SPLASHES) {
  const out = join(root, "public", "splash", name);
  await make(splashSvg(w, h), out, w, h);
  console.log(`  ✓ public/splash/${name}  (${w}×${h})`);
}

console.log("\n🔵 Generating maskable icon…");
await make(
  maskableSvg(512),
  join(root, "public", "icons", "icon-512-maskable.png"),
  512, 512
);
await make(
  maskableSvg(192),
  join(root, "public", "icons", "icon-192-maskable.png"),
  192, 192
);
console.log("  ✓ public/icons/icon-192-maskable.png");
console.log("  ✓ public/icons/icon-512-maskable.png");

console.log("\n📸 Generating screenshot placeholders…");
await make(
  screenshotSvg(390, 844),
  join(root, "public", "screenshots", "screenshot-mobile.png"),
  390, 844
);
await make(
  screenshotSvg(1024, 1366),
  join(root, "public", "screenshots", "screenshot-tablet.png"),
  1024, 1366
);
console.log("  ✓ public/screenshots/screenshot-mobile.png  (390×844)");
console.log("  ✓ public/screenshots/screenshot-tablet.png  (1024×1366)");

console.log("\n✅ Done! Replace screenshots with real device captures before App Store submission.\n");
