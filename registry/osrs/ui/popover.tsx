"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import { cn } from "@/lib/utils";
import { useAnchorScale } from "@/lib/osrs";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";

/**
 * A small window that drops from a button: the Interface frame with, given a `title`, a
 * settings-style title band edge to edge over striped rows (put `Field`s in it). Closes on Escape
 * or a click outside; focus moves into it on open and back to the trigger on close.
 *
 * Like the other popups it takes its trigger's scale; `scale` draws it at a fixed one.
 */
function Popover(props: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger(props: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  title,
  children,
  side = "bottom",
  align = "end",
  sideOffset = 8,
  scale,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<PopoverPrimitive.Positioner.Props, "side" | "align" | "sideOffset"> & {
    /** The title band; also the window's accessible name. */
    title?: React.ReactNode;
    /** Draw the popup at this scale (CSS px per game pixel) instead of its trigger's. */
    scale?: number;
  }) {
  const scaleRef = useAnchorScale<HTMLDivElement>(scale);
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner side={side} align={align} sideOffset={sideOffset} className="z-50">
        <PopoverPrimitive.Popup ref={scaleRef} data-slot="popover-content" className={cn("osrs-popover osrs-interface osrs-framed osrs-frame-iron-rivets osrs-text", className)} {...props}>
          {title ? (
            <FieldSet variant="section">
              <PopoverPrimitive.Title render={<FieldLegend className="w-full" />}>{title}</PopoverPrimitive.Title>
              <Separator />
              <div>{children}</div>
            </FieldSet>
          ) : (
            children
          )}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

const PopoverClose = PopoverPrimitive.Close;

export { Popover, PopoverTrigger, PopoverContent, PopoverClose };
