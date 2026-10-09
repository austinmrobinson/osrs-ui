"use client";

import * as React from "react";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/**
 * A single on/off tile with shadcn/ui's Toggle API: the game's square tile, red while pressed (bank
 * "Item" / "Note", "Placeholders", "Search"). For a row where one choice stays pressed, use `ToggleGroup`.
 */
function Toggle({
  className,
  size = "icon",
  ...props
}: TogglePrimitive.Props & { size?: "sm" | "default" | "lg" | "icon-sm" | "icon" | "icon-lg" }) {
  return <TogglePrimitive data-slot="toggle" className={cn(buttonVariants({ variant: "tile", size }), className)} {...props} />;
}

export { Toggle };
