// The nav column (rendered by the page shell, components/shell/Layout.astro). Top: the site's
// concepts as side-panel tab stones (icon on a stone, red stone for the current one). Below: only
// the current concept's pages, in the All Settings nav style.
import * as React from "react";

import { NavLink } from "@/registry/osrs/ui/nav-list";
import { tabSprites } from "@/registry/osrs/ui/tab-sprites";
import { sectionOf } from "./component-sections";
import { pixelIcons, type PixelIconName } from "./pixel-icons";
import { cx, dividerBelow, focusRing } from "./styles";

type NavNode =
  | { kind: "page"; label: string; route: string; badge?: string }
  | { kind: "group"; label: string; route?: string; children: NavNode[] };

type Concept = { id: string; label: string; icon: PixelIconName; nodes: NavNode[] };

const norm = (r: string) => r.replace(/\/$/, "") || "/";
const isActive = (route: string, current: string) => norm(route) === norm(current);

/** Concept icons and order. Top-level groups become concepts; loose pages form "Getting Started". */
/** Icons are our own pixel icons (pixel-icons/*.txt, built by scripts/build-pixel-icons.ts). */
const CONCEPTS: Record<string, { icon: PixelIconName; order: number; label?: string }> = {
  "getting-started": { icon: "gettingStarted", order: 0, label: "Getting Started" },
  components: { icon: "components", order: 1 },
  recipes: { icon: "recipes", order: 2 },
  assets: { icon: "assets", order: 3 },
};
/** Loose pages that are concepts of their own. */
const STANDALONE = new Set(["/assets"]);

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function buildConcepts(items: NavNode[]): Concept[] {
  const loose: NavNode[] = [];
  const concepts: Concept[] = [];
  for (const n of items) {
    // the home page lives on the logo, not in the nav
    if (n.kind === "page" && norm(n.route) === "/") continue;
    if (n.kind === "page" && STANDALONE.has(norm(n.route))) {
      const id = slug(n.label);
      concepts.push({ id, label: n.label, icon: CONCEPTS[id]?.icon ?? "components", nodes: [n] });
    } else if (n.kind === "page") loose.push(n);
    else {
      const id = slug(n.label);
      // a folder's index page is its overview: list it first, as "Overview"
      const overview: NavNode[] = n.route && !n.children.some((c) => c.kind === "page" && norm(c.route) === norm(n.route!)) ? [{ kind: "page", label: "Overview", route: n.route }] : [];
      const children = n.children.map((c) => (c.kind === "page" && n.route && norm(c.route) === norm(n.route) ? { ...c, label: "Overview" } : c));
      concepts.push({ id, label: n.label, icon: CONCEPTS[id]?.icon ?? "components", nodes: [...overview, ...children] });
    }
  }
  if (loose.length) concepts.unshift({ id: "getting-started", label: "Getting Started", icon: "gettingStarted", nodes: loose });
  return concepts.sort((a, b) => (CONCEPTS[a.id]?.order ?? 99) - (CONCEPTS[b.id]?.order ?? 99));
}

const routesOf = (nodes: NavNode[]): string[] =>
  nodes.flatMap((n) => (n.kind === "page" ? [n.route] : [...(n.route ? [n.route] : []), ...routesOf(n.children)]));

/** Section titles: the overview pages' band, the full column width (out past the list's padding). */
const sectionTitle = "osrs-section-title mt-2 mb-1 -ms-1.5 min-h-6";
/** A page: the library's nav link. The current page's link opens into the content, over the page's
 *  own surface (the stone under the column's tint). */
const navSurface = "[--osrs-nav-surface:linear-gradient(rgb(0_0_0/0.14),rgb(0_0_0/0.14))_var(--osrs-stone)]";

function Pages({ nodes, currentRoute }: { nodes: NavNode[]; currentRoute: string }) {
  // component pages carry a usage section (site/component-sections.ts): title each run of them
  let lastSection: string | undefined;
  return (
    <>
      {nodes.map((n) => {
        if (n.kind === "page") {
          const section = sectionOf(n.route);
          const heading = section && section !== lastSection ? section : null;
          lastSection = section;
          return (
            <React.Fragment key={n.route}>
              {heading ? <div className={sectionTitle}>{heading}</div> : null}
              <NavLink href={n.route} current={isActive(n.route, currentRoute)} className={navSurface}>
                {n.label}
              </NavLink>
            </React.Fragment>
          );
        }
        lastSection = undefined;
        return (
          <React.Fragment key={n.label}>
            <div className={sectionTitle}>{n.label}</div>
            <Pages nodes={n.children} currentRoute={currentRoute} />
          </React.Fragment>
        );
      })}
    </>
  );
}

export default function Sidebar({ items, currentRoute }: { items: NavNode[]; currentRoute: string }) {
  const concepts = buildConcepts(items);
  const current =
    concepts.find((c) => routesOf(c.nodes).some((r) => isActive(r, currentRoute))) ?? concepts[0];
  return (
    <nav className="osrs-text flex flex-col pt-2 [--osrs-px:1px] lg:pt-8">
      <ul className={cx("m-0 flex list-none flex-col gap-0.5 px-2 pt-2 pb-4", dividerBelow)}>
        {concepts.map((c) => {
          const Icon = pixelIcons[c.icon];
          const active = c === current;
          const href = routesOf(c.nodes)[0] ?? "/";
          return (
            <li key={c.id}>
              <a
                href={href}
                aria-current={active ? "true" : undefined}
                className={cx("flex items-center gap-2.5 py-0.5 ps-2 pe-0.5 text-rs-orange no-underline hover:text-rs-white aria-[current=true]:text-rs-white", focusRing)}
              >
                <span className="relative inline-flex h-9 w-[33px] flex-none [&>svg]:absolute [&>svg]:inset-0">
                  {active ? <tabSprites.tabStoneMiddleSelected /> : <tabSprites.tabStoneMiddle />}
                  <Icon />
                </span>
                <span>{c.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
      {/* page-specific controls (the Assets page's export options) portal in here */}
      <div id="osrs-site-sidebar-slot" />
      {/* a concept with one page is that page: no list */}
      {current && !(current.nodes.length === 1 && current.nodes[0].kind === "page") ? (
        <div className="osrs-nav-list bg-transparent bg-none shadow-none" aria-label={current.label}>
          <Pages nodes={current.nodes} currentRoute={currentRoute} />
        </div>
      ) : null}
    </nav>
  );
}
