"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";
import { px } from "@/lib/osrs";
import { optionSprites } from "@/components/ui/option-sprites";

/** The settings-menu slider: a riveted bar with a jewel thumb. */
function Slider({ className, style, ...props }: SliderPrimitive.Root.Props) {
  return (
    <SliderPrimitive.Root data-slot="slider" className={cn("relative", className)} style={{ height: px(16), ...style }} {...props}>
      <SliderPrimitive.Control className="relative flex h-full w-full items-center">
        <SliderPrimitive.Track className="osrs-slider-track relative h-full w-full">
          <SliderPrimitive.Thumb
            className="relative block outline-none"
            style={{ width: px(16), height: px(16) }}
            aria-label="Value"
          >
            <optionSprites.sliderNewDotBlue className="absolute inset-0" />
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
