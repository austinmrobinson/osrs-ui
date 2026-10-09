// Original pixel icons in the game's style: pixel-icons/*.txt -> site/pixel-icons.tsx (React sprites)
// plus 8x PNG previews in pixel-icons/.preview/ for review. See .claude/skills/osrs-pixel-icon/SKILL.md.
//
// Source format (one icon per file):
//   name: Getting started            display name (the component is PascalCase of the file name)
//   kind: tab                        the icon family, which sets canvas, outline and shadow (KINDS below)
//   outline: #8a3cc8                 optional: override the outline colour, or "none"
//   shadow: none                     optional: override the shadow colour, or "none"
//   a #e2c48a                        palette: one character, one colour
//   ---
//   ..aab..                          the grid: fill and shading only; "." is transparent
import fs from "node:fs";
import path from "node:path";
import { blank, toSvg, writePng, type Bitmap } from "./lib/pixels";

const ROOT = path.resolve(import.meta.dirname, "..");
// Two sets: the site's icons, and the rating gallery's (gallery/icons.generated.tsx)
const SETS = [
  { src: path.join(ROOT, "pixel-icons"), out: path.join(ROOT, "site/pixel-icons.tsx"), preview: path.join(ROOT, "pixel-icons/.preview") },
  { src: path.join(ROOT, "pixel-icons/gallery"), out: path.join(ROOT, "gallery/icons.generated.tsx"), preview: path.join(ROOT, "pixel-icons/.preview/gallery") },
];

type RGB = [number, number, number];
const BLACK: RGB = [0x00, 0x00, 0x01];
/**
 * Icon families, measured from the game's sprites (research/icon-audit.md).
 * `disc` draws the map-icon disc behind the art; `disabled` also emits a greyed twin (spells).
 */
const KINDS: Record<string, { w: number; h: number; outline: RGB | null; shadow: RGB | null; disc?: boolean; disabled?: boolean }> = {
  tab: { w: 33, h: 36, outline: [0x0e, 0x0e, 0x0e], shadow: [0x1c, 0x1c, 0x1c] },
  item: { w: 36, h: 32, outline: BLACK, shadow: null },
  skill: { w: 25, h: 25, outline: BLACK, shadow: null },
  spell: { w: 24, h: 24, outline: BLACK, shadow: null, disabled: true },
  prayer: { w: 30, h: 30, outline: BLACK, shadow: null },
  rank: { w: 13, h: 13, outline: BLACK, shadow: null },
  map: { w: 15, h: 15, outline: null, shadow: null, disc: true },
  raw: { w: 0, h: 0, outline: null, shadow: null },
};
type Kind = keyof typeof KINDS;

type Icon = { id: string; name: string; kind: Kind; bmp: Bitmap };

const hexRgb = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const pascal = (s: string) => s.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());
const camel = (s: string) => s.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());

function parse(dir: string, file: string): Icon[] {
  const text = fs.readFileSync(path.join(dir, file), "utf8");
  const [head, body] = text.split(/^---$/m);
  if (body === undefined) throw new Error(`${file}: missing "---" before the grid`);
  const id = file.replace(/\.txt$/, "");
  let name = id;
  let kind: Kind = "tab";
  let outline: RGB | null | undefined;
  let shadow: RGB | null | undefined;
  const palette = new Map<string, RGB>();
  for (const raw of head.split("\n")) {
    const line = raw.replace(/#(?![0-9a-f]{6}\b).*$/i, "").trim();
    if (!line) continue;
    const m = line.match(/^(name|kind|outline|shadow):\s*(.+)$/);
    if (m) {
      const v = m[2].trim();
      if (m[1] === "name") name = v;
      else if (m[1] === "kind") {
        if (!(v in KINDS)) throw new Error(`${file}: unknown kind "${v}" (${Object.keys(KINDS).join(", ")})`);
        kind = v;
      } else {
        const c = v === "none" ? null : /^#[0-9a-f]{6}$/i.test(v) ? hexRgb(v.toLowerCase()) : undefined;
        if (c === undefined) throw new Error(`${file}: ${m[1]} must be a #hex colour or "none"`);
        if (m[1] === "outline") outline = c;
        else shadow = c;
      }
      continue;
    }
    const p = line.match(/^(\S)\s+(#[0-9a-f]{6})$/i);
    if (!p) throw new Error(`${file}: can't read "${line}"`);
    if (p[1] === ".") throw new Error(`${file}: "." is reserved for transparent`);
    palette.set(p[1], hexRgb(p[2].toLowerCase()));
  }
  const k = KINDS[kind];
  const outlineC = outline === undefined ? k.outline : outline;
  const shadowC = shadow === undefined ? k.shadow : shadow;
  // trim to the drawn pixels, so blank "." columns and rows never shift the centring
  let rows = body.split("\n").map((r) => r.replace(/\s+$/, "").replace(/\.+$/, "")).filter((r) => r.length);
  const lead = Math.min(...rows.filter((r) => /[^. ]/.test(r)).map((r) => r.search(/[^. ]/)));
  rows = rows.map((r) => r.slice(lead));
  while (rows.length && !/[^. ]/.test(rows[0])) rows.shift();
  while (rows.length && !/[^. ]/.test(rows[rows.length - 1])) rows.pop();
  const gw = Math.max(...rows.map((r) => r.length));
  const gh = rows.length;
  const W = kind === "raw" ? gw : k.w;
  const H = kind === "raw" ? gh : k.h;
  const room = (outlineC ? 2 : 0) + (shadowC ? 1 : 0);
  if (kind !== "raw" && (gw + room > W || gh + room > H))
    throw new Error(`${file}: grid ${gw}x${gh} doesn't fit a ${W}x${H} ${kind} icon with its outline${shadowC ? " and shadow" : ""}`);

  const bmp = blank(W, H);
  const set = (x: number, y: number, c: RGB) => bmp.data.set([c[0], c[1], c[2], 255], (y * W + x) * 4);
  const filled = (b: Bitmap, x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && b.data[(y * W + x) * 4 + 3] > 0;

  // map icons: a light grey disc with a black rim, lit from the top left; the art sits on it
  if (k.disc) {
    const c = (W - 1) / 2;
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const d = Math.hypot(x - c, y - c);
        if (d > c + 0.3) continue;
        if (d > c - 0.75) set(x, y, BLACK);
        else set(x, y, x + y < W - 2 ? [0xdc, 0xdc, 0xd4] : x + y < W + 3 ? [0xc0, 0xc0, 0xb8] : [0x9c, 0x9c, 0x94]);
      }
  }
  // centre the drawn pixels; with a shadow, keep outline + shadow centred
  const ox = kind === "raw" ? 0 : Math.round((W - gw - (shadowC ? 1 : 0)) / 2);
  const oy = kind === "raw" ? 0 : Math.round((H - gh - (shadowC ? 1 : 0)) / 2);
  const art = blank(W, H);
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === "." || ch === " ") return;
      const c = palette.get(ch);
      if (!c) throw new Error(`${file}: "${ch}" at ${x},${y} isn't in the palette`);
      art.data.set([c[0], c[1], c[2], 255], ((oy + y) * W + ox + x) * 4);
    }),
  );
  // outline: pixels orthogonally next to the art (diagonal corners stay open, like the game)
  const layer = { ...art, data: Buffer.from(art.data) };
  if (outlineC)
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++)
        if (!filled(art, x, y) && (filled(art, x - 1, y) || filled(art, x + 1, y) || filled(art, x, y - 1) || filled(art, x, y + 1)))
          layer.data.set([...outlineC, 255], (y * W + x) * 4);
  // shadow: one pixel down-right of the outlined art
  if (shadowC) {
    const snap = Buffer.from(layer.data);
    const was = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && snap[(y * W + x) * 4 + 3] > 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!was(x, y) && was(x - 1, y - 1)) layer.data.set([...shadowC, 255], (y * W + x) * 4);
  }
  for (let i = 0; i < layer.data.length; i += 4) if (layer.data[i + 3]) layer.data.copy(bmp.data, i, i, i + 4);

  const out: Icon[] = [{ id, name, kind, bmp }];
  // spells: the greyed, darkened twin the spellbook shows when you can't cast it
  if (k.disabled) {
    const dis = { ...bmp, data: Buffer.from(bmp.data) };
    for (let i = 0; i < dis.data.length; i += 4) {
      if (!dis.data[i + 3]) continue;
      const l = Math.round((0.3 * dis.data[i] + 0.59 * dis.data[i + 1] + 0.11 * dis.data[i + 2]) * 0.5);
      dis.data.set([l, l, l], i);
    }
    out.push({ id: `${id}-disabled`, name: `${name}, disabled`, kind, bmp: dis });
  }
  return out;
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

for (const { src: SRC, out: OUT, preview: PREVIEW } of SETS) {
const files = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((f) => f.endsWith(".txt")).sort() : [];
if (!files.length) continue;
const icons = files.flatMap((f) => parse(SRC, f));
fs.mkdirSync(PREVIEW, { recursive: true });

// previews: each icon at 8x on the interface stone colour, plus a contact sheet at 4x (10 per row)
const STONE = [0x3e, 0x35, 0x29];
for (const i of icons) writePng(path.join(PREVIEW, `${i.id}.png`), scaleUp(i.bmp, 8, STONE));
if (icons.length) {
  const cell = 40, cols = 10;
  const sheet = blank(cell * Math.min(cols, icons.length), cell * Math.ceil(icons.length / cols));
  icons.forEach((ic, n) => {
    const bx = (n % cols) * cell + Math.floor((cell - ic.bmp.width) / 2), by = Math.floor(n / cols) * cell + Math.floor((cell - ic.bmp.height) / 2);
    for (let y = 0; y < ic.bmp.height; y++)
      for (let x = 0; x < ic.bmp.width; x++) {
        const si = (y * ic.bmp.width + x) * 4;
        if (ic.bmp.data[si + 3]) ic.bmp.data.copy(sheet.data, ((by + y) * sheet.width + bx + x) * 4, si, si + 4);
      }
  });
  writePng(path.join(PREVIEW, "_sheet.png"), scaleUp(sheet, 4, STONE));
}

const sprites = icons.map((i) => {
  const inner = toSvg(i.bmp).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "").replace(/"\/>/g, '" />');
  return { key: camel(i.id), comp: `${pascal(i.id)}PixelIcon`, w: i.bmp.width, h: i.bmp.height, inner, name: i.name, kind: i.kind };
});
fs.writeFileSync(
  OUT,
  `// Generated by scripts/build-pixel-icons.ts from pixel-icons/*.txt — do not edit.
// Original icons drawn in the game's style (not Jagex sprites).
import { createSprite } from "@/lib/sprite";

${sprites.map((s) => `/** ${s.name} (${s.kind}) */\nexport const ${s.comp} = createSprite("${s.comp}", ${s.w}, ${s.h}, <>${s.inner}</>);`).join("\n")}

export const pixelIcons = {
${sprites.map((s) => `  ${JSON.stringify(s.key)}: ${s.comp},`).join("\n")}
} as const;

/** Each icon's display name (icon key -> name). */
export const pixelIconNames = {
${sprites.map((s) => `  ${JSON.stringify(s.key)}: ${JSON.stringify(s.name)},`).join("\n")}
} as const;

/** Each icon's family, for grouping (icon key -> kind). */
export const pixelIconKinds = {
${sprites.map((s) => `  ${JSON.stringify(s.key)}: ${JSON.stringify(s.kind)},`).join("\n")}
} as const;

export type PixelIconName = keyof typeof pixelIcons;
`,
);
console.log(`${path.relative(ROOT, OUT)}: ${sprites.length} icons; previews in ${path.relative(ROOT, PREVIEW)}/`);
}
