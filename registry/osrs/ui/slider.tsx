"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";
import { px } from "@/lib/osrs";
import { useGameSize } from "@/lib/movable";
import { SlicedSprite } from "@/lib/sprite";
import { optionSprites } from "@/components/ui/option-sprites";

const THUMBS = {
  blue: optionSprites.sliderNewDotBlue,
  green: optionSprites.sliderNewDotGreen,
  red: optionSprites.sliderNewDotRed,
  gray: optionSprites.sliderNewDotGray,
} as const;

/**
 * The settings slider: a riveted bar with caret ends, notch dots and a jewel thumb.
 * Any width; the bar tiles. `notches` sets how many dots are drawn (the game uses 5).
 */
function Slider({
  className,
  style,
  thumb = "blue",
  notches = 5,
  ...props
}: SliderPrimitive.Root.Props & { thumb?: keyof typeof THUMBS; notches?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const size = useGameSize(ref);
  const L = Math.max(64, size?.width ?? 180);
  const Thumb = THUMBS[thumb];
  const first = 24; // centre of the first notch, just past the left caret
  const span = L - first * 2;
  return (
    <SliderPrimitive.Root data-slot="slider" className={cn("relative w-full", className)} style={{ height: px(16), ...style }} {...props}>
      <SliderPrimitive.Control ref={ref} className="relative block h-full w-full">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <optionSprites.sliderNewLeftCaret className="absolute top-0 left-0" />
          <SlicedSprite
            sprite={optionSprites.sliderNewEmpty}
            axis="x"
            length={L - 32}
            start={0}
            end={0}
            className="absolute top-0"
            style={{ left: px(16) }}
          />
          <optionSprites.sliderNewRightCaret className="absolute top-0" style={{ left: px(L - 16) }} />
          {Array.from({ length: notches }, (_, i) => (
            <optionSprites.sliderNewJustDot
              key={i}
              className="absolute top-0"
              style={{ left: px(Math.round(first + (span * i) / Math.max(1, notches - 1)) - 8) }}
            />
          ))}
        </div>
        {/* positioned inline: Base UI gives the track its own inline `position: relative`, which beat the
            classes and left it zero-height, so the thumb sat half above the bar */}
        <SliderPrimitive.Track style={{ position: "absolute", top: 0, bottom: 0, left: px(first), right: px(first) }}>
          <SliderPrimitive.Thumb data-slot="slider-thumb" className="block outline-none" style={{ width: px(16), height: px(16) }} aria-label="Value">
            <Thumb className="block" />
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
