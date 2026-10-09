"use client";

import type * as React from "react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { cn } from "@/lib/utils";
import { px } from "@/lib/osrs";

const FLAT = { orange: "#d27e14", green: "#065f06", red: "#8f0000", yellow: "#ffff00", lime: "#00c000" } as const;
/** Shaded bars use brighter fills (Combat Achievements, minigames); the GE's flat green is darker. */
const SHADED: Record<keyof typeof FLAT, string> = { ...FLAT, green: "#1fa71f", red: "#b01010" };

/**
 * Progress bar. The default is the game's textured green bar. `color` switches to a coloured bar,
 * shaded like the minigame and collection panels; add `flat` for the Grand Exchange's plain fill
 * (orange in progress, green complete, red cancelled) and for thin bars of a few pixels.
 */
function Progress({
  className,
  children,
  style,
  color,
  segments,
  flat,
  ...props
}: ProgressPrimitive.Root.Props & {
  color?: keyof typeof FLAT;
  /** Split a coloured bar into this many cells. */
  segments?: number;
  /** Plain fill without shading (Grand Exchange offers, thin tier bars). */
  flat?: boolean;
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("relative", className)}
      style={{ height: color ? px(15) : px(27), ...style }}
      {...props}
    >
      <ProgressPrimitive.Track
        data-shaded={color && !flat ? "" : undefined}
        className={cn(
          "absolute inset-0 overflow-hidden",
          color ? "osrs-progress-flat" : "osrs-progress-track",
          segments && "osrs-progress-segments",
        )}
        style={
          color
            ? ({ "--osrs-progress-color": (flat ? FLAT : SHADED)[color], "--osrs-seg": segments ? `${100 / segments}%` : undefined } as React.CSSProperties)
            : undefined
        }
      >
        <ProgressPrimitive.Indicator className={cn("absolute inset-y-0 left-0", color ? "osrs-progress-flat-indicator" : "osrs-progress-indicator")} />
      </ProgressPrimitive.Track>
      {children ? (
        <span className="osrs-text absolute inset-0 flex items-center justify-center" style={{ color: "var(--osrs-white)" }}>
          {children}
        </span>
      ) : null}
    </ProgressPrimitive.Root>
  );
}

export { Progress };
