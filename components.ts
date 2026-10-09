import { defineComponents } from "blume";

import { A, Blockquote, Code, H2, H3, H4, Hr, Li, Ol, P, Pre, Strong, Table, Tbody, Td, Th, Thead, Tr, Ul } from "./site/mdx/Prose";

// The docs site is drawn with the library itself, in our own markup: Blume renders the content and
// supplies the data (routes, navigation, search, SEO), and every element on the page is one of ours,
// styled with Tailwind classes. The page shell replaces Blume's whole layout; the Markdown elements
// and the MDX components the docs use are mapped below.
export default defineComponents({
  mdx: {
    h2: H2,
    h3: H3,
    h4: H4,
    p: P,
    a: A,
    strong: Strong,
    ul: Ul,
    ol: Ol,
    li: Li,
    hr: Hr,
    code: Code,
    pre: Pre,
    table: Table,
    thead: Thead,
    tbody: Tbody,
    tr: Tr,
    th: Th,
    td: Td,
    blockquote: Blockquote,
    Component: "./components/blume/Component.astro",
    ComponentGrid: "./site/ComponentGrid.tsx",
    RecipeGrid: "./site/RecipeGrid.tsx",
    LandingHero: { component: "./site/LandingHero.tsx", client: "load" },
    HomeBelow: { component: "./site/HomeBelow.tsx", client: "load" },
    AssetBrowser: { component: "./site/AssetBrowser.tsx", client: "load" },
  },
  layout: {
    Layout: "./components/shell/Layout.astro",
  },
});
