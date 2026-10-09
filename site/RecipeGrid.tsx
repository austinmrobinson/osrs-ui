// MDX <RecipeGrid>: the Recipes overview. Each recipe's pre-rendered screenshot in a notched card,
// its name underneath, linking to the recipe.
import * as React from "react";

import { cardVariants } from "@/registry/osrs/ui/card";
import { MoreCard } from "./MoreCard";
import { PreviewImage } from "./PreviewImage";
import { cardGrid, cardLink, cardTitle, cx, gridCard, gridPreview } from "./styles";

/** Recipe cards are the component cards (same grid, card and preview box), with every recipe drawn
 *  at this one scale of its preview: small enough that the tallest (All Settings, 281px) fits the
 *  132px preview box. */
const RECIPE_SCALE = 0.46;

const RECIPES: [string, string][] = [
  ["side-panel", "Side Panel"],
  ["bank", "Bank"],
  ["all-settings", "All Settings"],
  ["grand-exchange", "Grand Exchange"],
  ["collection-log", "Collection Log"],
  ["combat-achievements", "Combat Achievements"],
  ["world-switcher", "World Switcher"],
  ["skill-guide", "Skill Guide"],
  ["dialogue", "NPC Dialogue"],
  ["chat", "Chatbox"],
  ["orbs", "Orbs & XP drops"],
  ["settings", "Settings (classic)"],
];

/** `only`: show just these recipes (by slug), in this order, then an "All recipes" tile (the home page). */
export default function RecipeGrid({ only }: { only?: string[] }) {
  const shown = only ? only.map((slug) => RECIPES.find(([s]) => s === slug)!).filter(Boolean) : RECIPES;
  return (
    <div className={cardGrid}>
      {shown.map(([slug, name]) => (
        <a key={slug} href={`/recipes/${slug}`} className={cx(cardVariants({ variant: "flat" }), gridCard, cardLink)}>
          <span className={gridPreview} aria-hidden="true" inert>
            <PreviewImage page={`recipes/${slug}`} scale={RECIPE_SCALE} />
          </span>
          <span className={cardTitle}>{name}</span>
        </a>
      ))}
      {only ? <MoreCard href="/recipes" title="All recipes" /> : null}
    </div>
  );
}
