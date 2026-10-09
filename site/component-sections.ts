// The components sidebar, grouped by what each component is used for. Order here is the order in
// the sidebar; docs/components/meta.ts lists the same pages in the same order.
export const COMPONENT_SECTIONS: { title: string; pages: string[] }[] = [
  { title: "Controls", pages: ["button", "sprite-button", "split-button", "toggle", "toggle-group", "checkbox", "radio-group", "select", "number-field", "slider", "input", "search-field", "tabs", "nav-list", "dropdown-menu", "context-menu"] },
  { title: "Containers", pages: ["window", "interface", "side-panel", "chatbox", "dialog", "card", "field", "scroll-area", "separator", "popover", "code-block", "steps"] },
  { title: "Data Display", pages: ["list", "description-list", "stat", "status-icon", "progress", "tooltip", "shortcut", "xp-drop"] },
  { title: "Game Elements", pages: ["item-slot", "equipment-slot", "skill-tile", "prayer-button", "orb"] },
  { title: "Icons", pages: ["skill-icons", "sprites"] },
];

/** Section title for a component route ("/components/button"), if it has one. */
export const sectionOf = (route: string): string | undefined => {
  const m = route.replace(/\/$/, "").match(/^\/components\/([^/]+)$/);
  return m ? COMPONENT_SECTIONS.find((s) => s.pages.includes(m[1]))?.title : undefined;
};
