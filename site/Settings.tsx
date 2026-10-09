"use client";

// Header Settings: the game's Settings tab icon opens a small window with the site's two preferences,
// Sound (the interface sounds; off mutes every one) and Motion (off holds every looping animation,
// as the operating system's reduce-motion setting does). Saved in the browser (site/preferences.ts).
import * as React from "react";

import { Checkbox } from "@/registry/osrs/ui/checkbox";
import { Field, FieldLabel } from "@/registry/osrs/ui/field";
import { tabSprites } from "@/registry/osrs/ui/tab-sprites";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/osrs/ui/popover";
import { SpriteButton } from "@/registry/osrs/ui/sprite-button";
import { DEFAULT_PREFS, readPrefs, savePrefs, type Prefs } from "./preferences";
import { installInterfaceSounds, play } from "./sound";

export default function Settings() {
  const [prefs, setPrefs] = React.useState<Prefs>(DEFAULT_PREFS);
  React.useEffect(() => {
    setPrefs(readPrefs());
    installInterfaceSounds();
  }, []);
  const set = (patch: Partial<Prefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    savePrefs(next);
  };

  return (
    <Popover onOpenChange={(open) => play(open ? "open" : "close")}>
      <PopoverTrigger
        data-silent=""
        render={
          // the game's Settings tab icon (the site's sound and motion live in it); it has no lit
          // sprite, so it brightens on hover and while open
          <SpriteButton
            sprite={tabSprites.options}
            aria-label="Settings"
            className="size-8 items-center justify-center [--osrs-px:1px] *:transition-[filter] *:duration-100 hover:*:brightness-125 data-popup-open:*:brightness-125"
          />
        }
      />
      <PopoverContent title="Settings" scale={1}>
        <Field density="spacious">
          <FieldLabel>Sound</FieldLabel>
          <Checkbox checked={prefs.sound} onCheckedChange={(c) => set({ sound: Boolean(c) })} />
        </Field>
        <Field density="spacious">
          <FieldLabel>Motion</FieldLabel>
          <Checkbox checked={prefs.motion} onCheckedChange={(c) => set({ motion: Boolean(c) })} />
        </Field>
      </PopoverContent>
    </Popover>
  );
}
