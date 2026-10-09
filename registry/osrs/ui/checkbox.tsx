"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";

import { cn } from "@/lib/utils";

/** The square settings checkbox. State is drawn entirely by the game sprites. */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return <CheckboxPrimitive.Root data-slot="checkbox" className={cn("osrs-checkbox osrs-sprite", className)} {...props} />;
}

export { Checkbox };
