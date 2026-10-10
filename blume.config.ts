import { defineConfig } from "blume";

import { osrsCodeTheme } from "./site/code-theme";
import { REGISTRY_URL } from "./site/site-url";

export default defineConfig({
  title: "OSRS UI",
  description: "Pixel-exact, vector Old School RuneScape components and icons for shadcn/ui.",
  theme: {
    accent: "#ff981f",
    radius: "none",
    mode: "dark",
  },
  feedback: { enabled: false },
  // one share card for every page: public/og.png (site/og/OgImages.tsx, concept 6), set in the shell
  seo: { og: { enabled: false } },
  variables: {
    // follows site/site-url.ts: change the domain there
    registry: REGISTRY_URL,
  },
  // code blocks use only the game's text colours (site/code-theme.ts)
  markdown: { code: { theme: { dark: osrsCodeTheme, light: osrsCodeTheme } } },
  examples: {
    source: "examples",
    css: "site/examples.generated.css",
  },
});
