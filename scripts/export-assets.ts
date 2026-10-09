// Static download mirror: public/assets/{svg,png@Nx}/<group>/<name>.* + manifest.json
import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import type { ManifestEntry } from "./build-assets";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "registry/osrs/assets");
const OUT = path.join(ROOT, "public/assets");
const SCALES = [1, 2, 4, 8];

const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(path.join(SRC, "manifest.json"), "utf8"));
fs.rmSync(OUT, { recursive: true, force: true });

for (const m of manifest) {
  const svg = fs.readFileSync(path.join(SRC, m.file));
  const svgOut = path.join(OUT, "svg", m.file);
  fs.mkdirSync(path.dirname(svgOut), { recursive: true });
  fs.writeFileSync(svgOut, svg);
  for (const s of SCALES) {
    const png = new Resvg(svg, { fitTo: { mode: "zoom", value: s }, shapeRendering: 0, font: { loadSystemFonts: false } }).render().asPng();
    const pngOut = path.join(OUT, `png@${s}x`, m.file.replace(/\.svg$/, ".png"));
    fs.mkdirSync(path.dirname(pngOut), { recursive: true });
    fs.writeFileSync(pngOut, png);
  }
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`exported ${manifest.length} assets × (svg + ${SCALES.length} png scales) -> public/assets`);
