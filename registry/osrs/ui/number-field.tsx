"use client";

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";

import { cn } from "@/lib/utils";
import { geSprites } from "@/components/ui/ge-sprites";

/** Grand Exchange-style number field with − / + buttons. */
function NumberField({ className, ...props }: NumberFieldPrimitive.Root.Props) {
  return (
    <NumberFieldPrimitive.Root data-slot="number-field" className={cn("osrs-number-field", className)} {...props}>
      <NumberFieldPrimitive.Group className="contents">
        <NumberFieldPrimitive.Decrement className="osrs-number-step" aria-label="Decrease">
          <geSprites.decrementButton />
        </NumberFieldPrimitive.Decrement>
        <NumberFieldPrimitive.Input className="osrs-number-input osrs-well osrs-text w-[calc(70*var(--osrs-px))]" />
        <NumberFieldPrimitive.Increment className="osrs-number-step" aria-label="Increase">
          <geSprites.incrementButton />
        </NumberFieldPrimitive.Increment>
      </NumberFieldPrimitive.Group>
    </NumberFieldPrimitive.Root>
  );
}

export { NumberField };
