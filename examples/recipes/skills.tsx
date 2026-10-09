import { SidePanel, SidePanelContent } from "@/registry/osrs/ui/side-panel";
import { SkillTile, TotalLevelTile } from "@/registry/osrs/ui/skill-tile";
import { BOTTOM_TABS, TOP_TABS } from "../data/game";

const LEVELS = [
  ["attack", 99], ["hitpoints", 99], ["mining", 85],
  ["strength", 99], ["agility", 81], ["smithing", 72],
  ["defence", 95], ["herblore", 88], ["fishing", 90],
  ["ranged", 99], ["thieving", 75], ["cooking", 99],
  ["prayer", 77], ["crafting", 84], ["firemaking", 92],
  ["magic", 99], ["fletching", 91], ["woodcutting", 87],
  ["runecraft", 77], ["slayer", 95], ["farming", 93],
  ["construction", 83], ["hunter", 85], ["sailing", 40],
] as const;

export default function SkillsRecipe() {
  const total = LEVELS.reduce((s, [, l]) => s + l, 0);
  return (
    <div className="osrs flex justify-center p-6">
      <SidePanel top={TOP_TABS} bottom={BOTTOM_TABS} defaultValue="stats">
        <SidePanelContent value="stats">
          <div className="grid grid-cols-3" style={{ gap: "0 calc(1 * var(--osrs-px))" }}>
            {LEVELS.map(([skill, level]) => (
              <SkillTile key={skill} skill={skill} level={level} boosted={skill === "strength" ? 118 : undefined} />
            ))}
            <div />
            <div />
            <TotalLevelTile total={total} />
          </div>
        </SidePanelContent>
      </SidePanel>
    </div>
  );
}
