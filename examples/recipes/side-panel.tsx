"use client";

// The resizable-mode side panel with its tabs working: Skills, Character Summary, Inventory,
// Worn Equipment, Prayer and Account Management each show their view; the other tabs are empty.
import { Button } from "@/registry/osrs/ui/button";
import { Card } from "@/registry/osrs/ui/card";
import { EquipmentGrid } from "@/registry/osrs/ui/equipment-slot";
import { glyphSprites } from "@/registry/osrs/ui/glyph-sprites";
import { Inventory } from "@/registry/osrs/ui/item-slot";
import { PrayerButton, type PrayerName } from "@/registry/osrs/ui/prayer-button";
import { SidePanel, SidePanelContent } from "@/registry/osrs/ui/side-panel";
import { SkillTile, TotalLevelTile } from "@/registry/osrs/ui/skill-tile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/osrs/ui/tooltip";
import { BOTTOM_TABS, Item, TOP_TABS } from "@/site/demo-data/game";
import { items } from "@/site/demo-data/items";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;
type Glyph = (typeof glyphSprites)[keyof typeof glyphSprites];

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

const PRAYERS: PrayerName[] = [
  "thickSkin", "burstOfStrength", "clarityOfThought", "sharpEye", "mysticWill",
  "rockSkin", "superhumanStrength", "improvedReflexes", "rapidRestore", "rapidHeal",
  "protectItem", "hawkEye", "mysticLore", "steelSkin", "ultimateStrength",
  "incredibleReflexes", "protectFromMagic", "protectFromMissiles", "protectFromMelee", "eagleEye",
  "mysticMight", "retribution", "redemption", "smite", "preserve",
  "chivalry", "deadeye", "mysticVigour", "piety", "rigour", "augury",
];
const ACTIVE_PRAYERS = new Set<PrayerName>(["protectFromMelee", "piety"]);
const LOCKED_PRAYERS = new Set<PrayerName>(["deadeye", "mysticVigour"]);

const Worn = (id: keyof typeof items) => {
  const { Icon, name } = items[id];
  return <Icon title={name} />;
};

function SummaryStat({ label, value, Icon }: { label: string; value: string; Icon: Glyph }) {
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

function AccountButton({ label, Icon }: { label: string; Icon: Glyph }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="tile" tone="white" className="w-full justify-between" style={{ minHeight: px(26) }} />}>
        <Icon />
        {label}
        <Icon />
      </TooltipTrigger>
      <TooltipContent variant="interface" side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

const VIEWS = new Set(["stats", "quests", "inventory", "equipment", "prayer", "account"]);

export default function SidePanelRecipe() {
  const total = LEVELS.reduce((s, [, l]) => s + l, 0);
  return (
    <div className="osrs flex justify-center p-6">
      <SidePanel top={TOP_TABS} bottom={BOTTOM_TABS} defaultValue="inventory">
        <SidePanelContent value="stats">
          <div className="grid grid-cols-3" style={{ gap: `0 ${px(1)}` }}>
            {LEVELS.map(([skill, level]) => (
              <SkillTile key={skill} skill={skill} level={level} boosted={skill === "strength" ? 118 : undefined} />
            ))}
            <div />
            <div />
            <TotalLevelTile total={total} />
          </div>
        </SidePanelContent>

        <SidePanelContent value="quests" className="flex flex-col" style={{ gap: px(4), width: px(180) }}>
          <div className="osrs-text osrs-text-bold text-center">Zezima</div>
          <div className="grid grid-cols-2" style={{ gap: px(4) }}>
            <SummaryStat label="Combat Level:" value="126" Icon={glyphSprites.combatAchievementsCombatLevel} />
            <SummaryStat label="Total Level:" value="2277" Icon={glyphSprites.combatAchievementsTotalLevel} />
          </div>
          <Card className="flex-row items-center justify-center osrs-text-small" style={{ gap: px(3) }}>
            <glyphSprites.combatAchievementsXp />
            <span>Total XP: <span style={{ color: "var(--osrs-green)" }}>4,600,000,000</span></span>
          </Card>
          <div className="grid grid-cols-2" style={{ gap: px(4) }}>
            <SummaryStat label="Quests Completed:" value="165/165" Icon={glyphSprites.blueQuestsIcon} />
            <SummaryStat label="Achievements:" value="492/492" Icon={glyphSprites.greenAchievementDiariesIcon} />
            <SummaryStat label="Combat Tasks:" value="556/556" Icon={glyphSprites.combatAchievementsTasksCompleted} />
            <SummaryStat label="Collections:" value="1524/1524" Icon={glyphSprites.combatAchievementsCollectionsLogged} />
          </div>
        </SidePanelContent>

        <SidePanelContent value="inventory">
          <Inventory>
            <Item id="abyssal-whip" />
            <Item id="dragon-defender" />
            <Item id="super-combat-potion-4" />
            <Item id="prayer-potion-4" />
            <Item id="saradomin-brew-4" />
            <Item id="super-restore-4" />
            <Item id="prayer-potion-4" />
            <Item id="stamina-potion-4" />
            <Item id="shark" />
            <Item id="shark" />
            <Item id="shark" />
            <Item id="shark" />
            <Item id="anglerfish" />
            <Item id="anglerfish" />
            <Item id="cooked-karambwan" />
            <Item id="cooked-karambwan" />
            <Item id="coins-10000" quantity={1_284_317} />
            <Item id="nature-rune" quantity={3_412} />
            <Item id="law-rune" quantity={412} />
            <Item id="blood-rune" quantity={18_420_000} />
            <Item id="ring-of-dueling-8" />
            <Item id="games-necklace-8" />
            <Item id="rune-pickaxe" />
            <Item id="clue-scroll-elite" />
            {null}
            {null}
            <Item id="spade" />
            <Item id="tinderbox" />
          </Inventory>
        </SidePanelContent>

        <SidePanelContent value="equipment" className="flex flex-col items-center" style={{ gap: px(8) }}>
          <EquipmentGrid
            items={{
              cape: Worn("fire-cape"),
              neck: Worn("amulet-of-glory-6"),
              weapon: Worn("abyssal-whip"),
              body: Worn("fighter-torso"),
              shield: Worn("dragon-defender"),
              legs: Worn("dragon-platelegs"),
              hands: Worn("barrows-gloves"),
              feet: Worn("dragon-boots"),
              ring: Worn("berserker-ring-i"),
            }}
          />
          <div className="grid grid-cols-2" style={{ gap: px(4) }}>
            <Button size="sm">Stats</Button>
            <Button size="sm">Prices</Button>
            <Button size="sm">Death</Button>
            <Button size="sm">Follower</Button>
          </div>
        </SidePanelContent>

        <SidePanelContent value="prayer">
          <div className="grid grid-cols-5">
            {PRAYERS.map((p) => (
              <PrayerButton key={p} prayer={p} defaultPressed={ACTIVE_PRAYERS.has(p)} locked={LOCKED_PRAYERS.has(p)} />
            ))}
          </div>
        </SidePanelContent>

        <SidePanelContent value="account" style={{ width: px(178) }}>
          <Tabs variant="panel" defaultValue="account">
            <TabsList>
              <TabsTrigger value="account" aria-label="Account"><glyphSprites.accountTabIcon /></TabsTrigger>
              <TabsTrigger value="community" aria-label="Community"><glyphSprites.communityTabIcon /></TabsTrigger>
              <TabsTrigger value="links" aria-label="Useful links"><glyphSprites.linksTabIcon /></TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="osrs-text flex flex-col items-center text-center" style={{ gap: px(4) }}>
              <span className="osrs-text-bold">Account</span>
              <span>Membership: 29 days left</span>
              <AccountButton label="Open Store" Icon={glyphSprites.storeIcon} />
              <AccountButton label="Bond Pouch" Icon={glyphSprites.bondIcon} />
              <span>Inbox: 4 unread messages</span>
              <AccountButton label="View Inbox" Icon={glyphSprites.inboxIcon} />
              <span>Name: Zezima</span>
              <AccountButton label="Name Changer" Icon={glyphSprites.nameChangerIcon} />
            </TabsContent>
            <TabsContent value="community" className="osrs-text osrs-text-bold text-center">Community</TabsContent>
            <TabsContent value="links" className="osrs-text osrs-text-bold text-center">Useful Links</TabsContent>
          </Tabs>
        </SidePanelContent>

        {/* the tabs without a view: just their name */}
        {[...TOP_TABS, ...BOTTOM_TABS]
          .filter((t) => !VIEWS.has(t.value))
          .map((t) => (
            <SidePanelContent key={t.value} value={t.value} className="osrs-text osrs-text-bold text-center">
              {t.label}
            </SidePanelContent>
          ))}
      </SidePanel>
    </div>
  );
}
