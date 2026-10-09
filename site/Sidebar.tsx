// Blume Sidebar slot, drawn with OSRS UI: section-title bands and striped list rows.
import * as React from "react";

import { List } from "@/registry/osrs/ui/list";

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
            role="listitem"
            aria-current={isActive(n.route, currentRoute) ? "page" : undefined}
            data-selected={isActive(n.route, currentRoute) || undefined}
            className="osrs-list-item osrs-site-nav-item"
          >
            {n.label}
          </a>
        ) : (
          <Group key={n.label} node={n} currentRoute={currentRoute} />
        ),
      )}
    </>
  );
}

function Group({ node, currentRoute }: { node: Extract<NavNode, { kind: "group" }>; currentRoute: string }) {
  return (
    <div className="osrs-site-nav-group">
      <div className="osrs-section-title">{node.label}</div>
      <List>
        <Pages nodes={node.children} currentRoute={currentRoute} />
      </List>
    </div>
  );
}

export default function Sidebar({ items, currentRoute }: { items: NavNode[]; currentRoute: string }) {
  const loose = items.filter((i) => i.kind === "page");
  const groups = items.filter((i): i is Extract<NavNode, { kind: "group" }> => i.kind === "group");
  return (
    <nav className="osrs-site-nav osrs-text">
      {loose.length ? (
        <List>
          <Pages nodes={loose} currentRoute={currentRoute} />
        </List>
      ) : null}
      {groups.map((g) => (
        <Group key={g.label} node={g} currentRoute={currentRoute} />
      ))}
    </nav>
  );
}
