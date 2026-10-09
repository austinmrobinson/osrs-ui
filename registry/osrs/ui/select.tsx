"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";

import { cn } from "@/lib/utils";
import { useAnchorScale } from "@/lib/osrs";

const Select = SelectPrimitive.Root;

function SelectTrigger({ className, children, ...props }: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger data-slot="select-trigger" className={cn("osrs-select-trigger osrs-well osrs-text", className)} {...props}>
      {children ?? <SelectPrimitive.Value />}
      <span className="osrs-sprite osrs-control-scroll-down" />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  scale,
  ...props
}: SelectPrimitive.Popup.Props & {
  /** Draw the popup at this scale (CSS px per game pixel) instead of its trigger's. */ scale?: number;
}) {
  const scaleRef = useAnchorScale<HTMLDivElement>(scale);
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner className="z-50" alignItemWithTrigger={false} sideOffset={2}>
        <SelectPrimitive.Popup ref={scaleRef} data-slot="select-content" className={cn("osrs-select-popup osrs-text min-w-(--anchor-width)", className)} {...props} />
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item data-slot="select-item" className={cn("osrs-select-item", className)} {...props}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectValue(props: SelectPrimitive.Value.Props) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
