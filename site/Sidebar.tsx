// Blume Sidebar slot, in the All Settings nav style: bevelled buttons in a darker column,
// the current page joined to the content like a tab. Groups get a section-title band.
import * as React from "react";

type NavNode =
  | { kind: "page"; label: string; route: string; badge?: string }
  | { kind: "group"; label: string; route?: string; children: NavNode[] };

const isActive = (route: string, current: string) => route.replace(/\/$/, "") === current.replace(/\/$/, "");

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
  return (
    <nav className="osrs-nav-list osrs-site-nav osrs-text">
      <Pages nodes={items} currentRoute={currentRoute} />
    </nav>
  );
}
