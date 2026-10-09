"use client";

import * as React from "react";

import { buttonSprites } from "@/registry/osrs/ui/button-sprites";
import { Checkbox } from "@/registry/osrs/ui/checkbox";
import { Field, FieldLabel } from "@/registry/osrs/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/osrs/ui/popover";
import { Slider } from "@/registry/osrs/ui/slider";
import { SpriteButton } from "@/registry/osrs/ui/sprite-button";

export default function PopoverDemo() {
  const [brightness, setBrightness] = React.useState(3);
  const [roofs, setRoofs] = React.useState(true);
  return (
    <div className="osrs osrs-texture-stone osrs-text flex min-h-[calc(160*var(--osrs-px))] justify-end p-6">
      <Popover>
        <PopoverTrigger render={<SpriteButton sprite={buttonSprites.wrench} activeSprite={buttonSprites.wrenchHovered} aria-label="Display settings" />} />
        <PopoverContent title="Display">
          <Field density="spacious">
            <FieldLabel>Brightness</FieldLabel>
            <Slider min={1} max={4} value={brightness} onValueChange={(v) => setBrightness(Array.isArray(v) ? v[0] : (v as number))} style={{ width: "calc(100 * var(--osrs-px))" }} />
          </Field>
          <Field density="spacious">
            <FieldLabel>Hide roofs</FieldLabel>
            <Checkbox checked={roofs} onCheckedChange={(c) => setRoofs(Boolean(c))} />
          </Field>
        </PopoverContent>
      </Popover>
    </div>
  );
}
