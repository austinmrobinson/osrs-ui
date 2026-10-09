"use client";

import * as React from "react";
import { Toggle } from "@base-ui/react/toggle";

import { cn } from "@/lib/utils";
import { px } from "@/lib/osrs";
import { prayerSprites } from "@/components/ui/prayer-sprites";

type PrayerName = Exclude<keyof typeof prayerSprites, `${string}Disabled` | "activatedBackground" | "iconSmall">;

/** A prayer-book toggle: the glowing backing appears when active, the dimmed icon when locked. */
function PrayerButton({
  prayer,
  locked,
  className,
  style,
  ...props
}: Toggle.Props & { prayer: PrayerName; locked?: boolean }) {
  const Icon = (locked ? prayerSprites[`${prayer}Disabled` as keyof typeof prayerSprites] : prayerSprites[prayer]) ?? prayerSprites[prayer];
  return (
    <Toggle
      data-slot="prayer-button"
      aria-label={prayer}
      disabled={locked}
      className={cn("osrs-prayer-button group relative border-0 bg-transparent p-0", className)}
      style={{ width: px(37), height: px(37), ...style }}
      {...props}
    >
      <prayerSprites.activatedBackground className="absolute opacity-0 group-data-[pressed]:opacity-100" style={{ left: px(1), top: px(1) }} />
      <Icon className="absolute" style={{ left: px(3), top: px(3) }} />
    </Toggle>
  );
}

export { PrayerButton };
export type { PrayerName };
