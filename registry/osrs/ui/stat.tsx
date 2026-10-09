import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statVariants = cva("osrs-stat osrs-text", {
  variants: {
    variant: {
      /** Black inset box, label over value ("BH Points / 0" in stores) */
      boxed: "osrs-stat-boxed",
      /** One line, "Label: value" ("Event Points: 0", "Completed: 998") */
      inline: "osrs-stat-inline",
    },
  },
  defaultVariants: { variant: "boxed" },
});

/** A labelled value: points, totals, counts. Label in orange, value in white. */
function Stat({
  label,
  value,
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof statVariants> & { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div data-slot="stat" className={cn(statVariants({ variant }), className)} {...props}>
      <span className="osrs-stat-label">
        {label}
        {variant === "inline" ? ":" : null}
      </span>
      <span className="osrs-stat-value">{value}</span>
    </div>
  );
}

export { Stat, statVariants };
