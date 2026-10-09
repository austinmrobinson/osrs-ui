// Turns the logo artwork (a large, softly-rendered PNG) into pixel art in the game's colours:
// crop to the art, downsample to a small grid (each cell the average of its source pixels; mostly-
// white cells become transparent), then map every cell onto OSRS colour ramps by its hue and
// lightness: stones to warm stone greys, the banner to the game's reds, lettering and trim to the
// orange/gold of interface text (the sword's hilt too), outlines to black.
// Writes registry/osrs/assets/logo/logo-<width>.svg, and a 4x PNG preview per width to reference/.
// Usage: tsx scripts/build-logo.ts <source.png> [width ...]
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const [src, ...ws] = process.argv.slice(2);
const widths = (ws.length ? ws : ["160"]).map(Number);
const img = PNG.sync.read(fs.readFileSync(src));
const { width: W, height: H, data } = img;
const at = (x: number, y: number) => { const i = (y * W + x) * 4; return [data[i], data[i + 1], data[i + 2], data[i + 3]]; };
const isBg = (r: number, g: number, b: number, a: number) => a < 128 || (r > 235 && g > 235 && b > 235);

// bounding box of the art
let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const [r, g, b, a] = at(x, y); if (!isBg(r, g, b, a)) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } }

function hsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
// OSRS ramps, dark to light
const RAMPS = {
  stone: ["#2e2b26", "#4a463e", "#655f54", "#7f786a", "#9a9282", "#b5ad9b", "#d0c8b5"],
  steel: ["#3a3d40", "#5c6064", "#80858a", "#a7acb0", "#d0d4d6", "#ffffff"],
  red: ["#3d0606", "#5e0b0b", "#7f1010", "#a01818", "#c42424", "#e03a2e"],
  gold: ["#5e3a06", "#8a5208", "#c06a10", "#ff981f", "#ffb84f", "#ffe08a"],
  ink: ["#000001", "#1f1a14"],
};
const pick = (ramp: string[], l: number, lo = 0.08, hi = 0.92) => ramp[Math.max(0, Math.min(ramp.length - 1, Math.floor(((l - lo) / (hi - lo)) * ramp.length)))];
function toOsrs(r: number, g: number, b: number) {
  const [h, s, l] = hsl(r, g, b);
  if (l < 0.16) return RAMPS.ink[0];
  if (s > 0.3 && (h < 18 || h > 340)) return pick(RAMPS.red, l, 0.15, 0.7);
  if (s > 0.35 && h >= 18 && h < 65) return pick(RAMPS.gold, l, 0.2, 0.85);
  // the hilt is drawn green; it becomes gold like the lettering
  if (s > 0.3 && h >= 65 && h < 160) return pick(RAMPS.gold, l, 0.15, 0.75);
  // blue-grey: the stones are bluer and darker than the blade
  if (h >= 190 && h < 260 && s > 0.12) return l < 0.3 ? RAMPS.ink[1] : pick(RAMPS.stone, l, 0.2, 0.85);
  return pick(RAMPS.steel, l, 0.2, 0.95);
}

const outDir = path.join(ROOT, "registry/osrs/assets/logo");
fs.mkdirSync(outDir, { recursive: true });
for (const gw of widths) {
  const cw = (x1 - x0 + 1) / gw, gh = Math.round((y1 - y0 + 1) / cw);
  const grid: (string | null)[][] = [];
  for (let gy = 0; gy < gh; gy++) {
    const row: (string | null)[] = [];
    for (let gx = 0; gx < gw; gx++) {
      let n = 0, bg = 0, R = 0, G = 0, B = 0, dark = 0;
      for (let y = Math.floor(y0 + gy * cw); y < Math.min(H, Math.floor(y0 + (gy + 1) * cw)); y++)
        for (let x = Math.floor(x0 + gx * cw); x < Math.min(W, Math.floor(x0 + (gx + 1) * cw)); x++) {
          const [r, g, b, a] = at(x, y); n++;
          if (isBg(r, g, b, a)) { bg++; continue; }
          if (r + g + b < 120) dark++;
          R += r; G += g; B += b;
        }
      const fg = n - bg;
      if (!n || fg / n < 0.5) { row.push(null); continue; }
      // outlines are thin: a cell that's a third dark reads as outline
      row.push(dark / fg > 0.34 ? RAMPS.ink[0] : toOsrs(R / fg, G / fg, B / fg));
    }
    grid.push(row);
  }
  const by: Record<string, string[]> = {};
  grid.forEach((row, y) => { let x = 0; while (x < gw) { const c = row[x]; if (!c) { x++; continue; } let e = x; while (e + 1 < gw && row[e + 1] === c) e++; (by[c] ??= []).push(`M${x} ${y}h${e - x + 1}v1h-${e - x + 1}z`); x = e + 1; } });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${gw}" height="${gh}" viewBox="0 0 ${gw} ${gh}" shape-rendering="crispEdges">${Object.entries(by).map(([c, d]) => `<path fill="${c}" d="${d.join("")}"/>`).join("")}</svg>\n`;
  fs.writeFileSync(path.join(outDir, `logo-${gw}.svg`), svg);
  // preview at 4x
  const k = 4, png = new PNG({ width: gw * k, height: gh * k });
  png.data.fill(0);
  grid.forEach((row, y) => row.forEach((c, x) => { if (!c) return; const v = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) { const p = ((y * k + j) * gw * k + x * k + i) * 4; png.data[p] = v[0]; png.data[p + 1] = v[1]; png.data[p + 2] = v[2]; png.data[p + 3] = 255; } }));
  fs.writeFileSync(path.join(ROOT, "reference", `logo-${gw}.preview.png`), PNG.sync.write(png)); // gitignored
  console.log(`logo-${gw}.svg ${gw}×${gh}, ${Object.keys(by).length} colours`);
}
