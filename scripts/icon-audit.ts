// Icon audit helper: per-category stats (outline colour, shadow, palette size, padding) and 3x
// contact sheets of the sampled wiki icons in reference/wiki/icons/<Category>/ (gitignored).
import fs from "node:fs";
import path from "node:path";
import { blank, readPng, writePng, type Bitmap } from "./lib/pixels";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIR = path.join(ROOT, "reference/wiki/icons");
const hex = (r: number, g: number, b: number) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

function analyse(b: Bitmap) {
  const { width: W, height: H, data } = b;
  const a = (x: number, y: number) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : data[(y * W + x) * 4 + 3]);
  const c = (x: number, y: number) => { const i = (y * W + x) * 4; return hex(data[i], data[i + 1], data[i + 2]); };
  const edge = new Map<string, number>(), br = new Map<string, number>(), tl = new Map<string, number>();
  const colours = new Set<string>();
  let minX = W, minY = H, maxX = -1, maxY = -1, semi = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      if (!a(x, y)) continue;
      if (a(x, y) < 255) semi++;
      colours.add(c(x, y));
      minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      const out = !a(x - 1, y) || !a(x + 1, y) || !a(x, y - 1) || !a(x, y + 1);
      if (out) edge.set(c(x, y), (edge.get(c(x, y)) ?? 0) + 1);
      // edge pixels facing down-right vs up-left (a drop shadow makes these differ)
      if (!a(x + 1, y) || !a(x, y + 1)) br.set(c(x, y), (br.get(c(x, y)) ?? 0) + 1);
      if (!a(x - 1, y) || !a(x, y - 1)) tl.set(c(x, y), (tl.get(c(x, y)) ?? 0) + 1);
    }
  const top = (m: Map<string, number>) => [...m.entries()].sort((p, q) => q[1] - p[1])[0]?.[0] ?? "-";
  const edgeTotal = [...edge.values()].reduce((s, v) => s + v, 0) || 1;
  const outlineShare = (edge.get(top(edge)) ?? 0) / edgeTotal;
  return { W, H, colours: colours.size, outline: top(edge), outlineShare, br: top(br), tl: top(tl), pad: [minX, minY, W - 1 - maxX, H - 1 - maxY], semi };
}

for (const cat of fs.readdirSync(DIR).filter((d) => fs.statSync(path.join(DIR, d)).isDirectory())) {
  const files = fs.readdirSync(path.join(DIR, cat)).filter((f) => f.endsWith(".png")).sort();
  const bmps = files.map((f) => readPng(path.join(DIR, cat, f)));
  const stats = bmps.map(analyse);
  const outlines = new Map<string, number>();
  stats.forEach((s) => outlines.set(s.outline, (outlines.get(s.outline) ?? 0) + 1));
  const avg = (k: (s: ReturnType<typeof analyse>) => number) => (stats.reduce((t, s) => t + k(s), 0) / stats.length).toFixed(1);
  const shadowed = stats.filter((s) => s.br !== s.tl).length;
  console.log(
    `${cat}: n=${stats.length} colours≈${avg((s) => s.colours)} outline=${[...outlines.entries()].sort((p, q) => q[1] - p[1]).slice(0, 3).map(([k, v]) => `${k}×${v}`).join(" ")} outlineShare≈${avg((s) => s.outlineShare)} br≠tl=${shadowed} semi=${stats.filter((s) => s.semi).length} pad≈${avg((s) => s.pad[0])},${avg((s) => s.pad[1])},${avg((s) => s.pad[2])},${avg((s) => s.pad[3])}`,
  );
  // contact sheet: 10 per row, 70 px cells, 3x, on interface stone
  const cell = 70, cols = 10, rows = Math.ceil(bmps.length / cols);
  const sheet = blank(cols * cell, rows * cell);
  for (let i = 0; i < sheet.data.length; i += 4) sheet.data.set([0x3e, 0x35, 0x29, 255], i);
  bmps.forEach((b, n) => {
    const ox = (n % cols) * cell + Math.floor((cell - b.width) / 2), oy = Math.floor(n / cols) * cell + Math.floor((cell - b.height) / 2);
    for (let y = 0; y < b.height; y++)
      for (let x = 0; x < b.width; x++) {
        const si = (y * b.width + x) * 4, al = b.data[si + 3] / 255;
        if (!al) continue;
        const di = ((oy + y) * sheet.width + ox + x) * 4;
        for (let k = 0; k < 3; k++) sheet.data[di + k] = Math.round(b.data[si + k] * al + sheet.data[di + k] * (1 - al));
      }
  });
  const s3 = blank(sheet.width * 3, sheet.height * 3);
  for (let y = 0; y < s3.height; y++) for (let x = 0; x < s3.width; x++) sheet.data.copy(s3.data, (y * s3.width + x) * 4, (Math.floor(y / 3) * sheet.width + Math.floor(x / 3)) * 4, (Math.floor(y / 3) * sheet.width + Math.floor(x / 3)) * 4 + 4);
  writePng(path.join(DIR, `_sheet_${cat}.png`), s3);
}
