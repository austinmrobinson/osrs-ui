"use client";

import type * as React from "react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { cn } from "@/lib/utils";
import { px } from "@/lib/osrs";

const FLAT = { orange: "#d27e14", green: "#065f06", red: "#8f0000", yellow: "#c8c800" } as const;

/**
 * Progress bar. The default is the game's shaded green bar; `color` switches to the flat
 * Grand Exchange-style bar (orange in progress, green complete, red cancelled).
 */
function Progress({
  className,
  children,
  style,
  color,
  ...props
}: ProgressPrimitive.Root.Props & { color?: keyof typeof FLAT }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("relative", className)}
      style={{ height: color ? px(15) : px(27), ...style }}
      {...props}
    >
      <ProgressPrimitive.Track
        className={cn("absolute inset-0 overflow-hidden", color ? "osrs-progress-flat" : "osrs-progress-track")}
        style={color ? ({ "--osrs-progress-color": FLAT[color] } as React.CSSProperties) : undefined}
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
