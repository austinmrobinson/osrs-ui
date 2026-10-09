// Writes registry.json (the shadcn registry manifest). Run before `shadcn build`.
// REGISTRY_URL is where /r/*.json is served; items depend on the theme by URL.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const REGISTRY_URL = process.env.REGISTRY_URL ?? "https://osrs-ui.vercel.app/r";
const THEME = `${REGISTRY_URL}/osrs-theme.json`;

type Item = {
  name: string;
  title: string;
  description: string;
  deps?: string[];
  registryDeps?: string[];
  files: string[];
};

const ui: Item[] = [
  { name: "button", title: "Button", description: "Stone and square buttons.", deps: ["@base-ui/react", "class-variance-authority"], files: ["ui/button.tsx"] },
  { name: "interface", title: "Interface", description: "Interface window: stone inside the iron-rivet frame.", files: ["ui/interface.tsx"] },
  { name: "dialog", title: "Dialog", description: "Modal drawn as an interface window.", deps: ["@base-ui/react"], files: ["ui/dialog.tsx"] },
  { name: "tabs", title: "Tabs", description: "Slanted tab stones.", deps: ["@base-ui/react"], files: ["ui/tabs.tsx"] },
  { name: "tooltip", title: "Tooltip", description: "Yellow examine tooltip.", deps: ["@base-ui/react"], files: ["ui/tooltip.tsx"] },
  { name: "context-menu", title: "Context Menu", description: "Right-click \"Choose Option\" menu.", deps: ["@base-ui/react"], files: ["ui/context-menu.tsx"] },
  { name: "checkbox", title: "Checkbox", description: "Settings checkbox.", deps: ["@base-ui/react"], files: ["ui/checkbox.tsx"] },
  { name: "scroll-area", title: "Scroll Area", description: "In-game scrollbar.", deps: ["@base-ui/react"], files: ["ui/scroll-area.tsx"] },
  { name: "input", title: "Input", description: "Sunken text field.", deps: ["@base-ui/react"], files: ["ui/input.tsx"] },
  { name: "separator", title: "Separator", description: "Two-tone interface rule.", deps: ["@base-ui/react"], files: ["ui/separator.tsx"] },
  { name: "skill-icons", title: "Skill Icons", description: "All 24 skill icons plus total level as vector React components.", files: ["icons/skill-icons.tsx"] },
];

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
    ...ui.map((i) => ({
      name: i.name,
      type: "registry:ui",
      title: i.title,
      description: i.description,
      dependencies: i.deps,
      registryDependencies: [...(i.name === "skill-icons" ? [] : ["utils"]), THEME, ...(i.registryDeps ?? [])],
      files: i.files.map((f) => ({ path: `registry/osrs/${f}`, type: "registry:ui" })),
    })),
  ],
};

fs.writeFileSync(path.join(ROOT, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(`registry.json: ${registry.items.length} items (${REGISTRY_URL})`);
