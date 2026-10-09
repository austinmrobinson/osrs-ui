// Writes registry.json (the shadcn registry manifest). Run before `shadcn build`.
// Every file in registry/osrs/ui becomes an item; npm and registry dependencies are
// derived from its imports. REGISTRY_URL is where /r/*.json is served.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const UI = path.join(ROOT, "registry/osrs/ui");
const REGISTRY_URL = process.env.REGISTRY_URL ?? "https://osrs-ui.vercel.app/r";
const url = (name: string) => `${REGISTRY_URL}/${name}.json`;

const DESCRIPTIONS: Record<string, string> = {
  button: "Stone, square, metal and flat buttons.",
  interface: "Classic interface window: stone inside the iron-rivet frame.",
  window: "Modern interface window: stone inside the thick tan border, with a header row.",
  dialog: "Modal drawn as an interface window.",
  card: "Notched, Grand Exchange offer, and outline cards.",
  tabs: "Slanted tab stones.",
  "nav-list": "Vertical category nav (All Settings).",
  list: "Striped, selectable list rows, with media, title and description for rich rows.",
  field: "Field sets and fields (shadcn Field API): the game's group box and settings rows.",
  "dropdown-menu": "Dropdown menu (shadcn API) drawn as the game's view menu.",
  toggle: "A single on/off tile, red while pressed.",
  "toggle-group": "A row of tiles where the chosen one stays pressed (quantities).",
  stat: "Labelled values: the boxed currency footer and inline Label: value.",
  "status-icon": "Round green check / red cross marks.",
  "description-list": "Label / value rows, optionally striped.",
  tooltip: "Yellow examine tooltip.",
  "context-menu": "Right-click \"Choose Option\" menu.",
  checkbox: "Settings checkbox.",
  "radio-group": "Round settings radio buttons.",
  select: "Dropdown select.",
  "number-field": "Grand Exchange number field.",
  slider: "Settings slider.",
  progress: "Interface progress bars.",
  "scroll-area": "In-game scrollbar.",
  input: "Sunken text field.",
  separator: "Two-tone interface rule.",
  "item-slot": "Item slot with stack quantities, and the 28-slot inventory grid.",
  orb: "Minimap stat orbs.",
  "skill-tile": "Stats-tab skill tiles.",
  "equipment-slot": "Equipment slots and the worn-equipment grid.",
  "prayer-button": "Prayer-book toggle.",
  "side-panel": "Resizable-mode side panel with tab stones.",
  chatbox: "Chatbox, chat filter tabs, NPC and option dialogues.",
  "xp-drop": "XP drops.",
};

const title = (n: string) => n.replace(/(^|-)(\w)/g, (_, s, c: string) => (s ? " " : "") + c.toUpperCase());

const items = fs
  .readdirSync(UI)
  .filter((f) => f.endsWith(".tsx"))
  .sort()
  .map((file) => {
    const name = file.replace(/\.tsx$/, "");
    const src = fs.readFileSync(path.join(UI, file), "utf8");
    const imports = [...src.matchAll(/from "([^"]+)"/g)].map((m) => m[1]);
    const deps = new Set<string>();
    const regDeps = new Set<string>([url("osrs-theme")]);
    for (const i of imports) {
      if (i.startsWith("@base-ui/react")) deps.add("@base-ui/react");
      else if (i === "class-variance-authority") deps.add("class-variance-authority");
      else if (i === "@/lib/utils") regDeps.add("utils");
      else if (i === "@/lib/sprite" || i === "@/lib/osrs" || i === "@/lib/movable") regDeps.add(url("osrs-lib"));
      else if (i.startsWith("@/components/ui/")) regDeps.add(url(i.slice("@/components/ui/".length)));
    }
    const sprites = name.endsWith("-sprites") || name === "skill-icons";
    return {
      name,
      type: "registry:ui",
      title: title(name),
      description: DESCRIPTIONS[name] ?? (sprites ? `Pixel-exact ${name.replace(/-(sprites|icons)$/, "")} sprites as React components.` : undefined),
      dependencies: deps.size ? [...deps] : undefined,
      registryDependencies: sprites ? [url("osrs-lib")] : [...regDeps],
      files: [{ path: `registry/osrs/ui/${file}`, type: "registry:ui" }],
    };
  });

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "osrs-ui",
  homepage: REGISTRY_URL.replace(/\/r$/, ""),
  items: [
    {
      name: "osrs-theme",
      type: "registry:theme",
      title: "OSRS theme",
      description: "Tokens, fonts, 9-slice frames and textures (one self-contained stylesheet).",
      files: [{ path: "registry/osrs/theme/osrs.css", type: "registry:file", target: "styles/osrs.css" }],
    },
    {
      name: "osrs-lib",
      type: "registry:lib",
      title: "OSRS helpers",
      description: "createSprite, px() and quantity/colour helpers used by the components.",
      files: [
        { path: "registry/osrs/lib/sprite.tsx", type: "registry:lib" },
        { path: "registry/osrs/lib/osrs.ts", type: "registry:lib" },
        { path: "registry/osrs/lib/movable.ts", type: "registry:lib" },
      ],
    },
    ...items,
  ],
};

fs.writeFileSync(path.join(ROOT, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(`registry.json: ${registry.items.length} items (${REGISTRY_URL})`);
