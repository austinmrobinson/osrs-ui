// The World Map recipe's art, traced from the game (demo-only, like the chatheads; not part of the
// registry). Reads reference/wiki/worldmap (gitignored):
//   World_map_interface.png   the current World Map at 1x (wiki, July 2026): its four bottom-bar
//                             buttons and the orange close X are cut from it
//   World_map_-_zoom_*.png    the wiki's older button images, used only to find the buttons' places
//   tiles/0_X_Y.png           map tiles (wiki map, zoom 2, 4 px per game square), stitched into
//                             misthalin.png by hand
// Downloads the key's map icons from the wiki if missing, and writes:
//   site/demo-data/world-map.tsx       the sprites
//   public/demo/world-map/misthalin.webp  the map region (lossless), for the docs demo
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { blank, crop, readPng, toSvg, type Bitmap, type Rect } from "./lib/pixels";

const ROOT = path.resolve(import.meta.dirname, "..");
const REF = path.join(ROOT, "reference/wiki/worldmap");
const OUT = path.join(ROOT, "site/demo-data/world-map.tsx");
const MAP_OUT = path.join(ROOT, "public/demo/world-map/misthalin.webp");
const UA = "osrs-ui-docs/0.1 (+https://github.com/austinmrobinson/osrs-ui)";

const screen = readPng(path.join(REF, "World_map_interface.png"));
const px = (b: Bitmap, x: number, y: number) => b.data.readUInt32BE((y * b.width + x) * 4);

/** Where `tpl` matches `src` best, searching `area`, by the share of identical pixels. */
function find(src: Bitmap, tpl: Bitmap, area: Rect): { x: number; y: number; score: number } {
  let best = { x: 0, y: 0, score: -1 };
  for (let y = area.y; y <= area.y + area.h - tpl.height; y++)
    for (let x = area.x; x <= area.x + area.w - tpl.width; x++) {
      let same = 0;
      for (let j = 0; j < tpl.height; j++) for (let i = 0; i < tpl.width; i++) if (px(src, x + i, y + j) === px(tpl, i, j)) same++;
      const score = same / (tpl.width * tpl.height);
      if (score > best.score) best = { x, y, score };
    }
  return best;
}

const bar: Rect = { x: 0, y: 280, w: 512, h: 54 };
const zoomIn = readPng(path.join(REF, "World_map_-_zoom_in.png"));
const zoomOut = readPng(path.join(REF, "World_map_-_zoom_out.png"));
const key = readPng(path.join(REF, "World_map_-_Key_button.png"));
const zi = find(screen, zoomIn, bar);
// zoom out sits just left of zoom in (the two old images are alike enough to match either)
const zo = find(screen, zoomOut, { x: 300, y: 280, w: zi.x - 300, h: 54 });
// the scroll buttons' frames match the old images even where their icons changed: find them by
// their frames (the same size), left half of the bar and right of the zoom buttons
const ov = find(screen, key, { x: 0, y: 280, w: 120, h: 54 });
const ky = find(screen, key, { x: zi.x + zoomIn.width, y: 280, w: 512 - zi.x - zoomIn.width, h: 54 });
console.log({ zi, zo, ov, ky });

/** The orange close X, drawn over the map: its orange and yellow pixels, plus the black outline
 *  and dark shading that touch them. */
function closeX(): Bitmap {
  const area: Rect = { x: 462, y: 0, w: 50, h: 46 };
  const b = crop(screen, area);
  const W = b.width, H = b.height;
  const rgb = (i: number) => [b.data[i * 4], b.data[i * 4 + 1], b.data[i * 4 + 2]];
  const warm = (i: number) => {
    const [r, , bl] = rgb(i);
    return r > 150 && bl < 90 && r - bl > 120;
  };
  const dark = (i: number) => {
    const [r, g, bl] = rgb(i);
    return r < 60 && g < 50 && bl < 40;
  };
  const keep = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) if (warm(i)) keep[i] = 1;
  // shading and outline: dark pixels next to the X, two rings out
  for (let pass = 0; pass < 2; pass++) {
    const add: number[] = [];
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (keep[i] || !dark(i)) continue;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < W && ny < H && keep[ny * W + nx]) add.push(i);
          }
      }
    for (const i of add) keep[i] = 1;
  }
  const out = blank(W, H);
  for (let i = 0; i < W * H; i++) if (keep[i]) b.data.copy(out.data, i * 4, i * 4, i * 4 + 4);
  // trim to the X
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (keep[y * W + x]) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return crop(out, { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 });
}

/** The map icons in the key, from the wiki (15 x 15 each). */
const ICONS = ["Bank", "Altar", "General store", "Quest start", "Furnace", "Anvil", "Fishing spot", "Mining site", "Transportation"];
const iconDir = path.join(REF, "icons");
fs.mkdirSync(iconDir, { recursive: true });
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const pascal = (s: string) => slug(s).replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());
for (const name of ICONS) {
  const file = path.join(iconDir, `${slug(name)}.png`);
  if (fs.existsSync(file)) continue;
  const res = await fetch(`https://oldschool.runescape.wiki/images/${encodeURIComponent(`${name} icon.png`.replace(/ /g, "_"))}`, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${name}: ${res.status}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

const sprite = (name: string, b: Bitmap) => {
  const inner = toSvg(b).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "").replace(/fill-opacity=/g, "fillOpacity=");
  return `export const ${name} = createSprite("${name}", ${b.width}, ${b.height}, <>${inner}</>);`;
};

const rows = [
  sprite("WorldMapOverviewButton", crop(screen, { x: ov.x, y: ov.y, w: key.width, h: key.height })),
  sprite("WorldMapZoomOutButton", crop(screen, { x: zo.x, y: zo.y, w: zoomOut.width, h: zoomOut.height })),
  sprite("WorldMapZoomInButton", crop(screen, { x: zi.x, y: zi.y, w: zoomIn.width, h: zoomIn.height })),
  sprite("WorldMapKeyButton", crop(screen, { x: ky.x, y: ky.y, w: key.width, h: key.height })),
  sprite("WorldMapClose", closeX()),
  ...ICONS.map((n) => sprite(`MapIcon${pascal(n)}`, readPng(path.join(iconDir, `${slug(n)}.png`)))),
];

fs.writeFileSync(
  OUT,
  `// Generated by scripts/build-world-map.ts: the World Map recipe's buttons, close X and key icons,
// traced from the game (via the OSRS Wiki, CC BY-NC-SA 3.0; the art is Jagex's). Demo-only.
import { createSprite } from "@/lib/sprite";

${rows.join("\n")}

/** The key's icons, by label. */
export const MAP_ICONS = {
${ICONS.map((n) => `  ${JSON.stringify(n)}: MapIcon${pascal(n)},`).join("\n")}
} as const;
`,
);

fs.mkdirSync(path.dirname(MAP_OUT), { recursive: true });
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", path.join(REF, "misthalin.png"), "-c:v", "libwebp", "-lossless", "1", "-compression_level", "6", MAP_OUT]);
console.log(`${rows.length} sprites -> site/demo-data/world-map.tsx; map -> ${path.relative(ROOT, MAP_OUT)} (${fs.statSync(MAP_OUT).size} bytes)`);
