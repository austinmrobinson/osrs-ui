"use client";

import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { Card, CardContent, CardHeader } from "@/registry/osrs/ui/card";
import { List, ListItem } from "@/registry/osrs/ui/list";
import { Progress } from "@/registry/osrs/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/osrs/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";
import { Window, WindowBody, WindowClose, WindowHeader } from "@/registry/osrs/ui/window";
import { glyphSprites } from "@/registry/osrs/ui/glyph-sprites";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;

const TIERS = [
  { name: "Easy", done: 33, total: 33, Large: glyphSprites.bronzeSwordLarge, Small: glyphSprites.bronzeSwordSmall },
  { name: "Medium", done: 41, total: 41, Large: glyphSprites.steelSwordLarge, Small: glyphSprites.steelSwordSmall },
  { name: "Hard", done: 58, total: 61, Large: glyphSprites.blackSwordLarge, Small: glyphSprites.blackSwordSmall },
  { name: "Elite", done: 87, total: 129, Large: glyphSprites.runeSwordLarge, Small: glyphSprites.runeSwordSmall },
  { name: "Master", done: 34, total: 132, Large: glyphSprites.dragonSwordLarge, Small: glyphSprites.dragonSwordSmall },
  { name: "Grandmaster", done: 3, total: 100, Large: glyphSprites.armadylGodswordLarge, Small: glyphSprites.armadylGodswordSmall },
] as const;

type Task = { name: string; desc: string; monster: string; type: string; tier: number; done: boolean };
const TASKS: Task[] = [
  { name: "Noxious Foe", desc: "Kill an Aberrant Spectre.", monster: "Aberrant Spectre", type: "Kill Count", tier: 0, done: true },
  { name: "Barrows Novice", desc: "Open the Barrows chest 10 times.", monster: "Barrows", type: "Kill Count", tier: 1, done: true },
  { name: "Just Like That", desc: "Kill Karil using only damage dealt by special attacks.", monster: "Barrows", type: "Restriction", tier: 2, done: true },
  { name: "Faithless Crypt Run", desc: "Kill all six Barrows brothers without using prayer.", monster: "Barrows", type: "Restriction", tier: 2, done: false },
  { name: "Hard Hitter", desc: "Kill Vorkath with 15 or fewer attacks.", monster: "Vorkath", type: "Mechanical", tier: 3, done: true },
  { name: "Zombie Destroyer", desc: "Kill Vorkath's zombified spawn without using crumble undead.", monster: "Vorkath", type: "Mechanical", tier: 3, done: false },
  { name: "Inferno Speed-Runner", desc: "Complete the Inferno in under 65 minutes.", monster: "TzKal-Zuk", type: "Speed", tier: 4, done: false },
  { name: "Perfect Olm (Solo)", desc: "Kill the Great Olm in a solo raid without taking damage.", monster: "Great Olm", type: "Perfection", tier: 4, done: true },
  { name: "Theatre of Blood: HM Grandmaster", desc: "Complete Theatre of Blood: Hard Mode in under 19 minutes.", monster: "Theatre of Blood", type: "Speed", tier: 5, done: false },
  { name: "Inferno Grandmaster", desc: "Complete the Inferno in under 50 minutes.", monster: "TzKal-Zuk", type: "Speed", tier: 5, done: false },
];

function Filter({ label, items }: { label: string; items: string[] }) {
  return (
    <label className="flex items-center" style={{ gap: px(3) }}>
      <span className="osrs-text-small">{label}</span>
      <Select defaultValue={items[0]} items={Object.fromEntries(items.map((i) => [i, i]))}>
        <SelectTrigger style={{ width: px(84) }} />
        <SelectContent>
          {items.map((i) => (
            <SelectItem key={i} value={i}>
              {i}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

export default function CombatAchievementsRecipe() {
  const [tier, setTier] = React.useState("All");
  const [status, setStatus] = React.useState("All");
  const points = TIERS.reduce((s, t, i) => s + t.done * (i + 1), 0);
  const tasks = TASKS.filter(
    (t) =>
      (tier === "All" || TIERS[t.tier].name === tier) &&
      (status === "All" || (status === "Complete") === t.done),
  );
  return (
    <div className="osrs flex items-start justify-start p-6">
      <Window draggable resizable style={{ width: px(488), height: px(320) }} minWidth={400} minHeight={260}>
        <WindowHeader start={<Button variant="metal" size="sm">Rewards</Button>} end={<WindowClose />}>
          Combat Achievements - {points} points
        </WindowHeader>
        <Tabs defaultValue="tasks" className="min-h-0 flex-1">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="bosses">Bosses</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="min-h-0 flex-1" style={{ paddingTop: px(4) }}>
            <WindowBody scroll>
              <div className="grid grid-cols-3" style={{ gap: px(4) }}>
                {TIERS.map((t) => (
                  <Card key={t.name} variant="offer">
                    <CardHeader>{t.name}</CardHeader>
                    <CardContent className="items-center" style={{ gap: px(3), padding: `0 ${px(4)} ${px(4)}` }}>
                      <t.Large />
                      <Progress value={(t.done / t.total) * 100} color={t.done === t.total ? "green" : "orange"} className="w-full" />
                      <span className="osrs-text-small" style={{ color: t.done === t.total ? "var(--osrs-green)" : "var(--osrs-white)" }}>
                        {t.done}/{t.total}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </WindowBody>
          </TabsContent>
          <TabsContent value="tasks" className="flex min-h-0 flex-1 flex-col" style={{ gap: px(4), paddingTop: px(4) }}>
            <div className="flex flex-wrap items-center" style={{ gap: px(6) }}>
              <label className="flex items-center" style={{ gap: px(3) }}>
                <span className="osrs-text-small">Tier:</span>
                <Select value={tier} onValueChange={(v) => setTier(String(v))} items={Object.fromEntries(["All", ...TIERS.map((t) => t.name)].map((i) => [i, i]))}>
                  <SelectTrigger style={{ width: px(84) }} />
                  <SelectContent>
                    {["All", ...TIERS.map((t) => t.name)].map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <Filter label="Type:" items={["All", "Kill Count", "Mechanical", "Perfection", "Restriction", "Speed"]} />
              <label className="flex items-center" style={{ gap: px(3) }}>
                <span className="osrs-text-small">Status:</span>
                <Select value={status} onValueChange={(v) => setStatus(String(v))} items={{ All: "All", Complete: "Complete", Incomplete: "Incomplete" }}>
                  <SelectTrigger style={{ width: px(84) }} />
                  <SelectContent>
                    {["All", "Complete", "Incomplete"].map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
            <WindowBody scroll>
              <List>
                {tasks.map((t) => {
                  const { Small } = TIERS[t.tier];
                  return (
                    <ListItem key={t.name} className="items-start" style={{ padding: `${px(3)} ${px(4)}`, gap: px(6) }}>
                      <Small className="shrink-0" />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span style={{ color: t.done ? "var(--osrs-green)" : "var(--osrs-red)" }}>{t.name}</span>
                        <span className="osrs-text-small" style={{ color: "var(--osrs-white)" }}>{t.desc}</span>
                      </div>
                      <div className="flex shrink-0 flex-col items-end osrs-text-small">
                        <span>{t.monster}</span>
                        <span style={{ color: "var(--osrs-yellow)" }}>{t.type}</span>
                      </div>
                    </ListItem>
                  );
                })}
              </List>
            </WindowBody>
          </TabsContent>
          <TabsContent value="bosses" className="flex flex-1 items-center justify-center">Boss log</TabsContent>
        </Tabs>
      </Window>
    </div>
  );
}
