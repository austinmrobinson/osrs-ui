"use client";

import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { Card } from "@/registry/osrs/ui/card";
import { Input } from "@/registry/osrs/ui/input";
import { List, ListItem } from "@/registry/osrs/ui/list";
import { Progress } from "@/registry/osrs/ui/progress";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/osrs/ui/select";
import { SkillIcon } from "@/registry/osrs/ui/skill-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";
import { Window, WindowBody, WindowClose, WindowHeader, WindowMenu, WindowSeparator } from "@/registry/osrs/ui/window";
import { glyphSprites } from "@/registry/osrs/ui/glyph-sprites";
import { iconSprites } from "@/registry/osrs/ui/icon-sprites";
import { orbSprites } from "@/registry/osrs/ui/orb-sprites";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;
const GREEN = "var(--osrs-green)";
const WHITE = "var(--osrs-white)";
const YELLOW = "var(--osrs-yellow)";

const TIERS = [
  { name: "Easy", done: 41, total: 41, Large: glyphSprites.bronzeSwordLarge, Small: glyphSprites.bronzeSwordSmall },
  { name: "Medium", done: 64, total: 64, Large: glyphSprites.steelSwordLarge, Small: glyphSprites.steelSwordSmall },
  { name: "Hard", done: 88, total: 89, Large: glyphSprites.blackSwordLarge, Small: glyphSprites.blackSwordSmall },
  { name: "Elite", done: 152, total: 166, Large: glyphSprites.runeSwordLarge, Small: glyphSprites.runeSwordSmall },
  { name: "Master", done: 115, total: 173, Large: glyphSprites.dragonSwordLarge, Small: glyphSprites.dragonSwordSmall },
  { name: "Grandmaster", done: 38, total: 122, Large: glyphSprites.armadylGodswordLarge, Small: glyphSprites.armadylGodswordSmall },
] as const;

const PROFILE: [string, string][] = [
  ["Tasks Completed:", "498"],
  ["Boss Kill Count:", "19,977"],
  ["Skilling Boss Kill Count:", "608"],
  ["Raid Completions:", "636"],
  ["Top Boss:", "Alchemical Hydra (1,195)"],
  ["Top Skilling Boss:", "Zalcano (290)"],
  ["Top Raid:", "Tombs of Amascut: Expert Mode (417)"],
];

type Task = { name: string; monster: string; type: string; tier: number; done: boolean };
const TASKS: Task[] = [
  { name: "Collateral Damage", monster: "Kree'arra", type: "Mechanical", tier: 4, done: false },
  { name: "Swoop No More", monster: "Kree'arra", type: "Mechanical", tier: 4, done: false },
  { name: "Precise Positioning", monster: "Skotizo", type: "Restriction", tier: 4, done: false },
  { name: "Cerberus Master", monster: "Cerberus", type: "Speed", tier: 4, done: true },
  { name: "Arooo No More", monster: "Cerberus", type: "Mechanical", tier: 4, done: true },
  { name: "Corporeal Beast Master", monster: "Corporeal Beast", type: "Speed", tier: 4, done: false },
  { name: "Perfect Grotesque Guardians II", monster: "Grotesque Guardians", type: "Perfection", tier: 4, done: false },
  { name: "Grotesque Guardians Speed-Chaser", monster: "Grotesque Guardians", type: "Speed", tier: 4, done: false },
  { name: "... 'til Dawn", monster: "Grotesque Guardians", type: "Mechanical", tier: 4, done: false },
  { name: "Corrupted Gauntlet Master", monster: "Corrupted Hunllef", type: "Speed", tier: 4, done: true },
  { name: "Perfect Corrupted Hunllef", monster: "Corrupted Hunllef", type: "Perfection", tier: 4, done: true },
  { name: "Noxious Foe", monster: "Aberrant Spectre", type: "Kill Count", tier: 0, done: true },
  { name: "Just Like That", monster: "Barrows", type: "Restriction", tier: 2, done: true },
  { name: "Inferno Grandmaster", monster: "TzKal-Zuk", type: "Speed", tier: 5, done: false },
];

const BOSSES: { name: string; level: number; done: number; total: number }[] = [
  { name: "Abyssal Sire", level: 350, done: 0, total: 8 },
  { name: "Alchemical Hydra", level: 426, done: 0, total: 12 },
  { name: "Amoxliatl", level: 263, done: 0, total: 9 },
  { name: "Araxxor", level: 890, done: 0, total: 12 },
  { name: "Barrows", level: 115, done: 6, total: 7 },
  { name: "Brutus", level: 30, done: 0, total: 5 },
  { name: "Bryophyta", level: 128, done: 5, total: 7 },
  { name: "Callisto", level: 470, done: 2, total: 2 },
  { name: "Cerberus", level: 318, done: 6, total: 6 },
  { name: "Chaos Elemental", level: 305, done: 0, total: 4 },
  { name: "Chaos Fanatic", level: 202, done: 1, total: 4 },
  { name: "Crazy Archaeologist", level: 204, done: 1, total: 4 },
];

const ratioColor = (done: number, total: number) => (done === total ? GREEN : done === 0 ? "#9f9f9f" : YELLOW);

/** "Total Points: … - Next unlock in …" style banner bar. */
function Banner({ value, children }: { value: number; children: React.ReactNode }) {
  return (
    <Progress value={value} style={{ height: px(30) }}>
      {children}
    </Progress>
  );
}

function FilterSelect({ label, value, onChange, items }: { label: string; value: string; onChange: (v: string) => void; items: string[] }) {
  return (
    <label className="flex flex-col" style={{ gap: px(3) }}>
      <span>{label}</span>
      <Select value={value} onValueChange={(v) => onChange(String(v))} items={Object.fromEntries(items.map((i) => [i, i]))}>
        <SelectTrigger className="w-full" />
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

function Overview() {
  return (
    <WindowBody className="flex-col" style={{ gap: px(6) }}>
      <Banner value={88}>Total Points: 1844 - Next unlock in 121 points</Banner>
      <div className="flex min-h-0 flex-1" style={{ gap: px(4) }}>
        <div className="flex flex-col" style={{ width: px(184), gap: px(3) }}>
          <div className="osrs-text-bold text-center">Difficulty Tiers</div>
          <div className="grid grid-cols-2" style={{ gap: px(3) }}>
            {TIERS.map((t) => (
              <Card key={t.name} variant="metal" className="items-center text-center" style={{ gap: 0, lineHeight: px(12), padding: `${px(2)} ${px(6)} ${px(4)}` }}>
                <span>{t.name}</span>
                <t.Large />
                <span style={{ color: t.done === t.total ? GREEN : YELLOW }}>
                  {t.done}/{t.total}
                </span>
                <Progress value={(t.done / t.total) * 100} color={t.done === t.total ? "lime" : "yellow"} segments={5} className="w-full" style={{ height: px(6), marginTop: px(1) }} />
              </Card>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col" style={{ gap: px(3) }}>
          <div className="osrs-text-bold text-center">Combat Profile - Zezima</div>
          <List className="flex-1" style={{ background: "rgb(0 0 0 / 0.08)" }}>
            {PROFILE.map(([k, v]) => (
              <ListItem key={k} className="justify-between" style={{ minHeight: px(29) }}>
                <span>{k}</span>
                <span className="truncate" style={{ color: WHITE }}>
                  {v}
                </span>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </WindowBody>
  );
}

function TasksView() {
  const [tier, setTier] = React.useState("Master");
  const [type, setType] = React.useState("All");
  const [monster, setMonster] = React.useState("All");
  const [completed, setCompleted] = React.useState("All");
  const tasks = TASKS.filter(
    (t) =>
      (tier === "All" || TIERS[t.tier].name === tier) &&
      (type === "All" || t.type === type) &&
      (monster === "All" || t.monster === monster) &&
      (completed === "All" || (completed === "Complete") === t.done),
  );
  return (
    <>
      <div style={{ padding: px(4) }}>
        <Banner value={78}>Total Points: 339 - Next unlock in 97 points</Banner>
      </div>
      <WindowSeparator />
      <div className="flex min-h-0 flex-1">
        <div className="flex flex-col" style={{ width: px(110), padding: px(6), gap: px(8) }}>
          <div className="osrs-text-bold text-center">Filters</div>
          <FilterSelect label="Tier:" value={tier} onChange={setTier} items={["All", ...TIERS.map((t) => t.name)]} />
          <FilterSelect label="Type:" value={type} onChange={setType} items={["All", "Kill Count", "Mechanical", "Perfection", "Restriction", "Speed"]} />
          <FilterSelect label="Monster:" value={monster} onChange={setMonster} items={["All", ...new Set(TASKS.map((t) => t.monster))]} />
          <FilterSelect label="Completed:" value={completed} onChange={setCompleted} items={["All", "Complete", "Incomplete"]} />
        </div>
        <WindowSeparator orientation="vertical" />
        <ScrollArea className="min-w-0 flex-1">
          <List>
            {tasks.map((t) => {
              const { Small } = TIERS[t.tier];
              return (
                <ListItem key={t.name} className="osrs-list-item-lg" style={{ gap: px(6) }}>
                  <button type="button" aria-label="Expand" className="group shrink-0 cursor-pointer border-0 bg-transparent p-0">
                    <iconSprites.plusIcon className="group-hover:hidden" />
                    <iconSprites.plusIconHovered className="hidden group-hover:inline-block" />
                  </button>
                  <Small className="shrink-0" />
                  <div className="flex min-w-0 flex-col">
                    <span className={t.done ? undefined : "osrs-muted"} style={t.done ? { color: GREEN } : undefined}>
                      {t.name}
                    </span>
                    <span>
                      Monster: <span style={{ color: WHITE }}>{t.monster}</span>
                    </span>
                  </div>
                </ListItem>
              );
            })}
          </List>
        </ScrollArea>
      </div>
    </>
  );
}

function BossesView({ onOpen }: { onOpen: (name: string) => void }) {
  const [q, setQ] = React.useState("");
  const bosses = BOSSES.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div className="flex items-center" style={{ gap: px(10), padding: `${px(6)} ${px(10)}` }}>
        <span>Search:</span>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="*" className="flex-1" />
      </div>
      <WindowSeparator />
      <ScrollArea className="min-h-0 flex-1">
        <div className="grid grid-cols-3" style={{ gap: px(4), padding: px(4) }}>
          {bosses.map((b) => (
            <Card
              key={b.name}
              variant="metal"
              role="button"
              tabIndex={0}
              onClick={() => onOpen(b.name)}
              className="cursor-pointer items-center text-center"
              style={{ gap: px(2), padding: `${px(8)} ${px(10)}` }}
            >
              <span className="osrs-text-bold" style={b.done === b.total ? { color: GREEN } : undefined}>
                {b.name}
              </span>
              <span>
                Level: <span style={{ color: WHITE }}>{b.level}</span>
              </span>
              <span style={{ color: ratioColor(b.done, b.total) }}>
                {b.done}/{b.total}
              </span>
              <Progress value={(b.done / b.total) * 100} color={b.done === b.total ? "lime" : "yellow"} segments={4} className="w-full" style={{ height: px(9) }} />
            </Card>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}

function BossView({ name, onBack }: { name: string; onBack: () => void }) {
  const boss = BOSSES.find((b) => b.name === name) ?? BOSSES[7];
  return (
    <WindowBody className="flex-col" style={{ gap: px(6) }}>
      <Banner value={(boss.done / boss.total) * 100}>
        Tasks Completed: {boss.done}/{boss.total}
      </Banner>
      <div className="flex min-h-0 flex-1" style={{ gap: px(8) }}>
        <div className="flex min-w-0 flex-1 flex-col" style={{ gap: px(4) }}>
          <div className="osrs-text-bold">{boss.name}</div>
          <Tabs defaultValue="overview" className="min-h-0 flex-1">
            <TabsList style={{ width: px(180) }}>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
            </TabsList>
            <ScrollArea className="osrs-outline min-h-0 flex-1" style={{ background: "rgb(0 0 0 / 0.08)" }}>
              <TabsContent value="overview" className="flex flex-col" style={{ padding: px(6), gap: px(12) }}>
                <p className="m-0">
                  {boss.name} is an enormous bear empowered by the corruption of the Wilderness. He resides south of the
                  Demonic Ruins in the Wilderness.
                </p>
                <p className="m-0">
                  Attack Styles - Melee, Special
                  <br />
                  Immunities - Poison, Venom, Magic
                  <br />
                  Slayer Categories - Bear
                </p>
              </TabsContent>
              <TabsContent value="difficulty" style={{ padding: px(6) }}>
                Most tasks for {boss.name} are in the Elite and Master tiers.
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
        <div className="flex flex-col items-center" style={{ width: px(160), gap: px(4) }}>
          <div className="flex w-full justify-between">
            <Button variant="metal" tone="white" size="icon" aria-label="Task list" style={{ width: px(48), height: px(24) }}>
              <glyphSprites.combatAchievementsTasksCompleted />
            </Button>
            <Button variant="metal" tone="white" size="icon" aria-label="World map" style={{ width: px(48), height: px(24) }}>
              <orbSprites.worldMapPlanet />
            </Button>
            <Button variant="metal" tone="white" size="icon" aria-label="Wiki" style={{ width: px(48), height: px(24) }}>
              <glyphSprites.wiki />
            </Button>
          </div>
          <div className="osrs-outline flex w-full items-center justify-center" style={{ height: px(104), background: "rgb(0 0 0 / 0.08)" }}>
            <SkillIcon skill="slayer" scale={3} title="Boss model" />
          </div>
          <div className="flex flex-col items-center">
            <span>
              Combat Level: <span style={{ color: WHITE }}>{boss.level}</span>
            </span>
            <span>
              Kill Count: <span style={{ color: WHITE }}>250</span>
            </span>
          </div>
          <div className="flex w-full justify-between" style={{ marginTop: "auto" }}>
            <Button variant="metal" tone="white" onClick={onBack} style={{ width: px(70) }}>
              Boss list
            </Button>
            <Button variant="metal" tone="white" disabled style={{ width: px(70) }}>
              Reset time
            </Button>
          </div>
        </div>
      </div>
    </WindowBody>
  );
}

const VIEWS = [
  { value: "overview", label: "Overview" },
  { value: "tasks", label: "Tasks" },
  { value: "bosses", label: "Bosses" },
  { value: "rewards", label: "Rewards" },
];

export default function CombatAchievementsRecipe() {
  const [view, setView] = React.useState("tasks");
  const [boss, setBoss] = React.useState<string | null>(null);
  const title = boss ?? VIEWS.find((v) => v.value === view)?.label;
  return (
    <div className="osrs flex items-start justify-start p-6">
      <Window draggable resizable style={{ width: px(480), height: px(326) }} minWidth={400} minHeight={260}>
        <WindowHeader
          start={
            <WindowMenu
              items={VIEWS}
              value={view}
              onValueChange={(v) => {
                setBoss(null);
                setView(v);
              }}
            />
          }
          end={<WindowClose />}
        >
          Combat Achievements - {title}
        </WindowHeader>
        {boss ? (
          <BossView name={boss} onBack={() => setBoss(null)} />
        ) : view === "overview" ? (
          <Overview />
        ) : view === "tasks" ? (
          <TasksView />
        ) : view === "bosses" ? (
          <BossesView onOpen={setBoss} />
        ) : (
          <WindowBody className="items-center justify-center">Rewards</WindowBody>
        )}
      </Window>
    </div>
  );
}
