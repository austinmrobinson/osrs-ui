// Render a 3D pixel-icon scene (scripts/pixel-3d-scenes.ts) to a pixel-icon .txt grid as a first
// pass, to refine by hand. See scripts/lib/pixel-3d.ts for the camera and shading.
// Usage: tsx scripts/pixel-3d.ts <scene> [--out pixel-icons/gallery/<file>.txt] [--print]
import fs from "node:fs";
import path from "node:path";

import { PNG } from "pngjs";

import { render, toTxt } from "./lib/pixel-3d";
import { scenes } from "./pixel-3d-scenes";

const args = process.argv.slice(2);
const scene = scenes[args[0]];
if (!scene) {
  console.error(`unknown scene "${args[0]}". Scenes: ${Object.keys(scenes).join(", ")}`);
  process.exit(1);
}
const grid = render(scene);
const outIdx = args.indexOf("--out");
const out = outIdx >= 0 ? args[outIdx + 1] : null;
if (args.includes("--print") || !out) console.log(grid.join("\n"));
if (out) {
  fs.writeFileSync(path.resolve(out), toTxt(scene, grid));
  console.log(`wrote ${out} (${Math.max(...grid.map((r) => r.length))} x ${grid.length})`);
}

// --png <file>: an 8x preview of the raw render, on the stone colour
const pngIdx = args.indexOf("--png");
if (pngIdx >= 0) {
  const S = 8, W = Math.max(...grid.map((r) => r.length)) + 2, H = grid.length + 2;
  const colour = new Map(scene.materials.flatMap((m) => m.ramp.map((c, i) => [m.char[i], c] as const)));
  const png = new PNG({ width: W * S, height: H * S });
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ch = grid[y - 1]?.[x - 1];
    const hex = ch && ch !== "." ? colour.get(ch)! : "#3e3529";
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    for (let dy = 0; dy < S; dy++) for (let dx = 0; dx < S; dx++) { const i = ((y * S + dy) * W * S + x * S + dx) * 4; png.data[i] = r; png.data[i + 1] = g; png.data[i + 2] = b; png.data[i + 3] = 255; }
  }
  fs.writeFileSync(args[pngIdx + 1], PNG.sync.write(png));
}
