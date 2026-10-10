"use client";

// Header Settings: two sliders open a small window with the site's two preferences,
// Sound (the interface sounds; off mutes every one) and Motion (off holds every looping animation,
// as the operating system's reduce-motion setting does). Saved in the browser (site/preferences.ts).
import * as React from "react";

import { Checkbox } from "@/registry/osrs/ui/checkbox";
import { Field, FieldLabel } from "@/registry/osrs/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/osrs/ui/popover";
import { SettingsIcon } from "./header-icons";
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
      {/* the sliders in the header's plain pixel-icon style, white while its window is open */}
      <PopoverTrigger
        data-silent=""
        aria-label="Settings"
        className="osrs-hit-area group inline-grid size-7 cursor-pointer place-items-center border-0 bg-transparent p-0 text-rs-orange hover:text-rs-white data-popup-open:text-rs-white"
      >
        <SettingsIcon className="group-active:translate-px" />
      </PopoverTrigger>
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
