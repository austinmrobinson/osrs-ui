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
  return {
    bmp: out,
    slice: [1, capWidth, 1, capWidth] as [number, number, number, number],
    border: [0, capWidth, 0, capWidth] as [number, number, number, number],
  };
};

const manifest: ManifestEntry[] = [];
for (const s of sprites) {
  let bmp: Bitmap;
  let extra: Partial<ManifestEntry> = {};
  if (s.kind === "single") bmp = readPng(path.join(REF, s.src));
  else {
    const c = s.kind === "hcap" ? hcap(s.cap, s.capWidth, s.middle) : compose(s.frame);
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
