"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";

import { cn } from "@/lib/utils";
import { optionSprites } from "@/components/ui/option-sprites";

/**
 * Settings checkbox, drawn with the game's sprites.
 * `square` (default): the classic 16px box. `bordered`: the 18px tan-bordered box of the modern settings window.
 */
function Checkbox({ className, variant = "square", ...props }: CheckboxPrimitive.Root.Props & { variant?: "square" | "bordered" }) {
  if (variant === "bordered")
    return (
      <CheckboxPrimitive.Root data-slot="checkbox" className={cn("group relative shrink-0 cursor-pointer border-0 bg-transparent p-0 outline-none", className)} {...props}>
        <optionSprites.squareBorderedCheckbox className="group-data-[checked]:hidden group-data-[disabled]:hidden" />
        <optionSprites.squareBorderedCheckboxChecked className="hidden group-data-[checked]:block group-data-[disabled]:hidden" />
        <optionSprites.squareBorderedCheckboxDisabled className="hidden group-data-[disabled]:block group-data-[checked]:hidden" />
        <optionSprites.squareBorderedCheckboxDisabledChecked className="hidden group-data-[disabled]:group-data-[checked]:block" />
      </CheckboxPrimitive.Root>
    );
  return <CheckboxPrimitive.Root data-slot="checkbox" className={cn("osrs-checkbox osrs-sprite", className)} {...props} />;
}

export { Checkbox };
