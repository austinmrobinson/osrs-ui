// Bundle the Gallery Ratings page (gallery/rate-app.tsx) into one self-contained HTML file for an
// Artifact: React + the library bundled by esbuild, Tailwind utilities compiled from the sources that
// use them, the OSRS theme inlined. Usage: tsx scripts/build-gallery-page.ts [interfaces|icons]
// Output: .artifacts/gallery-ratings.html or .artifacts/icon-ratings.html (gitignored).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { build } from "esbuild";

const ROOT = path.resolve(import.meta.dirname, "..");
// Which page: "interfaces" (default) or "icons"
const PAGE = process.argv[2] === "icons" ? { entry: "gallery/icon-rate-app.tsx", title: "Icon Ratings", file: "icon-ratings.html" } : { entry: "gallery/rate-app.tsx", title: "Gallery Ratings", file: "gallery-ratings.html" };
const OUT = path.join(ROOT, ".artifacts");
fs.mkdirSync(OUT, { recursive: true });

// 1. CSS: Tailwind (preflight + the utilities the components and gallery use) and the OSRS theme
const twIn = path.join(OUT, "gallery.in.css");
fs.writeFileSync(
  twIn,
  `@import "tailwindcss";
@source "../registry";
@source "../gallery";
@source "../site/demo-data";
@import "../registry/osrs/theme/osrs.css";
`,
);
const twOut = path.join(OUT, "gallery.out.css");
execFileSync(path.join(ROOT, "node_modules/.bin/tailwindcss"), ["-i", twIn, "-o", twOut, "--minify"], { cwd: ROOT, stdio: "inherit" });

// 2. JS: one IIFE with React
const js = await build({
  entryPoints: [path.join(ROOT, PAGE.entry)],
  bundle: true,
  minify: true,
  format: "iife",
  platform: "browser",
  target: "es2022",
  write: false,
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  alias: { "@/lib": path.join(ROOT, "registry/osrs/lib"), "@/components/ui": path.join(ROOT, "registry/osrs/ui"), "@": ROOT },
  logLevel: "warning",
});
const script = js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

// 3. The page: its own frame and type around the live examples
const pageCss = fs.readFileSync(path.join(ROOT, "gallery/rate-page.css"), "utf8");
const html = `<title>${PAGE.title}</title>
<style>${fs.readFileSync(twOut, "utf8")}</style>
<style>${pageCss}</style>
<div id="root"></div>
<script>${script}</script>
`;
const file = path.join(OUT, PAGE.file);
fs.writeFileSync(file, html);
console.log(`wrote ${path.relative(ROOT, file)} (${(html.length / 1e6).toFixed(2)} MB)`);
