// registry/osrs/fonts/RuneScape-Plain-12.ttf -> registry/osrs/fonts/RuneScape-Plain-12-Light.otf
//
// "RuneScape Plain Light": a lighter weight of the game's base font for large sizes.
//
// Derivation / licence: the source is RuneStar's "RuneScape Plain 12" (CC0,
// https://github.com/RuneStar/fonts). This file is a mechanical derivative of it and
// is likewise released under CC0.
//
// How the thinning works ("thin pen" redraw):
//   1. Each source glyph is rasterised back to its pixel bitmap (the source outlines are
//      unions of 1-unit squares, unitsPerEm 16, so 1 unit = 1 game pixel).
//   2. Every pixel is redrawn on a finer N×N sub-pixel grid. Instead of filling the whole
//      N×N cell, a pixel is a smaller (N-1)×(N-1) "pen dot" in the cell's top-left corner.
//   3. Neighbouring pixels are joined by the same pen: a pixel with a right / lower
//      neighbour fills the 1-sub-pixel gap towards it; a 2×2 solid block fills the centre
//      gap; a diagonal step gets a single bridging sub-pixel so stairs stay connected.
//   Net effect: every stroke loses exactly 1/N of a pixel (from its right / bottom side),
//   joins and diagonals stay connected, counters grow by the same 1/N so they stay open,
//   and glyph positions, advance widths, baseline and line height are unchanged.
//   4. The sub-pixel bitmap is traced into rectilinear contours and written as OpenType
//      (opentype.js writes CFF outlines, hence .otf; rectangles need no curves either way).
//
// Run: npx tsx scripts/build-font-light.ts   (deterministic; same input -> same bytes)
import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js"; // no "exports" map: Node loads the UMD build
const { Font, Glyph, Path, parse } = opentype;

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "registry/osrs/fonts/RuneScape-Plain-12.ttf");
const OUT = path.join(ROOT, "registry/osrs/fonts/RuneScape-Plain-12-Light.otf");

const N = 4; // sub-pixels per source pixel; strokes become (N-1)/N px thick
const SCALE = 32; // font units per sub-pixel (keeps coordinates integral)

const FIXED_TIME = Date.UTC(2026, 0, 1); // head.created / head.modified

const src = parse(fs.readFileSync(SRC).buffer as ArrayBuffer);
const U = SCALE * N; // font units per source pixel
const upm = src.unitsPerEm * U;

type Pt = [number, number];

/** Rasterise a glyph's outline (integer coords, straight lines) at pixel centres, nonzero rule. */
function rasterise(g: opentype.Glyph): Set<string> {
  const contours: Pt[][] = [];
  let cur: Pt[] = [];
  for (const c of g.path.commands) {
    if (c.type === "M") { if (cur.length) contours.push(cur); cur = [[c.x, c.y]]; }
    else if (c.type === "L") cur.push([c.x, c.y]);
    else if (c.type === "Z") { if (cur.length) contours.push(cur); cur = []; }
    else throw new Error(`unexpected curve in glyph ${g.name}`);
  }
  if (cur.length) contours.push(cur);
  const xs = contours.flat().map((p) => p[0]);
  const ys = contours.flat().map((p) => p[1]);
  const on = new Set<string>();
  if (!xs.length) return on;
  for (let y = Math.min(...ys); y < Math.max(...ys); y++) {
    for (let x = Math.min(...xs); x < Math.max(...xs); x++) {
      const px = x + 0.5, py = y + 0.5;
      let wind = 0;
      for (const poly of contours) {
        for (let i = 0; i < poly.length; i++) {
          const [x0, y0] = poly[i], [x1, y1] = poly[(i + 1) % poly.length];
          if (y0 <= py && y1 > py && (x1 - x0) * (py - y0) - (px - x0) * (y1 - y0) > 0) wind++;
          else if (y0 > py && y1 <= py && (x1 - x0) * (py - y0) - (px - x0) * (y1 - y0) < 0) wind--;
        }
      }
      if (wind !== 0) on.add(`${x},${y}`);
    }
  }
  return on;
}

/**
 * Redraw pixels with the thin pen. Works in "screen" orientation (row r grows downward,
 * r = -y - 1 for font y-up pixel rows) so "right/bottom" trimming matches a pixel-art eye.
 * Returns filled sub-pixel cells in font coordinates (sub-pixel units, y-up).
 */
function thin(pixels: Set<string>): Set<string> {
  const has = (x: number, r: number) => pixels.has(`${x},${-r - 1}`);
  const sub = new Set<string>();
  // sub-pixel (sx, sr) in screen orientation -> font y-up cell
  const put = (sx: number, sr: number) => sub.add(`${sx},${-sr - 1}`);
  const block = (x0: number, r0: number, w: number, h: number) => {
    for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) put(x0 + i, r0 + j);
  };
  for (const key of pixels) {
    const [x, y] = key.split(",").map(Number);
    const r = -y - 1;
    const bx = x * N, br = r * N;
    const right = has(x + 1, r), down = has(x, r + 1);
    block(bx, br, N - 1, N - 1); // pen dot
    if (right) block(bx + N - 1, br, 1, N - 1); // join →
    if (down) block(bx, br + N - 1, N - 1, 1); // join ↓
    if (right && down && has(x + 1, r + 1)) put(bx + N - 1, br + N - 1); // solid 2×2
    // diagonal ↘ with no orthogonal path: bridge the corner gap
    if (has(x + 1, r + 1) && !right && !down) put(bx + N - 1, br + N - 1);
    // diagonal ↙ with no orthogonal path: one sub-pixel left of our bottom-left corner
    if (has(x - 1, r + 1) && !has(x - 1, r) && !down) put(bx - 1, br + N - 1);
    // an L-corner (right + down, no diagonal) needs nothing: joins already meet at the dot.
  }
  return sub;
}

/** Trace filled unit cells into closed rectilinear contours (TrueType: outer = clockwise). */
function trace(cells: Set<string>): Pt[][] {
  // Directed edges, clockwise around each cell in y-up coordinates; shared edges cancel.
  const edges = new Map<string, Pt>(); // "x,y" start -> end  (may need multiple per start)
  const out = new Map<string, Pt[]>();
  const add = (a: Pt, b: Pt) => {
    const rev = `${b[0]},${b[1]}>${a[0]},${a[1]}`;
    if (edges.has(rev)) edges.delete(rev);
    else edges.set(`${a[0]},${a[1]}>${b[0]},${b[1]}`, b);
  };
  for (const key of [...cells].sort()) {
    const [x, y] = key.split(",").map(Number);
    add([x, y], [x, y + 1]);
    add([x, y + 1], [x + 1, y + 1]);
    add([x + 1, y + 1], [x + 1, y]);
    add([x + 1, y], [x, y]);
  }
  for (const [k, b] of edges) {
    const s = k.split(">")[0];
    (out.get(s) ?? out.set(s, []).get(s)!).push(b);
  }
  const contours: Pt[][] = [];
  const starts = [...out.keys()].sort();
  for (const s of starts) {
    while (out.get(s)?.length) {
      const [sx, sy] = s.split(",").map(Number);
      const poly: Pt[] = [[sx, sy]];
      let prev: Pt = [sx, sy];
      let cur = out.get(s)!.shift()!;
      while (!(cur[0] === sx && cur[1] === sy)) {
        poly.push(cur);
        const nexts = out.get(`${cur[0]},${cur[1]}`)!;
        let idx = 0;
        if (nexts.length > 1) {
          // Corner-touching cells: always take the right turn so diagonal neighbours stay
          // separate contours that merely touch (like the source font's pixel stairs).
          const dx = cur[0] - prev[0], dy = cur[1] - prev[1];
          const rightTurn: Pt = [cur[0] + dy, cur[1] - dx];
          idx = Math.max(0, nexts.findIndex((p) => p[0] === rightTurn[0] && p[1] === rightTurn[1]));
        }
        prev = cur;
        cur = nexts.splice(idx, 1)[0];
      }
      // drop collinear points
      const simp = poly.filter((p, i) => {
        const a = poly[(i - 1 + poly.length) % poly.length], b = poly[(i + 1) % poly.length];
        return !((a[0] === p[0] && p[0] === b[0]) || (a[1] === p[1] && p[1] === b[1]));
      });
      contours.push(simp);
    }
  }
  return contours;
}

const glyphs: opentype.Glyph[] = [];
for (let i = 0; i < src.glyphs.length; i++) {
  const g = src.glyphs.get(i);
  const p = new Path();
  const cells = thin(rasterise(g));
  for (const poly of trace(cells)) {
    poly.forEach(([x, y], j) => (j ? p.lineTo(x * SCALE, y * SCALE) : p.moveTo(x * SCALE, y * SCALE)));
    p.close();
  }
  glyphs.push(
    new Glyph({
      name: g.name ?? `glyph${i}`,
      unicode: g.unicode,
      unicodes: g.unicodes,
      advanceWidth: (g.advanceWidth ?? 0) * U,
      path: p,
    }),
  );
}

const font = new Font({
  familyName: "RuneScape Plain Light",
  styleName: "Regular",
  unitsPerEm: upm,
  ascender: src.ascender * U,
  descender: src.descender * U,
  designer: "Jagex (original bitmap font); RuneStar (TrueType conversion)",
  description: "Light weight of RuneScape Plain 12, derived by scripts/build-font-light.ts in osrs-ui.",
  license: "CC0 1.0 Universal (derived from RuneStar fonts, CC0)",
  version: "1.0",
  glyphs,
  // @ts-expect-error @types/opentype.js describes v1 (string); opentype.js 2 takes the numeric class
  weightClass: 300,
  createdTimestamp: FIXED_TIME / 1000,
});
// opentype.js stamps head.modified with new Date(); pin it so the output is byte-for-byte reproducible.
const RealDate = Date;
globalThis.Date = class extends RealDate {
  constructor(...args: []) { super(...((args.length ? args : [FIXED_TIME]) as [])); }
} as DateConstructor;
const bytes = Buffer.from(font.toArrayBuffer());
globalThis.Date = RealDate;
fs.writeFileSync(OUT, bytes);
console.log(`wrote ${path.relative(ROOT, OUT)} (${glyphs.length} glyphs, ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB)`);
