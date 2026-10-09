// Indexes the docs for the site's own search (site/Search.tsx): every page's route, title,
// description, a short summary for the result row, section, outline, and the pre-rendered previews
// to show on its stage. Writes site/search-index.generated.json. Usage: tsx scripts/build-search.ts
import fs from "node:fs";
import path from "node:path";

import { COMPONENT_SECTIONS } from "../site/component-sections";

const ROOT = path.resolve(import.meta.dirname, "..");
const DOCS = path.join(ROOT, "docs");
const OUT = path.join(ROOT, "site/search-index.generated.json");
const PREVIEWS = Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, "site/previews.generated.json"), "utf8")));

/** `outline` is the page's structure in reading order: `depth` 0 for a section, 1 for what's under it. */
type Outline = { text: string; depth: 0 | 1 };
type Entry = {
  route: string;
  title: string;
  description: string;
  summary: string;
  section: string;
  headings: string[];
  outline: Outline[];
  previews: string[];
  example?: string;
};

const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : d.name.endsWith(".mdx") ? [path.join(dir, d.name)] : []));

const field = (fm: string, key: string) =>
  fm.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, "m"))?.[1]?.replace(/\\"/g, '"').replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))) ?? "";

/** The description's first clause, for the second line of a result row ("Button / Text and icon buttons"). */
const summarise = (description: string) => description.split(/:\s| - |\.\s|\.$|, (?=with|built|drawn|plus)/)[0].trim();

/** Headings, examples and the overview grids, in the order they appear on the page. Code is skipped. */
function outlineOf(body: string, rel: string, titles: Map<string, string>): Outline[] {
  const out: Outline[] = [];
  const prose = body.replace(/```[\s\S]*?```/g, "");
  const re = /^(##|###)\s+(.+)$|<Component path="([^"]+)"|<ComponentGrid\s*\/>|<RecipeGrid\s*\/>|<AssetBrowser\s*\/>|<(?:Card|IconListItem)\b[^>]*\btitle="([^"]+)"/gm;
  for (const m of prose.matchAll(re)) {
    if (m[1]) out.push({ text: m[2].trim(), depth: m[1] === "##" ? 0 : 1 });
    else if (m[3]) out.push({ text: m[3].endsWith("/playground") ? "Playground" : "Example", depth: out.length ? 1 : 0 });
    else if (m[0].startsWith("<ComponentGrid")) for (const s of COMPONENT_SECTIONS) out.push({ text: s.title, depth: 0 }, ...s.pages.map((p) => ({ text: titles.get(`components/${p}`) ?? p, depth: 1 as const })));
    else if (m[0].startsWith("<RecipeGrid")) for (const [k, t] of titles) k.startsWith("recipes/") && k !== "recipes/index" && out.push({ text: t, depth: 0 });
    else if (m[0].startsWith("<AssetBrowser")) out.push({ text: "Asset browser", depth: 0 });
    else if (m[4]) out.push({ text: m[4], depth: 1 });
  }
  // a recipe page is one example with Preview and Code tabs
  if (rel.startsWith("recipes/") && rel !== "recipes/index") out.push({ text: "Preview", depth: 1 }, { text: "Code", depth: 1 });
  return out;
}

const files = walk(DOCS).map((file) => {
  const rel = path.relative(DOCS, file).replace(/\.mdx$/, "");
  const src = fs.readFileSync(file, "utf8");
  const fm = src.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  return { rel, fm, body: src.slice(fm.length + 8) };
});
const titles = new Map(files.map((f) => [f.rel, field(f.fm, "title") || f.rel]));

const entries: Entry[] = files.map(({ rel, fm, body }) => {
  const route = "/" + rel.replace(/(^|\/)index$/, "").replace(/^\/$/, "");
  const [top, page] = rel.split("/");
  let section = "Getting Started";
  if (top === "components") section = page === "index" ? "Components" : `Components · ${COMPONENT_SECTIONS.find((s) => s.pages.includes(page))?.title ?? "Other"}`;
  else if (top === "recipes") section = "Recipes";
  else if (top === "assets") section = "Assets";
  const description = field(fm, "description");
  // the page's own preview; an overview shows three of the pages it lists
  const previews = PREVIEWS.includes(rel)
    ? [rel]
    : rel === "components/index"
      ? ["components/button", "components/item-slot", "components/progress"]
      : rel === "recipes/index"
        ? ["recipes/bank", "recipes/grand-exchange", "recipes/world-switcher"]
        : [];
  return {
    route: route === "" ? "/" : route,
    title: field(fm, "title") || rel,
    description,
    summary: summarise(description),
    section,
    headings: [...body.matchAll(/^###?\s+(.+)$/gm)].map((m) => m[1].trim()),
    outline: outlineOf(body, rel, titles),
    previews,
    example: body.match(/<Component path="([^"]+)"/)?.[1],
  };
});

const order = ["Getting Started", ...COMPONENT_SECTIONS.map((s) => `Components · ${s.title}`), "Components", "Recipes", "Assets"];
entries.sort((a, b) => order.indexOf(a.section) - order.indexOf(b.section) || a.title.localeCompare(b.title));
fs.writeFileSync(OUT, JSON.stringify(entries, null, 2) + "\n");
console.log(`${path.relative(ROOT, OUT)}: ${entries.length} pages`);
