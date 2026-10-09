import { defineComponents } from "blume";

// The docs site is drawn with the library itself: every piece of Blume chrome
// that renders on a page is either a React override (site/*.tsx) or an ejected
// Blume component re-skinned with OSRS UI classes and sprites (components/blume/*).
export default defineComponents({
  mdx: {
    Callout: "./site/Callout.tsx",
    Card: "./site/Card.tsx",
    IconList: "./site/IconList.tsx",
    IconListItem: "./site/IconListItem.tsx",
    AssetBrowser: { component: "./site/AssetBrowser.tsx", client: "load" },
    CardGroup: "./components/blume/CardGroup.astro",
    Tabs: "./components/blume/Tabs.astro",
    Tab: "./components/blume/Tab.astro",
    CodeGroup: "./components/blume/CodeGroup.astro",
    Steps: "./components/blume/Steps.astro",
    Step: "./components/blume/Step.astro",
    Accordion: "./components/blume/Accordion.astro",
    AccordionItem: "./components/blume/AccordionItem.astro",
    Expandable: "./components/blume/Expandable.astro",
    Badge: "./components/blume/Badge.astro",
    Panel: "./components/blume/Panel.astro",
    Tooltip: "./components/blume/Tooltip.astro",
    Tile: "./components/blume/Tile.astro",
    Frame: "./components/blume/Frame.astro",
  },
  layout: {
    Header: "./components/blume/Header.astro",
    Logo: "./site/Logo.tsx",
    Sidebar: "./site/Sidebar.tsx",
    Breadcrumbs: "./components/blume/Breadcrumbs.astro",
    TableOfContents: "./components/blume/TableOfContents.astro",
    Pagination: "./site/Pagination.tsx",
    Footer: "./site/Footer.tsx",
  },
});
