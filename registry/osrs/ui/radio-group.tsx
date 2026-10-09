"use client";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";

import { cn } from "@/lib/utils";
import { optionSprites } from "@/components/ui/option-sprites";

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return <RadioGroupPrimitive data-slot="radio-group" className={cn("flex flex-col gap-[calc(4*var(--osrs-px))]", className)} {...props} />;
}

/** Round settings radio button. */
function RadioGroupItem({ className, ...props }: Radio.Root.Props) {
  return (
    <Radio.Root data-slot="radio-group-item" className={cn("group relative shrink-0 border-0 bg-transparent p-0 outline-none", className)} {...props}>
      <optionSprites.roundCheckBox className="group-data-[checked]:hidden" />
      <optionSprites.roundCheckBoxChecked className="hidden group-data-[checked]:block" />
    </Radio.Root>
  );
}

export { RadioGroup, RadioGroupItem };
