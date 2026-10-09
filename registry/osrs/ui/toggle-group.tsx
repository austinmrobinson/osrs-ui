"use client";

import * as React from "react";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/**
 * A row of tile buttons where the chosen one stays pressed (red): the bank's and stores'
 * quantity rows (1 / 5 / 10 / X / All). Single choice by default; `multiple` for independent toggles.
 */
function ToggleGroup({ className, ...props }: ToggleGroupPrimitive.Props) {
  return <ToggleGroupPrimitive data-slot="toggle-group" className={cn("osrs-toggle-group", className)} {...props} />;
}

function ToggleGroupItem({
  className,
  size = "icon",
  ...props
}: TogglePrimitive.Props & { size?: "sm" | "default" | "lg" | "icon-sm" | "icon" | "icon-lg" }) {
  return <TogglePrimitive data-slot="toggle-group-item" className={cn(buttonVariants({ variant: "tile", size }), className)} {...props} />;
}

export { ToggleGroup, ToggleGroupItem };
