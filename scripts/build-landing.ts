// Landing page scene: the login screen background (reference/vanilla/login_screen/background.png,
// 765 x 503) as a vector SVG for the home page. Channels are rounded to steps of 8 first: 5,729
// colours become 238, which is invisible at any zoom and cuts the file from 4.1 MB to 2.2 MB
// (0.5 MB gzipped). Site only; not part of the registry or the asset downloads.
import { mkdirSync, writeFileSync } from "node:fs";
import { readPng, toSvg } from "./lib/pixels";

const STEP = 8;
const src = readPng("reference/vanilla/login_screen/background.png");
const data = Buffer.from(src.data);
for (let i = 0; i < data.length; i += 4)
  for (let c = 0; c < 3; c++) data[i + c] = Math.min(255, Math.round(data[i + c] / STEP) * STEP);

mkdirSync("public/landing", { recursive: true });
const svg = toSvg({ ...src, data });
writeFileSync("public/landing/login-scene.svg", svg);

// The misty doorway colour, used to fade from the zoomed archway into the docs
const at = (x: number, y: number) => {
  const i = (y * src.width + x) * 4;
  return `#${[data[i], data[i + 1], data[i + 2]].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};
console.log(`wrote public/landing/login-scene.svg (${(svg.length / 1e6).toFixed(1)} MB); doorway ${at(383, 300)} ${at(383, 200)} ${at(383, 400)}`);

// Login panel: cropped from the OSRS Wiki's current login screen (reference/wiki/default-login-screen.png,
// 1089 x 671; the panel is drawn at 1x there). Outside the rounded outline becomes transparent, and the
// game's heading and button labels are filled over with nearby marble so the page can set its own.
{
  const ref = readPng("reference/wiki/default-login-screen.png");
  const X = 364, Y = 171, W = 360, H = 200;
  const box = { width: W, height: H, data: Buffer.alloc(W * H * 4) };
  const lum = (b: typeof box, x: number, y: number) => {
    const i = (y * b.width + x) * 4;
    return b.data[i] + b.data[i + 1] + b.data[i + 2];
  };
  for (let y = 0; y < H; y++) ref.data.copy(box.data, y * W * 4, ((Y + y) * ref.width + X) * 4, ((Y + y) * ref.width + X + W) * 4);
  // rounded corners: in the corner rows, clear everything outside the first dark outline pixel from each side
  for (let y = 0; y < H; y++) {
    if (y > 24 && y < H - 24) continue;
    for (const dir of [1, -1]) {
      for (let s = 0; s < 30; s++) {
        const x = dir === 1 ? s : W - 1 - s;
        if (lum(box, x, y) < 70) break;
        box.data[(y * W + x) * 4 + 3] = 0;
      }
    }
  }
  const copyPx = (sx: number, sy: number, dx: number, dy: number) => box.data.copy(box.data, (dy * W + dx) * 4, (sy * W + sx) * 4, (sy * W + sx) * 4 + 4);
  // heading band: rows 64..90, from the marble 34 rows above
  for (let y = 66; y <= 88; y++) for (let x = 64; x < 297; x++) copyPx(x, y - 34, x, y);
  // button labels: tile the left button's clean left strip (left of "New User") across both label areas
  const strip = 26, from = 391 - X + 8;
  for (const bx of [391 - X, 551 - X])
    for (let y = 106; y <= 133; y++) for (let x = bx + 8 + (bx === from - 8 ? strip : 0); x < bx + 139; x++) copyPx(from + ((x - bx - 8) % strip), y, x, y);
  const q = Buffer.from(box.data);
  for (let i = 0; i < q.length; i += 4) for (let c = 0; c < 3; c++) q[i + c] = Math.min(255, Math.round(q[i + c] / STEP) * STEP);
  const boxSvg = toSvg({ ...box, data: q });
  writeFileSync("public/landing/login-box.svg", boxSvg);
  console.log(`wrote public/landing/login-box.svg (${(boxSvg.length / 1e3).toFixed(0)} KB)`);
}

// Brazier fire: the login screen's flames are procedural in the game client, so they're simulated
// here too (heat rising and cooling, plus drifting embers), seeded so builds are identical. 24 frames
// at 48 x 64 are packed side by side into one SVG strip; CSS steps through it (site.css .osrs-hero-fire).
{
  const FW = 48, FH = 64, FRAMES = 24;
  let seed = 1234567;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  // integer heat 0..MAX, spread upward with random cooling and sideways drift (the classic fire effect)
  const MAX = 36;
  let heat = Array.from({ length: FH }, () => new Int16Array(FW));
  type Ember = { x: number; y: number; life: number; w: number };
  let embers: Ember[] = [];
  const step = () => {
    for (let x = 0; x < FW; x++) heat[FH - 1][x] = x >= 7 && x < FW - 7 ? MAX - Math.floor(rnd() * 4) : 0;
    const next = heat.map((r) => r.slice());
    for (let y = 1; y < FH; y++)
      for (let x = 0; x < FW; x++) {
        const cool = Math.floor(rnd() * 3.2);
        const to = Math.min(FW - 1, Math.max(0, x + Math.floor(rnd() * 3) - 1));
        next[y - 1][to] = Math.max(0, heat[y][x] - cool);
      }
    // embers: small blobs that break off the flame tips and fade as they rise
    if (rnd() < 0.4) embers.push({ x: 8 + rnd() * (FW - 16), y: FH - 30 - rnd() * 6, life: 1, w: 2 + Math.floor(rnd() * 4) });
    embers = embers.filter((e) => e.life > 0.12 && e.y > 1);
    for (const e of embers) {
      e.y -= 1.2; e.x += rnd() - 0.45; e.life *= 0.92;
      for (let i = 0; i < e.w; i++) {
        const x = Math.round(e.x) + i, y = Math.round(e.y);
        if (x >= 0 && x < FW && y >= 0 && y < FH) next[y][x] = Math.max(next[y][x], Math.round(MAX * 0.5 * e.life));
      }
    }
    heat = next;
  };
  // heat -> colour and opacity (dark translucent reds at the tips, solid yellow at the base)
  const RAMP: [number, number[], number][] = [
    [0.12, [0x8c, 0x1c, 0x08], 0.45],
    [0.25, [0xb0, 0x28, 0x0a], 0.6],
    [0.38, [0xd0, 0x40, 0x0c], 0.75],
    [0.5, [0xec, 0x6a, 0x14], 0.9],
    [0.62, [0xf6, 0x98, 0x24], 1],
    [0.74, [0xfa, 0xc0, 0x3c], 1],
    [0.86, [0xfe, 0xe0, 0x68], 1],
    [2, [0xff, 0xf2, 0xa8], 1],
  ];
  for (let i = 0; i < 80; i++) step();
  const sheet = { width: FW * FRAMES, height: FH, data: Buffer.alloc(FW * FRAMES * FH * 4) };
  for (let f = 0; f < FRAMES; f++) {
    step();
    for (let y = 0; y < FH; y++)
      for (let x = 0; x < FW; x++) {
        const h = heat[y][x] / MAX;
        if (h < RAMP[0][0]) continue;
        let k = 0;
        while (k < RAMP.length - 1 && h >= RAMP[k + 1][0]) k++;
        const [, c, a] = RAMP[k];
        sheet.data.set([c[0], c[1], c[2], Math.round(a * 255)], (y * sheet.width + f * FW + x) * 4);
      }
  }
  const fireSvg = toSvg(sheet);
  writeFileSync("public/landing/brazier-fire.svg", fireSvg);
  console.log(`wrote public/landing/brazier-fire.svg (${FRAMES} frames, ${(fireSvg.length / 1e3).toFixed(0)} KB)`);
}
