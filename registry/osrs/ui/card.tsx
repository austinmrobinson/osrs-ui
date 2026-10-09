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
      /** Thin tan border */
      outline: "osrs-card-flat osrs-frame-tan-border",
    },
  },
  defaultVariants: { variant: "flat" },
});

function Card({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return <div data-slot="card" className={cn(cardVariants({ variant }), className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("osrs-card-header", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("flex flex-1 flex-col", className)} {...props} />;
}

export { Card, CardHeader, CardContent, cardVariants };
