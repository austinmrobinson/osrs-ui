import { defineConfig } from "blume";

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
  examples: {
    source: "examples",
    css: "site/examples.generated.css",
  },
});
