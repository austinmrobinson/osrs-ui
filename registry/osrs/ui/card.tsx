import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva("osrs-card osrs-framed osrs-text", {
  variants: {
    variant: {
      /** Notched stone card (Character Summary, settings groups) */
      flat: "osrs-card-flat osrs-frame-flat",
      /** Grand Exchange offer slot, with a divided header */
      offer: "osrs-card-offer osrs-frame-ge-offer",
      /** Metal-cornered card (Combat Achievements tiers and bosses) */
      metal: "osrs-card-metal osrs-frame-equipment-metal",
      /** Notched edge with the base button's fill: the stone behind, lifted slightly */
      muted: "osrs-card-flat osrs-frame-flat osrs-card-muted",
      /** Thin tan border */
      outline: "osrs-card-flat osrs-frame-tan-border",
    },
  },
  defaultVariants: { variant: "flat" },
});

/**
 * `selected` draws the game's orange outline (Greenman mask, store stock); `disabled` greys the
 * label and fades the art (locked or unavailable options).
 */
function Card({
  className,
  variant,
  selected,
  disabled,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants> & { selected?: boolean; disabled?: boolean }) {
  return (
    <div
      data-slot="card"
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("osrs-card-header", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("flex flex-1 flex-col", className)} {...props} />;
}

export { Card, CardHeader, CardContent, cardVariants };
