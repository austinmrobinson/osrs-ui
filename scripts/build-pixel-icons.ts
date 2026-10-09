// Original pixel icons in the game's style: pixel-icons/*.txt -> site/pixel-icons.tsx (React sprites)
// plus 8x PNG previews in pixel-icons/.preview/ for review. See .claude/skills/osrs-pixel-icon/SKILL.md.
//
// Source format (one icon per file):
//   name: Getting started            display name (the component is PascalCase of the file name)
//   kind: tab                        tab  = 33x36 side-panel tab icon: #0e0e0e outline + #1c1c1c shadow
//                                    item = 36x32 item icon: #000001 outline, no shadow
//                                    raw  = no canvas, outline or shadow (grid is the whole sprite)
//   a #e2c48a                        palette: one character, one colour
//   ---
//   ..aab..                          the grid: fill and shading only; "." is transparent
import fs from "node:fs";
import path from "node:path";
import { blank, toSvg, writePng, type Bitmap } from "./lib/pixels";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "pixel-icons");
const PREVIEW = path.join(SRC, ".preview");
const OUT = path.join(ROOT, "site/pixel-icons.tsx");

const KINDS = {
  tab: { w: 33, h: 36, outline: [0x0e, 0x0e, 0x0e], shadow: [0x1c, 0x1c, 0x1c] },
  item: { w: 36, h: 32, outline: [0x00, 0x00, 0x01], shadow: null },
  raw: { w: 0, h: 0, outline: null, shadow: null },
} as const;

type Icon = { file: string; name: string; kind: keyof typeof KINDS; bmp: Bitmap };

const hexRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const pascal = (s: string) => s.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());
const camel = (s: string) => s.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());

function parse(file: string): Icon {
  const text = fs.readFileSync(path.join(SRC, file), "utf8");
  const [head, body] = text.split(/^---$/m);
  if (body === undefined) throw new Error(`${file}: missing "---" before the grid`);
  let name = file.replace(/\.txt$/, "");
  let kind: keyof typeof KINDS = "tab";
  const palette = new Map<string, number[]>();
  for (const raw of head.split("\n")) {
    const line = raw.replace(/#(?![0-9a-f]{6}\b).*$/i, "").trim();
    if (!line) continue;
    const m = line.match(/^(name|kind):\s*(.+)$/);
    if (m) {
      if (m[1] === "name") name = m[2].trim();
      else if (m[2].trim() in KINDS) kind = m[2].trim() as keyof typeof KINDS;
      else throw new Error(`${file}: unknown kind "${m[2]}"`);
      continue;
    }
    const p = line.match(/^(\S)\s+(#[0-9a-f]{6})$/i);
    if (!p) throw new Error(`${file}: can't read "${line}"`);
    if (p[1] === ".") throw new Error(`${file}: "." is reserved for transparent`);
    palette.set(p[1], hexRgb(p[2].toLowerCase()));
  }
  const rows = body.split("\n").map((r) => r.replace(/\s+$/, "")).filter((r) => r.length);
  const gw = Math.max(...rows.map((r) => r.length));
  const gh = rows.length;
  const k = KINDS[kind];
  const W = kind === "raw" ? gw : k.w;
  const H = kind === "raw" ? gh : k.h;
  if (gw > W - 4 || gh > H - 4) {
    if (kind !== "raw") throw new Error(`${file}: grid ${gw}x${gh} leaves no room for the outline on a ${W}x${H} ${kind}`);
  }
  // centre the grid; nudge up-left one pixel when there's a shadow so outline + shadow stay centred
  const ox = kind === "raw" ? 0 : Math.floor((W - gw) / 2) - (k.shadow ? 0 : 0);
  const oy = kind === "raw" ? 0 : Math.floor((H - gh) / 2);
  const bmp = blank(W, H);
  const set = (x: number, y: number, c: number[]) => {
    const i = (y * W + x) * 4;
    bmp.data[i] = c[0]; bmp.data[i + 1] = c[1]; bmp.data[i + 2] = c[2]; bmp.data[i + 3] = 255;
  };
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === "." || ch === " ") return;
      const c = palette.get(ch);
      if (!c) throw new Error(`${file}: "${ch}" at ${x},${y} isn't in the palette`);
      set(ox + x, oy + y, c);
    }),
  );
  const filled = (b: Bitmap, x: number, y: number) =>
    x >= 0 && y >= 0 && x < W && y < H && b.data[(y * W + x) * 4 + 3] > 0;
  // outline: transparent pixels orthogonally next to the shape (diagonal corners stay open, like the game)
  if (k.outline) {
    const snap = { ...bmp, data: Buffer.from(bmp.data) };
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++)
        if (!filled(snap, x, y) && (filled(snap, x - 1, y) || filled(snap, x + 1, y) || filled(snap, x, y - 1) || filled(snap, x, y + 1)))
          set(x, y, k.outline as unknown as number[]);
  }
  // shadow: one pixel down-right of the outlined shape, where it's still transparent
  if (k.shadow) {
    const snap = { ...bmp, data: Buffer.from(bmp.data) };
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++)
        if (!filled(snap, x, y) && filled(snap, x - 1, y - 1)) set(x, y, k.shadow as unknown as number[]);
  }
  return { file, name, kind, bmp };
}

const scaleUp = (b: Bitmap, s: number, bg?: number[]): Bitmap => {
  const out = blank(b.width * s, b.height * s);
  for (let y = 0; y < out.height; y++)
    for (let x = 0; x < out.width; x++) {
      const si = (Math.floor(y / s) * b.width + Math.floor(x / s)) * 4;
      const di = (y * out.width + x) * 4;
      if (b.data[si + 3] === 0 && bg) out.data.set([...bg, 255], di);
      else b.data.copy(out.data, di, si, si + 4);
    }
  return out;
};

const files = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((f) => f.endsWith(".txt")).sort() : [];
const icons = files.map(parse);
fs.mkdirSync(PREVIEW, { recursive: true });

// previews: each icon at 8x on the interface stone colour, plus a contact sheet at 4x
const STONE = [0x3e, 0x35, 0x29];
for (const i of icons) writePng(path.join(PREVIEW, i.file.replace(/\.txt$/, ".png")), scaleUp(i.bmp, 8, STONE));
if (icons.length) {
  const cell = 40;
  const sheet = blank(cell * icons.length, cell);
  icons.forEach((ic, n) => {
    for (let y = 0; y < ic.bmp.height; y++)
      for (let x = 0; x < ic.bmp.width; x++) {
        const si = (y * ic.bmp.width + x) * 4;
        const di = ((y + 2) * sheet.width + n * cell + x + 2) * 4;
        if (ic.bmp.data[si + 3]) ic.bmp.data.copy(sheet.data, di, si, si + 4);
      }
  });
  writePng(path.join(PREVIEW, "_sheet.png"), scaleUp(sheet, 4, STONE));
}

const sprites = icons.map((i) => {
  const id = i.file.replace(/\.txt$/, "");
  const inner = toSvg(i.bmp).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "").replace(/"\/>/g, '" />');
  return { key: camel(id), comp: `${pascal(id)}PixelIcon`, w: i.bmp.width, h: i.bmp.height, inner, name: i.name };
});
fs.writeFileSync(
  OUT,
  `// Generated by scripts/build-pixel-icons.ts from pixel-icons/*.txt — do not edit.
// Original icons drawn in the game's style (not Jagex sprites).
import { createSprite } from "@/lib/sprite";

${sprites.map((s) => `/** ${s.name} */\nexport const ${s.comp} = createSprite("${s.comp}", ${s.w}, ${s.h}, <>${s.inner}</>);`).join("\n")}

export const pixelIcons = {
${sprites.map((s) => `  ${JSON.stringify(s.key)}: ${s.comp},`).join("\n")}
} as const;

export type PixelIconName = keyof typeof pixelIcons;
`,
);
console.log(`site/pixel-icons.tsx: ${sprites.length} icons; previews in pixel-icons/.preview/`);
