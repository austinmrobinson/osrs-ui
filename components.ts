import { defineComponents } from "blume";

// The docs site is drawn with the library itself.
export default defineComponents({
  mdx: {
    Callout: "./site/Callout.tsx",
    Card: "./site/Card.tsx",
    AssetBrowser: { component: "./site/AssetBrowser.tsx", client: "load" },
  },
  layout: {
    Logo: "./site/Logo.tsx",
    Sidebar: "./site/Sidebar.tsx",
    Pagination: "./site/Pagination.tsx",
    Footer: "./site/Footer.tsx",
  },
});
