"use client";

import * as React from "react";

import { List, ListItem } from "@/registry/osrs/ui/list";
import { NavItem, NavList, NavPanel } from "@/registry/osrs/ui/nav-list";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { DefenceIcon } from "@/registry/osrs/ui/skill-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";
import { Window, WindowClose, WindowHeader } from "@/registry/osrs/ui/window";
import { combatSprites } from "@/registry/osrs/ui/combat-sprites";
import { prayerSprites } from "@/registry/osrs/ui/prayer-sprites";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;
const CATEGORIES = ["Overview", "Armour", "Penance", "Prayers", "Shields", "Other"];

const PRAYERS = [
  { level: 65, Icon: prayerSprites.chivalry, name: "Chivalry", desc: "Increases your defence by 20%, strength by 18%, and attack by 15%.", req: "Level 60 Prayer, King's Ransom" },
  { level: 70, Icon: prayerSprites.piety, name: "Piety", desc: "Increases your defence by 25%, strength by 23%, and attack by 20%.", req: "Level 70 Prayer, King's Ransom" },
  { level: 70, Icon: prayerSprites.rigour, name: "Rigour", desc: "Increases your ranged attack by 20% and damage by 23%, and your defence by 25%.", req: "Level 74 Prayer, Dexterous prayer scroll" },
  { level: 70, Icon: prayerSprites.augury, name: "Augury", desc: "Increases your magic attack and defence by 25%, and your defence by 25%.", req: "Level 77 Prayer, Arcane prayer scroll" },
];

function Overview() {
  return (
    <Tabs variant="panel" defaultValue="overview" className="h-full">
      <TabsList style={{ width: px(220) }}>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="quest">Quest XP</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="min-h-0 flex-1" style={{ padding: 0 }}>
        <ScrollArea className="h-full">
          <div className="flex flex-col" style={{ gap: px(10), padding: px(6) }}>
            <p className="m-0">
              Your Defence level unlocks the ability to equip increasingly powerful armour and determines how likely you
              are to block enemy attacks, negating the damage you would have taken. Use the tabs on the left to see what
              level is required to equip certain equipment.
            </p>
            <p className="m-0">
              To level your Defence skill, attack enemies with a melee, ranged or magic weapon that has a Defensive,
              Controlled or Longrange attack style. Attack styles can be selected in the{" "}
              <combatSprites.styleSwordBlock style={{ width: px(17), height: px(12), verticalAlign: "middle" }} />
              <a className="osrs-link">Combat Options panel</a>. The tooltip for each attack style shows the style name,
              type of damage and the skill XP attacking with that style gives.
            </p>
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="quest" className="flex-1">Quests that award Defence experience.</TabsContent>
    </Tabs>
  );
}

function Prayers() {
  return (
    <ScrollArea className="osrs-outline h-full" style={{ background: "rgb(0 0 0 / 0.08)" }}>
      <List>
        {PRAYERS.map((p) => (
          <ListItem key={p.name} className="items-start" style={{ padding: `${px(6)} ${px(6)}`, gap: px(10) }}>
            <span style={{ width: px(22) }}>{p.level}</span>
            <p.Icon className="shrink-0" />
            <div className="flex flex-col">
              <span>{p.name}</span>
              <span>{p.desc}</span>
              <span>
                Requires: <span style={{ color: "#c9c0ad" }}>{p.req}</span>
              </span>
            </div>
          </ListItem>
        ))}
      </List>
    </ScrollArea>
  );
}

export default function SkillGuideRecipe() {
  const [category, setCategory] = React.useState("Overview");
  return (
    <div className="osrs flex items-start justify-start p-6">
      <Window draggable resizable style={{ width: px(510), height: px(340) }} minWidth={380} minHeight={240}>
        <WindowHeader end={<WindowClose />}>
          <span className="inline-flex items-center" style={{ gap: px(6) }}>
            <DefenceIcon style={{ width: px(17), height: px(17) }} />
            Defence - {category === "Prayers" ? "Prayers (Members Only)" : category}
          </span>
        </WindowHeader>
        <Tabs orientation="vertical" value={category} onValueChange={(v) => setCategory(String(v))} className="min-h-0 flex-1 flex-row" style={{ padding: px(4) }}>
          <NavList variant="attached" style={{ width: px(150) }}>
            {CATEGORIES.map((c) => (
              <NavItem key={c} value={c}>
                {c}
              </NavItem>
            ))}
          </NavList>
          <NavPanel className="flex flex-col">
            {CATEGORIES.map((c) => (
              <TabsContent key={c} value={c} className="min-h-0 flex-1">
                {c === "Overview" ? <Overview /> : c === "Prayers" ? <Prayers /> : <div style={{ padding: px(6) }}>{c} unlocks</div>}
              </TabsContent>
            ))}
          </NavPanel>
        </Tabs>
      </Window>
    </div>
  );
}
