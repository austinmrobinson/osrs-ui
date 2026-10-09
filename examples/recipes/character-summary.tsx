import { Card } from "@/registry/osrs/ui/card";
import { glyphSprites } from "@/registry/osrs/ui/glyph-sprites";
import { SidePanel, SidePanelContent } from "@/registry/osrs/ui/side-panel";
import { BOTTOM_TABS, TOP_TABS } from "../data/game";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;

function Stat({ label, value, Icon }: { label: string; value: string; Icon: (typeof glyphSprites)[keyof typeof glyphSprites] }) {
  return (
    <Card className="items-center text-center" style={{ gap: px(2) }}>
      <span className="osrs-text-small" style={{ lineHeight: px(11) }}>{label}</span>
      <span className="flex items-center" style={{ gap: px(3), color: "var(--osrs-green)" }}>
        <Icon />
        {value}
      </span>
    </Card>
  );
}

export default function CharacterSummaryRecipe() {
  return (
    <div className="osrs flex justify-center p-6">
      <SidePanel top={TOP_TABS} bottom={BOTTOM_TABS} defaultValue="quests">
        <SidePanelContent value="quests" className="flex flex-col" style={{ gap: px(4), width: px(180) }}>
          <div className="osrs-text osrs-text-bold text-center">Zezima</div>
          <div className="grid grid-cols-2" style={{ gap: px(4) }}>
            <Stat label="Combat Level:" value="126" Icon={glyphSprites.combatAchievementsCombatLevel} />
            <Stat label="Total Level:" value="2277" Icon={glyphSprites.combatAchievementsTotalLevel} />
          </div>
          <Card className="flex-row items-center justify-center osrs-text-small" style={{ gap: px(3) }}>
            <glyphSprites.combatAchievementsXp />
            <span>Total XP: <span style={{ color: "var(--osrs-green)" }}>4,600,000,000</span></span>
          </Card>
          <div className="grid grid-cols-2" style={{ gap: px(4) }}>
            <Stat label="Quests Completed:" value="165/165" Icon={glyphSprites.blueQuestsIcon} />
            <Stat label="Achievements:" value="492/492" Icon={glyphSprites.greenAchievementDiariesIcon} />
            <Stat label="Combat Tasks:" value="556/556" Icon={glyphSprites.combatAchievementsTasksCompleted} />
            <Stat label="Collections:" value="1524/1524" Icon={glyphSprites.combatAchievementsCollectionsLogged} />
          </div>
        </SidePanelContent>
      </SidePanel>
    </div>
  );
}
