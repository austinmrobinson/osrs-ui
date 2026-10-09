// Client-side composition of downloadable assets. Everything stays vector until the
// final PNG rasterisation, which only ever happens at integer scales.

export type Asset = {
  name: string;
  group: string;
  label: string;
  file: string;
  width: number;
  height: number;
  slice?: [number, number, number, number];
  border?: [number, number, number, number];
};

const inner = (svg: string) => svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

/** Tile region (sx,sy,sw,sh) of the source across (dx,dy,dw,dh), starting at the top-left like the game does. */
function tile(id: string, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) {
  if (dw <= 0 || dh <= 0 || sw <= 0 || sh <= 0) return "";
  let out = `<svg x="${dx}" y="${dy}" width="${dw}" height="${dh}" overflow="hidden">`;
  for (let y = 0; y < dh; y += sh)
    for (let x = 0; x < dw; x += sw)
      out += `<svg x="${x}" y="${y}" width="${sw}" height="${sh}" viewBox="${sx} ${sy} ${sw} ${sh}" overflow="hidden"><use href="#${id}"/></svg>`;
  return out + "</svg>";
}

const wrap = (w: number, h: number, defs: string, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"><defs>${defs}</defs>${body}</svg>`;

/** Tile a texture across w×h game pixels. */
export function composeTexture(asset: Asset, svg: string, w: number, h: number) {
  return wrap(w, h, `<g id="t">${inner(svg)}</g>`, tile("t", 0, 0, asset.width, asset.height, 0, 0, w, h));
}

/** Render a 9-slice frame at w×h game pixels, optionally filling the inside with a texture. */
export function composeFrame(asset: Asset, svg: string, w: number, h: number, fill?: { asset: Asset; svg: string }) {
  const [t, r, b, l] = asset.slice!;
  const W = asset.width, H = asset.height;
  const mw = W - l - r, mh = H - t - b;
  w = Math.max(w, l + r);
  h = Math.max(h, t + b);
  let defs = `<g id="f">${inner(svg)}</g>`;
  let body = "";
  if (fill) {
    defs += `<g id="t">${inner(fill.svg)}</g>`;
    const [bt, br, bb, bl] = asset.border ?? [0, 0, 0, 0];
    body += tile("t", 0, 0, fill.asset.width, fill.asset.height, bl, bt, w - bl - br, h - bt - bb);
  }
  body +=
    tile("f", l, t, mw, mh, l, t, w - l - r, h - t - b) + // middle
    tile("f", l, 0, mw, t, l, 0, w - l - r, t) + // top
    tile("f", l, H - b, mw, b, l, h - b, w - l - r, b) + // bottom
    tile("f", 0, t, l, mh, 0, t, l, h - t - b) + // left
    tile("f", W - r, t, r, mh, w - r, t, r, h - t - b) + // right
    tile("f", 0, 0, l, t, 0, 0, l, t) +
    tile("f", W - r, 0, r, t, w - r, 0, r, t) +
    tile("f", 0, H - b, l, b, 0, h - b, l, b) +
    tile("f", W - r, H - b, r, b, w - r, h - b, r, b);
  return wrap(w, h, defs, body);
}

/** Scale an SVG's displayed size (vector stays the same). */
export function scaleSvg(svg: string, scale: number) {
  const m = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (!m) return svg;
  const [w, h] = [Number(m[1]) * scale, Number(m[2]) * scale];
  return svg.replace(/width="\d+" height="\d+"/, `width="${w}" height="${h}"`);
}

export const svgSize = (svg: string) => {
  const m = svg.match(/viewBox="0 0 (\d+) (\d+)"/)!;
  return { width: Number(m[1]), height: Number(m[2]) };
};

/** Rasterise at an integer scale with no smoothing, optional padding (game px) and background colour. */
export async function toPng(svg: string, scale: number, opts: { pad?: number; background?: string } = {}): Promise<Blob> {
  const { width, height } = svgSize(svg);
  const pad = opts.pad ?? 0;
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(scaleSvg(svg, scale))}`;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = (width + pad * 2) * scale;
  canvas.height = (height + pad * 2) * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  if (opts.background) {
    ctx.fillStyle = opts.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, pad * scale, pad * scale, width * scale, height * scale);
  return new Promise((res) => canvas.toBlob((b) => res(b!), "image/png"));
}

export function download(blob: Blob, filename: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
