// Gallery: trackers, logs and summaries (mostly rivet windows).
import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { Card } from "@/registry/osrs/ui/card";
import { DescriptionItem, DescriptionList } from "@/registry/osrs/ui/description-list";
import { FieldLegend, FieldSet } from "@/registry/osrs/ui/field";
import { List, ListItem, ListItemContent, ListItemDescription, ListItemMedia, ListItemTitle } from "@/registry/osrs/ui/list";
import { Progress } from "@/registry/osrs/ui/progress";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { Stat } from "@/registry/osrs/ui/stat";
import { StatusIcon } from "@/registry/osrs/ui/status-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";
import { WindowMenu } from "@/registry/osrs/ui/window";
import { skillIcons } from "@/registry/osrs/ui/skill-icons";
import { Item } from "@/site/demo-data/game";
import { items, type ItemId } from "@/site/demo-data/items";
import { Col, Green, Grey, px, Red, Row, White, Win, Yellow, type GalleryExample } from "./shared";

function useView(initial: string) {
  return React.useState(initial);
}

/** 9. Kill counts as key/value rows beside a segmented completion bar. */
function BossTracker() {
  const [view, setView] = useView("kc");
  return (
    <Win
      title="Boss Log - Kill Counts"
      frame="rivets"
      start={
        <WindowMenu
          value={view}
          onValueChange={setView}
          items={[
            { value: "kc", label: "Kill Counts" },
            { value: "pb", label: "Personal Bests" },
          ]}
        />
      }
    >
      <Row className="min-h-0 flex-1">
        <ScrollArea className="osrs-outline min-h-0 flex-[3]">
          <DescriptionList striped>
            {[
              ["Abyssal Sire", "312"],
              ["Alchemical Hydra", "1,048"],
              ["Cerberus", "604"],
              ["Corporeal Beast", "37"],
              ["General Graardor", "220"],
              ["Kree'arra", "159"],
              ["Vorkath", "2,301"],
              ["Zulrah", "1,512"],
            ].map(([k, v]) => (
              <DescriptionItem key={k} label={k}>
                {v}
              </DescriptionItem>
            ))}
          </DescriptionList>
        </ScrollArea>
        <Col className="flex-[2]">
          <FieldSet>
            <FieldLegend>Total kills</FieldLegend>
            <p className="m-0 text-center">
              <White>6,193</White>
            </p>
          </FieldSet>
          <FieldSet className="flex-1">
            <FieldLegend>Bosses tried</FieldLegend>
            <Col gap={4}>
              <Progress value={62} color="yellow" segments={5} />
              <p className="m-0 text-center">
                <White>34</White> of 55
              </p>
            </Col>
          </FieldSet>
        </Col>
      </Row>
    </Win>
  );
}

/** 10. Panel tabs for tiers, rows with status marks. */
function ClueLog() {
  const tiers = ["Beginner", "Easy", "Medium", "Hard", "Elite", "Master"];
  const steps: [string, boolean][] = [
    ["Dig near the Falador statue", true],
    ["Talk to the Bartender in Seers' Village", true],
    ["Search the crate in the Varrock museum", false],
    ["Emote: Dance on the Draynor bridge", false],
  ];
  return (
    <Win title="Clue Scrolls" frame="rivets">
      <Tabs variant="panel" defaultValue="Hard" className="flex min-h-0 flex-1 flex-col">
        <TabsList>
          {tiers.map((t) => (
            <TabsTrigger key={t} value={t}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
        {tiers.map((t) => (
          <TabsContent key={t} value={t} className="flex min-h-0 flex-1 flex-col" style={{ gap: px(6) }}>
            <List>
              {steps.map(([s, done]) => (
                <ListItem key={s} style={{ minHeight: px(22), gap: px(8) }}>
                  <StatusIcon status={done ? "done" : "failed"} />
                  {done ? <Green>{s}</Green> : <span>{s}</span>}
                </ListItem>
              ))}
            </List>
            <Row className="mt-auto justify-between">
              <Stat variant="inline" label="Completed" value="214" />
              <Stat variant="inline" label="Steps this clue" value="2 / 6" />
            </Row>
          </TabsContent>
        ))}
      </Tabs>
    </Win>
  );
}

/** 11. Status rows: the crop's icon, where and what, and the state coloured and marked. */
function FarmingPatches() {
  const rows: [ItemId, string, string, React.ReactNode][] = [
    ["ranarr-weed", "Falador", "Ranarr (stage 3/4)", <Yellow>Growing, 18 min</Yellow>],
    ["snapdragon", "Catherby", "Snapdragon", <Green>Ready to harvest</Green>],
    ["torstol", "Ardougne", "Torstol", <Red>Diseased</Red>],
    ["weeds", "Hosidius", "Empty", <Grey>Weeds</Grey>],
    ["ranarr-weed", "Farming Guild", "Ranarr (stage 1/4)", <Yellow>Growing, 64 min</Yellow>],
  ];
  return (
    <Win title="Farming - Herb Patches">
      <ScrollArea className="osrs-outline min-h-0 flex-1">
        <List>
          {rows.map(([id, where, what, state]) => {
            const { Icon } = items[id];
            return (
              <ListItem key={where} className="justify-between" style={{ minHeight: px(36), padding: `0 ${px(8)} 0 ${px(4)}` }}>
                <Row gap={6} className="items-center">
                  <ListItemMedia>
                    <Icon />
                  </ListItemMedia>
                  <Col gap={0}>
                    <White>{where}</White>
                    <span>{what}</span>
                  </Col>
                </Row>
                {state}
              </ListItem>
            );
          })}
        </List>
      </ScrollArea>
      <Row className="items-center justify-between">
        <Row gap={4} className="items-center">
          <skillIcons.farming />
          <Stat variant="inline" label="Patches ready" value="1 / 9" />
        </Row>
        <Stat variant="inline" label="Next ready" value="18 min" />
      </Row>
    </Win>
  );
}

/** 12. A grid of area cards, each with a segmented tier bar. */
function DiaryOverview() {
  const areas: [string, number, "yellow" | "green" | "red"][] = [
    ["Ardougne", 4, "green"],
    ["Desert", 3, "yellow"],
    ["Falador", 4, "green"],
    ["Fremennik", 2, "yellow"],
    ["Kandarin", 3, "yellow"],
    ["Karamja", 4, "green"],
    ["Kourend", 1, "yellow"],
    ["Lumbridge", 4, "green"],
    ["Morytania", 0, "red"],
  ];
  return (
    <Win title="Achievement Diaries" frame="rivets">
      <div className="grid min-h-0 flex-1 grid-cols-3" style={{ gap: px(4) }}>
        {areas.map(([name, tiers, color]) => (
          <Card key={name} variant="metal" className="items-center justify-center" style={{ gap: px(3) }}>
            <span style={{ color: tiers === 4 ? "#0dc10d" : undefined }}>{name}</span>
            <Progress value={tiers * 25} color={color} segments={4} style={{ width: "90%" }} />
          </Card>
        ))}
      </div>
      <Row className="justify-center">
        <Stat variant="inline" label="Tiers complete" value="25 / 48" />
      </Row>
    </Win>
  );
}

/** 13. Loot: the last kill's drops, then session totals. */
function LootTracker() {
  const drops: [ItemId, number][] = [
    ["dragon-bones", 2],
    ["blood-rune", 120],
    ["death-rune", 240],
    ["coins-10000", 31200],
    ["super-restore-4", 2],
    ["magic-logs", 50],
  ];
  return (
    <Win title="Loot Tracker - Vorkath" frame="rivets">
      <FieldSet>
        <FieldLegend>Last kill</FieldLegend>
        <Row gap={4} className="flex-wrap justify-center">
          {drops.map(([id, q]) => (
            <Item key={id} id={id} quantity={q} />
          ))}
        </Row>
      </FieldSet>
      <Row className="min-h-0 flex-1">
        <FieldSet className="flex-1">
          <FieldLegend>This session</FieldLegend>
          <DescriptionList>
            <DescriptionItem label="Kills">42</DescriptionItem>
            <DescriptionItem label="Loot value">13,906,422</DescriptionItem>
            <DescriptionItem label="Per kill">331,105</DescriptionItem>
          </DescriptionList>
        </FieldSet>
        <FieldSet className="flex-1">
          <FieldLegend>Rarest drop</FieldLegend>
          <Row gap={8} className="items-center justify-center">
            <Item id="twisted-bow" />
            <span>
              Twisted bow
              <br />
              <Yellow>1 / 5,000</Yellow>
            </span>
          </Row>
        </FieldSet>
      </Row>
    </Win>
  );
}

/** 14. A summary page: stats list on the left, grouped badges and a model area on the right. */
function AccountSummary() {
  return (
    <Win title="Account Summary">
      <Row className="min-h-0 flex-1">
        <div className="osrs-outline min-h-0 flex-1" style={{ padding: px(3) }}>
          <DescriptionList striped className="h-full [&>*]:flex-1">
            {[
              ["Account age", "4 years, 112 days"],
              ["Total level", "2,113"],
              ["Total XP", "312,488,120"],
              ["Quest points", "300"],
              ["Combat level", "126"],
              ["Collections", "843 / 1,568"],
              ["Deaths", "211"],
            ].map(([k, v]) => (
              <DescriptionItem key={k} label={k}>
                {v}
              </DescriptionItem>
            ))}
          </DescriptionList>
        </div>
        <Col style={{ width: px(170) }}>
          <FieldSet>
            <FieldLegend>Highest skills</FieldLegend>
            <Row gap={8} className="justify-center">
              <skillIcons.attack />
              <skillIcons.slayer />
              <skillIcons.magic />
            </Row>
          </FieldSet>
          <FieldSet className="flex-1">
            <FieldLegend>Rank</FieldLegend>
            <Col gap={2} className="items-center">
              <White>Adamant</White>
              <span>30,370 points</span>
            </Col>
          </FieldSet>
        </Col>
      </Row>
    </Win>
  );
}

/** 15. Collection grid: obtained cards normal, missing ones disabled. */
function PetLog() {
  const pets: [ItemId, string, boolean][] = [
    ["abyssal-whip", "Abyssal orphan", true],
    ["fire-cape", "TzRek-Jad", true],
    ["dragon-defender", "Pet general", false],
    ["twisted-bow", "Olmlet", false],
    ["toxic-blowpipe", "Snakeling", true],
    ["rune-pickaxe", "Rock golem", false],
    ["dragon-axe", "Beaver", true],
    ["raw-shark", "Heron", false],
  ];
  return (
    <Win title="Collection Log - Pets" frame="rivets">
      <div className="grid min-h-0 flex-1 grid-cols-4" style={{ gap: px(4) }}>
        {pets.map(([id, name, got]) => {
          const { Icon } = items[id];
          return (
            <Card key={name} variant="metal" disabled={!got} className="items-center justify-center text-center" style={{ gap: px(2) }}>
              <Icon />
              <span style={{ lineHeight: px(13) }}>{name}</span>
            </Card>
          );
        })}
      </div>
      <Progress value={50} color="green" className="w-full" />
      <p className="m-0 text-center">
        Pets obtained: <White>4 / 8</White>
      </p>
    </Win>
  );
}

/** 16. A task detail page with a requirements checklist and a tracked action. */
function TaskDetail() {
  return (
    <Win title="Combat Achievements - Task" frame="rivets">
      <Row className="min-h-0 flex-1">
        <Col className="flex-1">
          <FieldSet>
            <FieldLegend>Perfect Zulrah</FieldLegend>
            <p className="m-0" style={{ lineHeight: px(14) }}>
              Kill Zulrah whilst taking no damage from the following: Snakelings, Venom Clouds, Zulrah's Green or Crimson phase.
            </p>
          </FieldSet>
          <FieldSet className="flex-1">
            <FieldLegend>Requirements</FieldLegend>
            <List>
              {[
                ["75 Ranged", true],
                ["Regicide", true],
                ["Zulrah kill count 1", false],
              ].map(([r, ok]) => (
                <ListItem key={r as string} style={{ gap: px(6) }}>
                  <StatusIcon status={ok ? "done" : "failed"} />
                  <span>{r as string}</span>
                </ListItem>
              ))}
            </List>
          </FieldSet>
        </Col>
        <Col style={{ width: px(150) }}>
          <FieldSet>
            <FieldLegend>Tier</FieldLegend>
            <p className="m-0 text-center">
              <White>Elite</White>
            </p>
          </FieldSet>
          <FieldSet className="flex-1">
            <FieldLegend>Points</FieldLegend>
            <p className="m-0 text-center">
              <White>5</White>
            </p>
          </FieldSet>
          <Button tone="white">Track task</Button>
        </Col>
      </Row>
    </Win>
  );
}

/** 17. Two-column personal bests on a plain window, header button for history. */
function SkillingLog() {
  const rows: [keyof typeof skillIcons, string, string][] = [
    ["woodcutting", "Woodcutting", "Magic logs: 4,210"],
    ["fishing", "Fishing", "Sharks: 18,233"],
    ["mining", "Mining", "Runite ore: 912"],
    ["firemaking", "Firemaking", "Wintertodt: 1,034"],
  ];
  return (
    <Win
      title="Skilling Log"
      start={
        <Button tone="white" size="sm">
          History
        </Button>
      }
    >
      <ScrollArea className="osrs-outline min-h-0 flex-1">
        <List>
          {rows.map(([skill, name, detail]) => {
            const Icon = skillIcons[skill];
            return (
              <ListItem key={name}>
                <ListItemMedia>
                  <Icon />
                </ListItemMedia>
                <ListItemContent>
                  <ListItemTitle>{name}</ListItemTitle>
                  <ListItemDescription label="Best">{detail}</ListItemDescription>
                </ListItemContent>
              </ListItem>
            );
          })}
        </List>
      </ScrollArea>
    </Win>
  );
}

export const trackers: GalleryExample[] = [
  {
    id: "boss-tracker",
    title: "Boss kill counts",
    archetype: "window",
    brief: "Rivet window with a view menu; striped key/value list, totals and a segmented progress bar in group boxes.",
    Component: BossTracker,
  },
  {
    id: "clue-log",
    title: "Clue scroll log",
    archetype: "window",
    brief: "Panel tabs for tiers; list rows with green check / red cross status marks; two inline stats in the footer.",
    Component: ClueLog,
  },
  {
    id: "farming-patches",
    title: "Farming patches",
    archetype: "window",
    brief: "Two-line status rows with the crop icon, coloured by state (yellow growing, green ready, red diseased, grey empty).",
    Component: FarmingPatches,
  },
  {
    id: "diary-overview",
    title: "Achievement diaries",
    archetype: "window",
    brief: "3x3 grid of metal cards, each with a 4-segment tier bar; completed names in green.",
    Component: DiaryOverview,
  },
  {
    id: "loot-tracker",
    title: "Loot tracker",
    archetype: "window",
    brief: "Item strip in a group box, session key/values, and a highlighted rare drop.",
    Component: LootTracker,
  },
  {
    id: "account-summary",
    title: "Account summary",
    archetype: "window",
    brief: "League-summary layout: striped key/values on the left, group boxes with icons and rank on the right.",
    Component: AccountSummary,
  },
  {
    id: "pet-log",
    title: "Pet collection",
    archetype: "window",
    brief: "Metal card grid with obtained and disabled (missing) states, overall progress bar.",
    Component: PetLog,
  },
  {
    id: "task-detail",
    title: "Combat task detail",
    archetype: "window",
    brief: "Detail page: description group box, requirements checklist with status marks, tier and points boxes, one action.",
    Component: TaskDetail,
  },
  {
    id: "skilling-log",
    title: "Skilling log",
    archetype: "window",
    brief: "Tan window with a small header button; skill-icon rich rows with a 'Best:' detail.",
    Component: SkillingLog,
  },
];
