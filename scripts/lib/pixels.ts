import fs from "node:fs";
import { PNG } from "pngjs";

export type Bitmap = { width: number; height: number; data: Buffer };

export const readPng = (file: string): Bitmap => {
  const p = PNG.sync.read(fs.readFileSync(file));
  return { width: p.width, height: p.height, data: p.data };
};

export const writePng = (file: string, bmp: Bitmap) => {
  const p = new PNG({ width: bmp.width, height: bmp.height });
  bmp.data.copy(p.data);
  fs.writeFileSync(file, PNG.sync.write(p));
};

export const blank = (width: number, height: number): Bitmap => ({
  width,
  height,
  data: Buffer.alloc(width * height * 4),
});

export type Rect = { x: number; y: number; w: number; h: number };

export const crop = (src: Bitmap, r: Rect): Bitmap => {
  const out = blank(r.w, r.h);
  for (let y = 0; y < r.h; y++)
    src.data.copy(out.data, y * r.w * 4, ((r.y + y) * src.width + r.x) * 4, ((r.y + y) * src.width + r.x + r.w) * 4);
  return out;
};

/** Copy src onto dst at (dx, dy). Opaque-over only: sprites never overlap in our layouts. */
export const blit = (dst: Bitmap, src: Bitmap, dx: number, dy: number) => {
  for (let y = 0; y < src.height; y++)
    for (let x = 0; x < src.width; x++) {
      const si = (y * src.width + x) * 4;
      if (src.data[si + 3] === 0) continue;
      const tx = dx + x, ty = dy + y;
      if (tx < 0 || ty < 0 || tx >= dst.width || ty >= dst.height) continue;
      src.data.copy(dst.data, (ty * dst.width + tx) * 4, si, si + 4);
    }
};

/** Bounding box of non-transparent pixels. */
export const bbox = (b: Bitmap): Rect => {
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
  for (let y = 0; y < b.height; y++)
    for (let x = 0; x < b.width; x++)
      if (b.data[(y * b.width + x) * 4 + 3]) {
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      }
  return x1 < 0 ? { x: 0, y: 0, w: 0, h: 0 } : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
};

const hex = (n: number) => n.toString(16).padStart(2, "0");

/**
 * Pixel-exact bitmap -> SVG. Each colour becomes one <path> made of greedily
 * merged rectangles, so the output is lossless at 1x and crisp at any integer scale.
 */
export const toSvg = (b: Bitmap, opts: { colorMap?: Record<string, string> } = {}): string => {
  const { width: W, height: H, data } = b;
  const keyAt = (x: number, y: number) => data.readUInt32BE((y * W + x) * 4);
  const done = new Uint8Array(W * H);
  const paths = new Map<number, string[]>();

  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      if (done[y * W + x]) continue;
      const k = keyAt(x, y);
      if ((k & 0xff) === 0) { done[y * W + x] = 1; continue; }
      let w = 1;
      while (x + w < W && !done[y * W + x + w] && keyAt(x + w, y) === k) w++;
      let h = 1;
      grow: while (y + h < H) {
        for (let i = 0; i < w; i++) if (done[(y + h) * W + x + i] || keyAt(x + i, y + h) !== k) break grow;
        h++;
      }
      for (let j = 0; j < h; j++) done.fill(1, (y + j) * W + x, (y + j) * W + x + w);
      if (!paths.has(k)) paths.set(k, []);
      paths.get(k)!.push(`M${x} ${y}h${w}v${h}h-${w}z`);
    }

  const body = [...paths.entries()]
    .map(([k, d]) => {
      const r = k >>> 24, g = (k >>> 16) & 0xff, bl = (k >>> 8) & 0xff, a = k & 0xff;
      const color = `#${hex(r)}${hex(g)}${hex(bl)}`;
      const fill = opts.colorMap?.[color] ?? color;
      const op = a === 255 ? "" : ` fill-opacity="${+(a / 255).toFixed(4)}"`;
      return `<path fill="${fill}"${op} d="${d.join("")}"/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${body}</svg>`;
};
