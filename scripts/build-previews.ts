// Screenshots every component and recipe to public/previews/<section>/<page>.png, for the
// Components and Recipes overview cards and the search window's page previews. Images keep their
// pixels exact; rendering the live UI shrunk into a card blurred and mis-scaled it.
// Everything is drawn at the game's own scale (one game pixel = 1 CSS px, 16px text), so sizes
// compare true across cards. Components come from examples/previews/card.tsx (menus and dialogs
// open, game elements on nothing), recipes from their own examples. Components are shown at 1x,
// the same size as the site's own text; whole recipe screens at half that, so they fit their cards
// at one shared scale. Both are shot at 2 device pixels per game pixel (half-size recipes are then
// one device pixel per game pixel on 2x screens, still crisp).
// Needs the dev server running (pnpm dev); set PREVIEW_ORIGIN to point elsewhere.
// Usage: tsx scripts/build-previews.ts [page ...]
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const ROOT = path.resolve(import.meta.dirname, "..");
const ORIGIN = process.env.PREVIEW_ORIGIN ?? "http://localhost:4321";
const OUT = path.join(ROOT, "public/previews");
const only = new Set(process.argv.slice(2));

/** Each docs page that has an example; components are drawn by the previews page. */
function pages(section: "components" | "recipes") {
  const dir = path.join(ROOT, "docs", section);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") && f !== "index.mdx")
    .map((f) => {
      const example = fs.readFileSync(path.join(dir, f), "utf8").match(/<Component path="([^"]+)"/)?.[1];
      return { section, page: f.replace(/\.mdx$/, ""), example };
    })
    .filter((p): p is { section: typeof section; page: string; example: string } => !!p.example && (!only.size || only.has(p.page)));
}

const browser = await chromium.launch();
// under 1040px wide the example frames draw at the game's 1x (site/examples.css)
const VIEWPORT = { width: 1000, height: 900 };
const DISPLAY = { components: 1, recipes: 0.5 } as const;
const pages_ = {
  components: await (await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 })).newPage(),
  recipes: await (await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 })).newPage(),
};
let n = 0;
const MANIFEST = path.join(ROOT, "site/previews.generated.json");
const manifest: Record<string, { src: string; width: number; height: number }> = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
for (const p of [...pages("components"), ...pages("recipes")]) {
  const page = pages_[p.section];
  const url = p.section === "components" ? `${ORIGIN}/blume-examples/previews/card?page=${p.page}` : `${ORIGIN}/blume-examples/${p.example}`;
  // the dev server sometimes aborts a navigation while it reloads a module; try again
  for (let tries = 0; ; tries++) {
    try {
      await page.goto(url, { waitUntil: "networkidle" });
      break;
    } catch (e) {
      if (tries >= 2) throw e;
      await page.waitForTimeout(1000);
    }
  }
  await page.evaluate(() => document.fonts.ready);
  // menus that open on right-click (Context Menu)
  const rc = await page.$("[data-preview-rightclick]");
  if (rc) {
    const b = (await rc.boundingBox())!;
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2, { button: "right" });
  }
  await page.waitForTimeout(300);
  // the subject: the playground's stage contents, or everything the demo draws; clip to the union
  // of its visible boxes so the image has no empty margin
  const box = await page.evaluate(() => {
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
    for (const el of document.querySelectorAll<HTMLElement>("body, body > div, .osrs-texture-stone")) el.style.background = "transparent";
    const root = document.body;
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    const who: string[] = [];
    for (const el of root.querySelectorAll<HTMLElement>("*")) {
      if (el.closest("aside")) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "contents" || cs.opacity === "0") continue;
      // visually hidden form inputs (Base UI's checkbox, select, slider) and other clipped helpers
      if (cs.clipPath !== "none" || cs.clip !== "auto" || /^(SCRIPT|STYLE|TEMPLATE)$/.test(el.tagName)) continue;
      if (el.tagName === "INPUT" && (el.getAttribute("aria-hidden") === "true" || (el as HTMLInputElement).type === "hidden")) continue;
      // skip layout wrappers that only pad: count elements that paint or hold text
      // an element counts if it holds text of its own or is an image; empty boxes (menus' invisible
      // full-screen layers) don't
      const ownText = [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && !!n.textContent?.trim());
      const leafDraws = ownText || (el.children.length === 0 && (/^(svg|SVG|IMG|INPUT|CANVAS|TEXTAREA)$/.test(el.tagName) || !!el.textContent?.trim()));
      const paints = leafDraws || el.tagName.toLowerCase() === "svg" || cs.backgroundImage !== "none" || cs.borderImageSource !== "none" || cs.boxShadow !== "none" || (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent");
      if (!paints) continue;
      // clip to every scrolling / clipping ancestor, so rows scrolled out of a Scroll Area don't count
      const r0 = el.getBoundingClientRect();
      let rc = { left: r0.left, top: r0.top, right: r0.right, bottom: r0.bottom, width: 0, height: 0 };
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const acs = getComputedStyle(a);
        if (acs.overflowX === "visible" && acs.overflowY === "visible") continue;
        const ar = a.getBoundingClientRect();
        rc = { ...rc, left: Math.max(rc.left, ar.left), top: Math.max(rc.top, ar.top), right: Math.min(rc.right, ar.right), bottom: Math.min(rc.bottom, ar.bottom) };
      }
      rc.width = rc.right - rc.left; rc.height = rc.bottom - rc.top;
      if (rc.width < 1 || rc.height < 1) continue;
      if (rc.left < l || rc.top < t || rc.right > r || rc.bottom > b) who.push(`${el.tagName}.${String(el.className).slice(0, 30)} ${Math.round(rc.left)},${Math.round(rc.top)},${Math.round(rc.width)}x${Math.round(rc.height)}`);
      l = Math.min(l, rc.left); t = Math.min(t, rc.top); r = Math.max(r, rc.right); b = Math.max(b, rc.bottom);
    }
    (window as unknown as { __box: unknown }).__box = { l, t, r, b, who };
    return { x: Math.floor(l), y: Math.floor(t), width: Math.ceil(r - Math.floor(l)), height: Math.ceil(b - Math.floor(t)) };
  });
  if (!Number.isFinite(box.width) || box.width < 1) {
    console.warn(`skipped ${p.section}/${p.page}: nothing drawn`);
    delete manifest[`${p.section}/${p.page}`];
    continue;
  }
  if (process.env.DEBUG_PREVIEWS) console.log(p.page, await page.evaluate(() => (window as unknown as { __box: { who: string[] } }).__box.who.slice(-4)));
  // one game pixel of room for drop shadows
  const clip = { x: box.x - 1, y: box.y - 1, width: box.width + 2, height: box.height + 2 };
  const file = path.join(OUT, p.section, `${p.page}.png`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file, clip, omitBackground: true });
  // display size in CSS px
  manifest[`${p.section}/${p.page}`] = { src: `/previews/${p.section}/${p.page}.png`, width: Math.round(clip.width * DISPLAY[p.section]), height: Math.round(clip.height * DISPLAY[p.section]) };
  n++;
}
await browser.close();
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`public/previews: ${n} images`);
