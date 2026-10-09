import { defineConfig } from "blume";

import { osrsCodeTheme } from "./site/code-theme";

export default defineConfig({
  title: "OSRS UI",
  description: "Pixel-exact, vector Old School RuneScape components and icons for shadcn/ui.",
  theme: {
    accent: "#ff981f",
    radius: "none",
    mode: "dark",
  },
  feedback: { enabled: false },
  variables: {
    // Change once the site has a real domain.
    registry: "https://osrs-ui.vercel.app/r",
  },
  // code blocks use only the game's text colours (site/code-theme.ts)
  markdown: { code: { theme: { dark: osrsCodeTheme, light: osrsCodeTheme } } },
  examples: {
    source: "examples",
    css: "site/examples.generated.css",
  },
});
