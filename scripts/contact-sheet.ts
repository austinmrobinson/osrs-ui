// Dev helper: tile upscaled sprites into one PNG for visual inspection.
// usage: tsx scripts/contact-sheet.ts out.png scale file1.png file2.png ...
import fs from "node:fs";
import { PNG } from "pngjs";

const [out, scaleArg, ...files] = process.argv.slice(2);
const scale = Number(scaleArg) || 4;
const pad = 8;
const imgs = files.map((f) => PNG.sync.read(fs.readFileSync(f)));
const maxW = 1600;

// simple row packing
let x = pad, y = pad, rowH = 0, sheetW = 0;
const pos = imgs.map((img) => {
  const w = img.width * scale, h = img.height * scale;
  if (x + w + pad > maxW && x > pad) { x = pad; y += rowH + pad; rowH = 0; }
  const p = { x, y };
  x += w + pad; rowH = Math.max(rowH, h); sheetW = Math.max(sheetW, x);
  return p;
});
const sheet = new PNG({ width: sheetW, height: y + rowH + pad });
// magenta checker background so transparency is visible
for (let i = 0; i < sheet.width * sheet.height; i++) {
  const c = ((i % sheet.width) >> 3 ^ Math.floor(i / sheet.width) >> 3) & 1 ? 60 : 90;
  sheet.data.set([c, 0, c, 255], i * 4);
}
imgs.forEach((img, n) => {
  const { x: ox, y: oy } = pos[n];
  for (let py = 0; py < img.height * scale; py++)
    for (let px = 0; px < img.width * scale; px++) {
      const si = ((Math.floor(py / scale) * img.width) + Math.floor(px / scale)) * 4;
      const a = img.data[si + 3] / 255;
      if (a === 0) continue;
      const di = ((oy + py) * sheet.width + ox + px) * 4;
      for (let c = 0; c < 3; c++) sheet.data[di + c] = Math.round(img.data[si + c] * a + sheet.data[di + c] * (1 - a));
    }
});
fs.writeFileSync(out, PNG.sync.write(sheet));
console.log(files.map((f, i) => `${i}: ${f} ${imgs[i].width}x${imgs[i].height}`).join("\n"));
