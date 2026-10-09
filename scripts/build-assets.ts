// Reference PNGs -> composed bitmaps -> pixel-exact SVGs + manifest.
import fs from "node:fs";
import path from "node:path";
import { sprites, type FrameSpec, type Piece } from "../sprites.config";
import { bbox, blank, blit, crop, readPng, toSvg, writePng, type Bitmap } from "./lib/pixels";

const ROOT = path.resolve(import.meta.dirname, "..");
const REF = path.join(ROOT, "reference/vanilla");
const BUILD = path.join(ROOT, "reference/build");
const OUT = path.join(ROOT, "registry/osrs/assets");

export type ManifestEntry = {
  name: string;
  group: string;
  label: string;
  file: string;
  width: number;
  height: number;
  /** border-image slice (top right bottom left) for frames */
  slice?: [number, number, number, number];
  /** visible border thickness for frames, used for padding */
  border?: [number, number, number, number];
};

const load = (p: Piece): Bitmap => {
  const src = typeof p === "string" ? p : p.src;
  const bmp = readPng(path.join(REF, src));
  return typeof p !== "string" && p.trim ? crop(bmp, bbox(bmp)) : bmp;
};

const compose = (f: FrameSpec) => {
  const p = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, load(v as Piece)])) as Record<keyof FrameSpec, Bitmap>;
  const top = Math.max(p.tl.height, p.t.height, p.tr.height);
  const bottom = Math.max(p.bl.height, p.b.height, p.br.height);
  const left = Math.max(p.tl.width, p.l.width, p.bl.width);
  const right = Math.max(p.tr.width, p.r.width, p.br.width);
  const ew = Math.max(p.t.width, p.b.width);
  const eh = Math.max(p.l.height, p.r.height);
  const W = left + ew + right, H = top + eh + bottom;
  const out = blank(W, H);
  blit(out, p.tl, 0, 0);
  blit(out, p.t, left, 0);
  blit(out, p.tr, W - p.tr.width, 0);
  blit(out, p.l, 0, top);
  if (p.m) blit(out, p.m, left, top);
  blit(out, p.r, W - p.r.width, top);
  blit(out, p.bl, 0, H - p.bl.height);
  blit(out, p.b, left, H - p.b.height);
  blit(out, p.br, W - p.br.width, H - p.br.height);
  return {
    bmp: out,
    slice: [top, right, bottom, left] as [number, number, number, number],
    border: [p.t.height, p.r.width, p.b.height, p.l.width] as [number, number, number, number],
  };
};

const hcap = (capSrc: string, capWidth: number, middleSrc: string) => {
  const mid = readPng(path.join(REF, middleSrc));
  const out = blank(capWidth * 2 + mid.width, mid.height);
  const capFull = crop(readPng(path.join(REF, capSrc)), { x: 0, y: 0, w: capWidth, h: mid.height });
  blit(out, capFull, 0, 0);
  blit(out, mid, capWidth, 0);
  // mirrored right cap
  for (let y = 0; y < mid.height; y++)
    for (let x = 0; x < capWidth; x++)
      capFull.data.copy(out.data, (y * out.width + out.width - 1 - x) * 4, (y * capWidth + x) * 4, (y * capWidth + x) * 4 + 4);
  // the top slice covers the cap's slanted shoulder (down to the first row whose outer column is
  // drawn), so a taller tab repeats only the straight side below it, never the slant
  let shoulder = 0;
  while (shoulder < capFull.height && capFull.data[(shoulder * capWidth) * 4 + 3] === 0) shoulder++;
  return {
    bmp: out,
    slice: [shoulder + 1, capWidth, 1, capWidth] as [number, number, number, number],
    border: [0, capWidth, 0, capWidth] as [number, number, number, number],
  };
};

const crop9 = (src: string, k: number, e: number) => {
  const img = readPng(path.join(REF, src));
  const W = k * 2 + e, H = k * 2 + e;
  const out = blank(W, H);
  const put = (sx: number, sy: number, w: number, h: number, dx: number, dy: number) =>
    blit(out, crop(img, { x: sx, y: sy, w, h }), dx, dy);
  put(0, 0, k, k, 0, 0); // corners
  put(img.width - k, 0, k, k, W - k, 0);
  put(0, img.height - k, k, k, 0, H - k);
  put(img.width - k, img.height - k, k, k, W - k, H - k);
  put(k, 0, e, k, k, 0); // edges: first `e` px after each corner
  put(k, img.height - k, e, k, k, H - k);
  put(0, k, k, e, 0, k);
  put(img.width - k, k, k, e, W - k, k);
  return { bmp: out, slice: [k, k, k, k] as [number, number, number, number], border: [k, k, k, k] as [number, number, number, number] };
};

// Expand folder entries into single sprites
type Single = Extract<(typeof sprites)[number], { kind: "single" }>;
const expanded = sprites.flatMap((s) => {
  if (s.kind !== "folder") return [s];
  return fs
    .readdirSync(path.join(REF, s.dir))
    .filter((f) => f.endsWith(".png"))
    .filter((f) => (!s.include || s.include.test(f)) && (!s.exclude || !s.exclude.test(f)))
    .sort()
    .map((f): Single => ({
      kind: "single",
      group: s.group,
      name: f.replace(/\.png$/, "").replace(s.strip ?? /^$/, "").replace(/_/g, "-"),
      src: `${s.dir}/${f}`,
    }));
});

const manifest: ManifestEntry[] = [];
for (const s of expanded) {
  let bmp: Bitmap;
  let extra: Partial<ManifestEntry> = {};
  if (s.kind === "single") bmp = readPng(path.join(REF, s.src));
  else {
    const c =
      s.kind === "hcap" ? hcap(s.cap, s.capWidth, s.middle) : s.kind === "crop9" ? crop9(s.src, s.slice, s.edge) : compose(s.frame);
    bmp = c.bmp;
    extra = { slice: c.slice, border: c.border };
  }
  const file = `${s.group}/${s.name}.svg`;
  fs.mkdirSync(path.join(OUT, s.group), { recursive: true });
  fs.mkdirSync(path.join(BUILD, s.group), { recursive: true });
  fs.writeFileSync(path.join(OUT, file), toSvg(bmp));
  writePng(path.join(BUILD, s.group, `${s.name}.png`), bmp);
  const label = s.label ?? s.name.replace(/(^|-)(\w)/g, (_, sep, c) => (sep ? " " : "") + c.toUpperCase());
  manifest.push({ name: s.name, group: s.group, label, file, width: bmp.width, height: bmp.height, ...extra });
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`built ${manifest.length} assets`);
