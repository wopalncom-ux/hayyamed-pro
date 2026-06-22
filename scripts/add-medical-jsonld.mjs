#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(__dirname, "..", "app");

const IMPORT_ANCHOR = `import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";`;
const IMPORT_TO_ADD = `import { MedicalWebPageJsonLd } from "@/components/seo/MedicalWebPageJsonLd";`;

function extractSecondBreadcrumb(src) {
  // Pattern 1: inline items array
  const block = src.match(/BreadcrumbJsonLd items=\{\[([\s\S]*?)\]\}/);
  if (block) {
    const items = [...block[1].matchAll(/\{\s*name:\s*"([^"]+)",\s*url:\s*"([^"]+)"\s*\}/g)];
    const page = items.find((m) => m[1] !== "Home");
    if (page) { const u = new URL(page[2]); return { name: page[1], path: u.pathname }; }
  }
  // Pattern 2: items={breadcrumbs} variable — parse the const breadcrumbs array
  const varBlock = src.match(/const breadcrumbs\s*=\s*\[([\s\S]*?)\];/);
  if (varBlock) {
    const items = [...varBlock[1].matchAll(/\{\s*name:\s*"([^"]+)",\s*url:\s*`?\$\{APP_URL\}([^`"]*)`?"\s*\}/g)];
    if (!items.length) {
      // try static URL form
      const items2 = [...varBlock[1].matchAll(/\{\s*name:\s*"([^"]+)",\s*url:\s*"([^"]+)"\s*\}/g)];
      const page2 = items2.filter((m) => m[1] !== "Home").pop();
      if (page2) { const u = new URL(page2[2]); return { name: page2[1], path: u.pathname }; }
    }
    const page = items.filter((m) => m[1] !== "Home").pop();
    if (page) return { name: page[1], path: page[2] || "/" };
  }
  return null;
}

function extractDescription(src) {
  // Multiline description: key\n  "value",
  const m1 = src.match(/description:\s*\n\s+"([^"]+)"/);
  if (m1) return m1[1];
  // Inline description: "value",
  const m2 = src.match(/description:\s*"([^"]+)"/);
  if (m2) return m2[1];
  return null;
}

function extractKeywords(src) {
  const block = src.match(/keywords:\s*\[([\s\S]*?)\]/);
  if (!block) return [];
  return [...block[1].matchAll(/"([^"]+)"/g)]
    .map((m) => m[1])
    .slice(0, 6);
}

function buildComponent(name, urlPath, description, keywords) {
  const url = `https://hayyamed.pro${urlPath}`;
  const kwLine = keywords.length
    ? `\n        keywords={[${keywords.map((k) => `"${k}"`).join(", ")}]}`
    : "";
  return `      <MedicalWebPageJsonLd\n        name="${name}"\n        url="${url}"\n        description="${description}"${kwLine}\n      />`;
}

let processed = 0;
let skipped = 0;

for (const entry of readdirSync(APP_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const dir = entry.name;
  if (!dir.endsWith("-cme")) continue;

  const pagePath = join(APP_DIR, dir, "page.tsx");
  let src;
  try { src = readFileSync(pagePath, "utf-8"); } catch { continue; }

  if (src.includes("MedicalWebPageJsonLd")) { skipped++; continue; }
  if (!src.includes("BreadcrumbJsonLd")) { console.log(`  SKIP (no breadcrumb): ${dir}`); skipped++; continue; }

  const bc = extractSecondBreadcrumb(src);
  if (!bc) { console.log(`  SKIP (no 2nd breadcrumb item): ${dir}`); skipped++; continue; }

  const rawDesc = extractDescription(src) ?? `CME requirements for ${bc.name} in the GCC.`;
  // Escape any double quotes in description for inline use
  const description = rawDesc.replace(/"/g, '\\"');
  const keywords = extractKeywords(src);

  const component = buildComponent(bc.name, bc.path, description, keywords);

  // 1. Add import
  let out = src;
  if (!out.includes(IMPORT_TO_ADD)) {
    out = out.replace(IMPORT_ANCHOR, `${IMPORT_ANCHOR}\n${IMPORT_TO_ADD}`);
  }

  // 2. Insert component right after `]} />`  + blank line  +  opening tag
  // The pattern is: `      ]} />\n\n      <div` or `\n      <header` etc.
  // Find the BreadcrumbJsonLd closing tag — either inline ]} /> or items={breadcrumbs} />
  let idx = out.indexOf(`      ]} />`);
  let closeLen = `      ]} />`.length;
  if (idx === -1) {
    idx = out.indexOf(`items={breadcrumbs} />`);
    closeLen = `items={breadcrumbs} />`.length;
    if (idx !== -1) idx = out.indexOf("\n", idx); // move to end of that line
    closeLen = 0; // insertAt will be after the newline
  }
  if (idx === -1) { console.log(`  SKIP (closing tag not found): ${dir}`); skipped++; continue; }

  const insertAt = idx + closeLen;
  out = out.slice(0, insertAt) + "\n" + component + out.slice(insertAt);

  writeFileSync(pagePath, out, "utf-8");
  console.log(`  ✓ ${dir}`);
  processed++;
}

console.log(`\nDone: ${processed} updated, ${skipped} skipped.`);
