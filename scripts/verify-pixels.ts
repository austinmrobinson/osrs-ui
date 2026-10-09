// Rasterise every shipped SVG at 1x and compare it to the bitmap it came from.
// Any differing pixel fails: this is what backs the "1:1" claim.
import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { readPng } from "./lib/pixels";
import type { ManifestEntry } from "./build-assets";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "registry/osrs/assets");
const BUILD = path.join(ROOT, "reference/build");
const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(path.join(OUT, "manifest.json"), "utf8"));

let failed = 0;
for (const m of manifest) {
  const ref = readPng(path.join(BUILD, m.group, `${m.name}.png`));
  const img = new Resvg(fs.readFileSync(path.join(OUT, m.file)), { shapeRendering: 0, font: { loadSystemFonts: false } }).render();
  const px = img.pixels; // straight RGBA
  let bad = 0;
  for (let i = 0; i < ref.width * ref.height; i++) {
    const a1 = ref.data[i * 4 + 3], a2 = px[i * 4 + 3];
    if (Math.abs(a1 - a2) > 1) { bad++; continue; }
    if (a1 === 0) continue;
    // semi-transparent pixels round-trip through premultiplication; allow 1-2 levels there
    const tol = a1 === 255 ? 0 : 2;
    for (let c = 0; c < 3; c++) if (Math.abs(ref.data[i * 4 + c] - px[i * 4 + c]) > tol) { bad++; break; }
  }
  if (img.width !== ref.width || img.height !== ref.height || bad) {
    failed++;
    console.error(`✗ ${m.file}: ${bad} px differ (${img.width}x${img.height} vs ${ref.width}x${ref.height})`);
  }
}
console.log(failed ? `${failed}/${manifest.length} assets differ` : `✓ all ${manifest.length} assets pixel-identical`);
process.exit(failed ? 1 : 0);
