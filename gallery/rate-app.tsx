// Entry for the Gallery Ratings page: the contrived interfaces.
import { createRoot } from "react-dom/client";

import { gallery } from "./index";
import { RatingsPage } from "./ratings-ui";

const LABELS = {
  window: "Windows",
  panel: "Side panels",
  chatbox: "Chatbox",
} as const;

/** What changed after the last round (research/ratings.md), shown beside each revised example. */
const CHANGES: Record<string, string> = {
  "deposit-box": "Inventory laid out 7 x 4, with the quantity and deposit tiles in one row below; nothing overflows.",
  "relic-picker": "Equal notched cards in a grid; a larger progress bar.",
  "enter-amount": "Chatbox text shadow actually removed this time (the round 1 fix didn't apply).",
  "make-x": "Chatbox text shadow removed; the product cards keep theirs.",
  "barbarian-assault": "Brighter green in the shaded bar.",
  "diary-overview": "Brighter green in the shaded tier bars.",
  "pet-log": "Brighter green in the shaded bar.",
  "loot-filter": "Reset to default is a metal button.",
};

createRoot(document.getElementById("root")!).render(
  <RatingsPage
    title="Gallery Ratings"
    round={3}
    lede={`${gallery.length} made-up Old School RuneScape interfaces, built from the OSRS UI library by following its interface skill. Round 3: each example shows its last score, and the ones that changed say what changed. Rate how much each one looks and reads like the real game; ratings save as you go.`}
    items={gallery.map((g) => ({
      id: g.id,
      title: g.title,
      group: g.archetype,
      groupLabel: LABELS[g.archetype],
      brief: g.brief,
      changed: CHANGES[g.id],
      render: () => <g.Component />,
    }))}
  />,
);
