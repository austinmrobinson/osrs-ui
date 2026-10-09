"use client";

import { PrayerButton, type PrayerName } from "@/registry/osrs/ui/prayer-button";
import { SidePanel, SidePanelContent } from "@/registry/osrs/ui/side-panel";
import { BOTTOM_TABS, TOP_TABS } from "../data/game";

const PRAYERS: PrayerName[] = [
  "thickSkin", "burstOfStrength", "clarityOfThought", "sharpEye", "mysticWill",
  "rockSkin", "superhumanStrength", "improvedReflexes", "rapidRestore", "rapidHeal",
  "protectItem", "hawkEye", "mysticLore", "steelSkin", "ultimateStrength",
  "incredibleReflexes", "protectFromMagic", "protectFromMissiles", "protectFromMelee", "eagleEye",
  "mysticMight", "retribution", "redemption", "smite", "preserve",
  "chivalry", "deadeye", "mysticVigour", "piety", "rigour", "augury",
];
const ACTIVE = new Set<PrayerName>(["protectFromMelee", "piety"]);
const LOCKED = new Set<PrayerName>(["deadeye", "mysticVigour"]);

export default function PrayerRecipe() {
  return (
    <div className="osrs flex justify-center p-6">
      <SidePanel top={TOP_TABS} bottom={BOTTOM_TABS} defaultValue="prayer">
        <SidePanelContent value="prayer">
          <div className="grid grid-cols-5">
            {PRAYERS.map((p) => (
              <PrayerButton key={p} prayer={p} defaultPressed={ACTIVE.has(p)} locked={LOCKED.has(p)} />
            ))}
          </div>
        </SidePanelContent>
      </SidePanel>
    </div>
  );
}
