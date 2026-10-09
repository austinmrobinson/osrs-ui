// Blume Sidebar slot. Top: the site's concepts as side-panel tab stones (icon on a stone,
// red stone for the current one). Below: only the current concept's pages, in the
// All Settings nav style.
import * as React from "react";

import { tabSprites } from "@/registry/osrs/ui/tab-sprites";
import { pixelIcons, type PixelIconName } from "./pixel-icons";

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
    if (n.kind === "page" && STANDALONE.has(norm(n.route))) {
      const id = slug(n.label);
      concepts.push({ id, label: n.label, icon: CONCEPTS[id]?.icon ?? "components", nodes: [n] });
    } else if (n.kind === "page") loose.push(n);
    else {
      const id = slug(n.label);
      concepts.push({ id, label: n.label, icon: CONCEPTS[id]?.icon ?? "components", nodes: n.children });
    }
  }
  if (loose.length) concepts.unshift({ id: "getting-started", label: "Getting Started", icon: "gettingStarted", nodes: loose });
  return concepts.sort((a, b) => (CONCEPTS[a.id]?.order ?? 99) - (CONCEPTS[b.id]?.order ?? 99));
}

const routesOf = (nodes: NavNode[]): string[] =>
  nodes.flatMap((n) => (n.kind === "page" ? [n.route] : [...(n.route ? [n.route] : []), ...routesOf(n.children)]));

function Pages({ nodes, currentRoute }: { nodes: NavNode[]; currentRoute: string }) {
  return (
    <>
      {nodes.map((n) =>
        n.kind === "page" ? (
          <a
            key={n.route}
            href={n.route}
            aria-current={isActive(n.route, currentRoute) ? "page" : undefined}
            className="osrs-nav-item osrs-text osrs-site-nav-item"
          >
            {n.label}
          </a>
        ) : (
          <React.Fragment key={n.label}>
            <div className="osrs-section-title osrs-site-nav-title">{n.label}</div>
            <Pages nodes={n.children} currentRoute={currentRoute} />
          </React.Fragment>
        ),
      )}
    </>
  );
}

export default function Sidebar({ items, currentRoute }: { items: NavNode[]; currentRoute: string }) {
  const concepts = buildConcepts(items);
  const current =
    concepts.find((c) => routesOf(c.nodes).some((r) => isActive(r, currentRoute))) ?? concepts[0];
  return (
    <nav className="osrs-site-sidenav osrs-text">
      <ul className="osrs-site-concepts">
        {concepts.map((c) => {
          const Icon = pixelIcons[c.icon];
          const active = c === current;
          const href = routesOf(c.nodes)[0] ?? "/";
          return (
            <li key={c.id}>
              <a href={href} aria-current={active ? "true" : undefined} className="osrs-site-concept">
                <span className="osrs-site-concept-stone">
                  {active ? <tabSprites.tabStoneMiddleSelected /> : <tabSprites.tabStoneMiddle />}
                  <Icon />
                </span>
                <span>{c.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
      {current && !(current.nodes.length === 1 && current.nodes[0].kind === "page" && STANDALONE.has(norm(current.nodes[0].route))) ? (
        <div className="osrs-nav-list osrs-site-nav" aria-label={current.label}>
          <Pages nodes={current.nodes} currentRoute={currentRoute} />
        </div>
      ) : null}
    </nav>
  );
}
