import * as React from "react";

import { cn } from "@/lib/utils";
import { px, statusColor } from "@/lib/osrs";
import { orbSprites } from "@/components/ui/orb-sprites";

type OrbKind = "hitpoints" | "prayer" | "run" | "special";
type OrbStatus = "poison" | "venom" | "disease";

const fills = {
  hitpoints: orbSprites.hitpoints,
  prayer: orbSprites.prayer,
  run: orbSprites.run,
  special: orbSprites.special,
};
const activeFills = { prayer: orbSprites.prayerActivated, run: orbSprites.runActivated, special: orbSprites.specialActivated };
const icons = {
  hitpoints: orbSprites.hitpointsIcon,
  prayer: orbSprites.prayerIcon,
  run: orbSprites.runIcon,
  special: orbSprites.specialIcon,
};
const statusFills = { poison: orbSprites.hitpointsPoison, venom: orbSprites.hitpointsVenom, disease: orbSprites.hitpointsDisease };

/** Minimap stat orb: frame, number, and a fill that drains from the top. */
function Orb({
  kind,
  value,
  max = 100,
  active,
  status,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & { kind: OrbKind; value: number; max?: number; active?: boolean; status?: OrbStatus }) {
  const fraction = Math.max(0, Math.min(1, value / max));
  const Fill =
    kind === "hitpoints" && status ? statusFills[status] : active && kind !== "hitpoints" ? activeFills[kind] : fills[kind];
  const Icon = kind === "prayer" && active ? orbSprites.prayerIconActivated : kind === "run" && active ? orbSprites.runIconActivated : icons[kind];
  const Frame = orbSprites.frame;
  return (
    <div
      role="meter"
      aria-label={kind}
      aria-valuenow={value}
      aria-valuemax={max}
      data-slot="orb"
      className={cn("relative", className)}
      style={{ width: px(57), height: px(34), ...style }}
      {...props}
    >
      <Frame className="absolute inset-0" />
      <div className="absolute" style={{ left: px(27), top: px(4), width: px(26), height: px(26) }}>
        <orbSprites.empty className="absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ height: `${fraction * 100}%` }}>
          <Fill className="absolute bottom-0 left-0" />
        </div>
        <Icon className="absolute inset-0" />
      </div>
      <span
        className="osrs-text osrs-text-small absolute text-center"
        style={{ left: px(3), width: px(24), top: px(14), color: statusColor(fraction) }}
      >
        {value}
      </span>
    </div>
  );
}

export { Orb };
export type { OrbKind, OrbStatus };
