"use client";

// The art on the homepage's contents cards, drawn with the library itself where it can be: a lone
// Accept button for Components, the Bank for Recipes (a screenshot of the recipe), and five sprites
// for Assets. Each scene is a fixed 360 x 240 box that the card clips.
import { Button } from "@/registry/osrs/ui/button";
import { prayerSprites } from "@/registry/osrs/ui/prayer-sprites";
import { skillIcons } from "@/registry/osrs/ui/skill-icons";
import { PreviewImage } from "./PreviewImage";
import { cx } from "./styles";

type Section = "components" | "recipes" | "assets";

const scene = "relative block h-[240px] w-[360px] shrink-0 overflow-hidden";

export function StageArt({ section }: { section: Section }) {
  if (section === "components")
    return (
      <span className={cx(scene, "flex items-center justify-center [--osrs-px:2px]")}>
        <Button tabIndex={-1}>Accept</Button>
      </span>
    );
  if (section === "recipes") return <PreviewImage page="recipes/bank" eager />;
  // five sprites at 2x: three across, two centred under them
  return (
    <span className={cx(scene, "flex flex-col items-center justify-center gap-1")}>
      <span className="flex items-center gap-3">
        <skillIcons.magic scale={2} />
        <prayerSprites.piety scale={2} />
        <skillIcons.sailing scale={2} />
      </span>
      <span className="flex items-center gap-3">
        <skillIcons.attack scale={2} />
        <skillIcons.hitpoints scale={2} />
      </span>
    </span>
  );
}
