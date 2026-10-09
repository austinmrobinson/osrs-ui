// Gallery: pickers, confirmations and settings-style windows.
import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { Card } from "@/registry/osrs/ui/card";
import { Checkbox } from "@/registry/osrs/ui/checkbox";
import { List, ListItem } from "@/registry/osrs/ui/list";
import { RadioGroup, RadioGroupItem } from "@/registry/osrs/ui/radio-group";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/osrs/ui/select";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/registry/osrs/ui/field";
import { Progress } from "@/registry/osrs/ui/progress";
import { skillIcons } from "@/registry/osrs/ui/skill-icons";
import { Stat } from "@/registry/osrs/ui/stat";
import { StatusIcon } from "@/registry/osrs/ui/status-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/registry/osrs/ui/toggle-group";
import { tabSprites } from "@/registry/osrs/ui/tab-sprites";
import { Item } from "@/site/demo-data/game";
import { items, type ItemId } from "@/site/demo-data/items";
import { Col, Grey, Instruction, px, Row, White, Win, Yellow, type GalleryExample } from "./shared";

const Radio = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <label className="flex cursor-pointer items-center" style={{ gap: px(4) }}>
    <RadioGroupItem value={value} />
    {children}
  </label>
);

/** 18. Option cards: one selected (orange outline), locked ones disabled. */
function TitlePicker() {
  const titles: [string, string, boolean][] = [
    ["the Fiend", "Kill 1,000 demons", true],
    ["Lord", "Complete the Varrock diary", true],
    ["the Adventurer", "Complete 50 quests", true],
    ["Skillerman", "Reach 2,000 total level", true],
    ["the Insane", "Defeat the Inferno", false],
    ["Duke", "Complete the Kourend diary", false],
  ];
  return (
    <Win title="Choose a Title">
      <div className="grid min-h-0 flex-1 grid-cols-3" style={{ gap: px(4) }}>
        {titles.map(([t, how, have], i) => (
          <Card key={t} selected={i === 0} disabled={!have} className="items-center justify-center text-center" style={{ gap: px(2) }}>
            <span style={{ color: have ? "var(--osrs-white)" : undefined }}>{t}</span>
            <span style={{ lineHeight: px(13) }}>{how}</span>
          </Card>
        ))}
      </div>
      <Row className="items-center justify-between">
        <span>
          Preview: <White>Zezima the Fiend</White>
        </span>
        <Button style={{ width: px(140) }}>Confirm</Button>
      </Row>
    </Win>
  );
}

/** 19. Skill picker: a grid of skill icon tiles, evenly spaced, one selected, then Confirm. */
function XpLamp() {
  const skills = [
    "attack",
    "strength",
    "defence",
    "ranged",
    "prayer",
    "magic",
    "runecraft",
    "hitpoints",
    "agility",
    "herblore",
    "thieving",
    "crafting",
    "fletching",
    "slayer",
    "mining",
    "smithing",
    "fishing",
    "cooking",
  ] as const;
  return (
    <Win title="Lamp" width={300} height={250}>
      <Instruction>Choose the stat you wish to be advanced!</Instruction>
      <Row className="flex-1 items-center justify-center">
        <ToggleGroup defaultValue={["herblore"]} className="grid grid-cols-6" style={{ gap: px(4) }}>
          {skills.map((s) => {
            const Icon = skillIcons[s];
            return (
              <ToggleGroupItem key={s} value={s} size="icon" aria-label={s}>
                <Icon />
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </Row>
      <Row className="justify-center">
        <Button style={{ width: px(160) }}>Confirm</Button>
      </Row>
    </Win>
  );
}

/** 20. Leagues relics: tier rows of named relic cards, the chosen relic explained, and progress to
 *  the next tier as a bar. */
function RelicPicker() {
  const tiers: [string, string, [ItemId, string][], number][] = [
    [
      "Tier 1",
      "0",
      [
        ["rune-pickaxe", "Power Miner"],
        ["dragon-axe", "Lumberjack"],
        ["tinderbox", "Endless Fire"],
      ],
      0,
    ],
    [
      "Tier 2",
      "1,500",
      [
        ["prayer-potion-4", "Faithful"],
        ["stamina-potion-4", "Endless Run"],
        ["super-restore-4", "Restoration"],
      ],
      0,
    ],
    [
      "Tier 3",
      "5,000",
      [
        ["twisted-bow", "Archer's Embrace"],
        ["toxic-blowpipe", "Venomous"],
        ["abyssal-whip", "Lashing"],
      ],
      -1,
    ],
  ];
  return (
    <Win title="Leagues - Relics" frame="rivets">
      <Row className="min-h-0 flex-1">
        <div className="grid flex-[3] grid-cols-[auto_1fr_1fr_1fr] grid-rows-3" style={{ gap: px(4) }}>
          {tiers.map(([t, cost, relics, chosen], ti) => (
            <React.Fragment key={t}>
              <Col gap={0} className="items-center justify-center" style={{ width: px(44) }}>
                <span style={{ fontFamily: "var(--osrs-font-bold)" }}>{t}</span>
                <span style={{ color: ti === 2 ? "#9f9f9f" : "var(--osrs-white)" }}>{cost}</span>
              </Col>
              {relics.map(([id, name], i) => {
                const { Icon } = items[id];
                return (
                  <Card key={id} selected={i === chosen} disabled={ti === 2} className="min-w-0 items-center justify-center text-center" style={{ gap: px(2) }}>
                    <Icon />
                    <span
                      style={{
                        lineHeight: px(13),
                        color: i === chosen ? "var(--osrs-white)" : undefined,
                      }}
                    >
                      {name}
                    </span>
                  </Card>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <FieldSet className="flex-[2]">
          <FieldLegend>Faithful</FieldLegend>
          <Col gap={6}>
            <p className="m-0" style={{ lineHeight: px(14) }}>
              Prayer drains <White>50%</White> slower, and you can't be knocked below <White>1</White> Prayer point by enemies.
            </p>
            <Grey>Chosen in Tier 2</Grey>
          </Col>
        </FieldSet>
      </Row>
      <Col gap={2}>
        <Progress value={96} color="orange" style={{ height: px(24) }}>
          4,820 / 5,000 points
        </Progress>
        <p className="m-0 text-center">
          <White>180</White> points until Tier 3
        </p>
      </Col>
    </Win>
  );
}

/** 21. The smallest window: a question, the item, and two answers. */
function DropConfirm() {
  return (
    <Win title="Destroy" width={330} height={190}>
      <Row gap={10} className="flex-1 items-center justify-center">
        <Item id="clue-scroll-elite" />
        <Col gap={2}>
          <White>Are you sure you want to destroy this?</White>
          <span>The clue scroll (elite) can't be got back.</span>
        </Col>
      </Row>
      <Row className="justify-center">
        <Button tone="destructive" style={{ width: px(110) }}>
          Yes
        </Button>
        <Button style={{ width: px(110) }}>No</Button>
      </Row>
    </Win>
  );
}

/** 22. A poll: question group boxes with radio answers, then Vote. */
function PollBooth() {
  return (
    <Win title="Poll Booth - Sailing Feedback">
      <ScrollArea className="min-h-0 flex-1">
        <Col style={{ paddingRight: px(6) }}>
          {[
            ["Should charter ships stop at Corsair Cove?", ["Yes", "No", "Skip question"]],
            ["Should boat repairs cost Construction materials?", ["Yes", "No", "Skip question"]],
          ].map(([q, answers], i) => (
            <FieldSet key={q as string}>
              <FieldLegend>Question {i + 1}</FieldLegend>
              <Col gap={4}>
                <White>{q as string}</White>
                <RadioGroup defaultValue="Yes">
                  {(answers as string[]).map((a) => (
                    <Radio key={a} value={a}>
                      {a}
                    </Radio>
                  ))}
                </RadioGroup>
              </Col>
            </FieldSet>
          ))}
        </Col>
      </ScrollArea>
      <Row className="items-center justify-between">
        <Grey>Closes in 6 days</Grey>
        <Button style={{ width: px(150) }}>Vote</Button>
      </Row>
    </Win>
  );
}

/** 23. Striped hotkey list, illustration space, and a mode group with radios. */
function TeleportNexus() {
  const places = ["Varrock", "Grand Exchange", "Falador", "Lumbridge", "Camelot", "Ardougne", "Kourend Castle", "Civitas illa Fortis"];
  return (
    <Win title="Teleport Nexus">
      <Row className="min-h-0 flex-1">
        <ScrollArea className="osrs-outline min-h-0 flex-[3]">
          <List>
            {places.map((p, i) => (
              <ListItem key={p} style={{ minHeight: px(22), gap: px(6) }}>
                <tabSprites.magic style={{ width: px(16), height: px(18) }} />
                <span>
                  {i + 1 < 10 ? i + 1 : String.fromCharCode(56 + i)}: {p}
                </span>
              </ListItem>
            ))}
          </List>
        </ScrollArea>
        <Col className="flex-[2]">
          <Row className="flex-1 items-center justify-center">
            <tabSprites.magic style={{ width: px(66), height: px(72) }} />
          </Row>
          <FieldSet>
            <FieldLegend>Mode</FieldLegend>
            <RadioGroup defaultValue="teleport">
              <Radio value="teleport">Teleport</Radio>
              <Radio value="scry">Scry</Radio>
            </RadioGroup>
          </FieldSet>
        </Col>
      </Row>
    </Win>
  );
}

/** 24. A settings window: grouped toggles and a dropdown, in the bank-settings style. */
function LootFilter() {
  return (
    <Win title="Loot Filter" frame="rivets">
      <Row className="items-center" gap={8}>
        <span>Show drops worth over:</span>
        <Select
          defaultValue="10k"
          items={{
            "1k": "1,000 coins",
            "10k": "10,000 coins",
            "100k": "100,000 coins",
          }}
        >
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1k">1,000 coins</SelectItem>
            <SelectItem value="10k">10,000 coins</SelectItem>
            <SelectItem value="100k">100,000 coins</SelectItem>
          </SelectContent>
        </Select>
      </Row>
      <Row className="min-h-0 flex-1">
        <FieldSet className="flex-1">
          <FieldLegend>Always show</FieldLegend>
          <FieldGroup style={{ gap: 0 }}>
            <Field>
              <FieldLabel>Untradeable drops</FieldLabel>
              <Checkbox defaultChecked />
            </Field>
            <Field>
              <FieldLabel>Clue scrolls</FieldLabel>
              <Checkbox defaultChecked />
            </Field>
            <Field>
              <FieldLabel>Pets</FieldLabel>
              <Checkbox defaultChecked />
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSet className="flex-1">
          <FieldLegend>Always hide</FieldLegend>
          <FieldGroup style={{ gap: 0 }}>
            <Field>
              <FieldLabel>Bones</FieldLabel>
              <Checkbox />
            </Field>
            <Field>
              <FieldLabel>Ashes</FieldLabel>
              <Checkbox defaultChecked />
            </Field>
            <Field>
              <FieldLabel>Coins under 100</FieldLabel>
              <Checkbox defaultChecked />
            </Field>
          </FieldGroup>
        </FieldSet>
      </Row>
      <Row className="justify-end">
        <Button style={{ width: px(140) }}>Reset to default</Button>
      </Row>
    </Win>
  );
}

/** 25. A minigame lobby: who's in, the options, and Start. */
function MinigameLobby() {
  const team: [string, number, boolean][] = [
    ["Zezima", 126, true],
    ["Woox", 126, true],
    ["B0aty", 126, false],
    ["Settled", 3, true],
  ];
  return (
    <Win title="Pest Control - Lander">
      <Row className="min-h-0 flex-1">
        <FieldSet className="flex-[3]">
          <FieldLegend>Your team</FieldLegend>
          <List>
            {team.map(([n, lvl, ready]) => (
              <ListItem key={n} className="justify-between" style={{ minHeight: px(20) }}>
                <Row gap={6} className="items-center">
                  <StatusIcon status={ready ? "done" : "failed"} label={ready ? "Ready" : "Not ready"} />
                  <White>{n}</White>
                </Row>
                <span>Level {lvl}</span>
              </ListItem>
            ))}
          </List>
        </FieldSet>
        <Col className="flex-[2]">
          <FieldSet>
            <FieldLegend>Boat</FieldLegend>
            <RadioGroup defaultValue="veteran">
              <Radio value="novice">Novice</Radio>
              <Radio value="intermediate">Intermediate</Radio>
              <Radio value="veteran">Veteran</Radio>
            </RadioGroup>
          </FieldSet>
          <Stat label="Next departure" value="0:42" className="flex-1" />
        </Col>
      </Row>
      <Row className="justify-between">
        <Button tone="destructive" style={{ width: px(150) }}>
          Leave
        </Button>
        <Button tone="positive" style={{ width: px(150) }}>
          Ready
        </Button>
      </Row>
    </Win>
  );
}

/** 26. Account security: status with marks, and the actions it allows. */
function BankPin() {
  return (
    <Win title="Bank PIN Settings" width={360} height={270}>
      <FieldSet>
        <FieldLegend>Status</FieldLegend>
        <Col gap={4}>
          <Row gap={6} className="items-center">
            <StatusIcon status="done" />
            <span>You have a Bank PIN.</span>
          </Row>
          <Row gap={6} className="items-center">
            <StatusIcon status="failed" />
            <span>
              No recovery delay. <Yellow>Recommended: 7 days</Yellow>
            </span>
          </Row>
        </Col>
      </FieldSet>
      <Col className="flex-1 justify-center">
        <Button>Change your PIN</Button>
        <Button>Change your recovery delay</Button>
        <Button tone="destructive">Delete your PIN</Button>
      </Col>
    </Win>
  );
}

/** 27. Panel tabs over a grid of cosmetic cards. */
function Wardrobe() {
  const sets: Record<string, ItemId[]> = {
    Head: ["fire-cape", "amulet-of-glory-6", "berserker-ring-i"],
    Body: ["rune-platebody", "fighter-torso", "dragon-platelegs"],
    Hands: ["barrows-gloves", "dragon-boots", "dragon-defender"],
  };
  return (
    <Win title="Costume Room" frame="rivets">
      <Tabs variant="panel" defaultValue="Body" className="flex min-h-0 flex-1 flex-col">
        <TabsList>
          {Object.keys(sets).map((k) => (
            <TabsTrigger key={k} value={k}>
              {k}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(sets).map(([k, list]) => (
          <TabsContent key={k} value={k} className="flex-1">
            <div className="grid grid-cols-3" style={{ gap: px(4), padding: px(4) }}>
              {list.map((id, i) => {
                const { Icon, name } = items[id];
                return (
                  <Card key={id} selected={i === 0} className="items-center justify-center text-center" style={{ height: px(70), gap: px(2) }}>
                    <Icon />
                    <span>{name}</span>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <Row className="justify-end" gap={4}>
        <ToggleGroup defaultValue={["store"]}>
          <ToggleGroupItem value="store" size="default">
            Store
          </ToggleGroupItem>
          <ToggleGroupItem value="wear" size="default">
            Wear
          </ToggleGroupItem>
        </ToggleGroup>
      </Row>
    </Win>
  );
}

export const pickers: GalleryExample[] = [
  {
    id: "title-picker",
    title: "Title picker",
    archetype: "window",
    brief: "Option cards in a 3x2 grid: one selected (orange outline), locked ones disabled; preview line and Confirm.",
    Component: TitlePicker,
  },
  {
    id: "xp-lamp",
    title: "XP lamp",
    archetype: "window",
    brief: "Small window: instruction line, an evenly spaced grid of skill icon tiles with one selected, Confirm.",
    Component: XpLamp,
  },
  {
    id: "relic-picker",
    title: "Relic picker",
    archetype: "window",
    brief: "Tier rows (cost under the tier) of equal, notched relic cards, selected / locked; explanation group box; a large progress bar to the next tier.",
    Component: RelicPicker,
  },
  {
    id: "drop-confirm",
    title: "Destroy confirmation",
    archetype: "window",
    brief: "Smallest modal: item, white question, orange consequence, red Yes / plain No.",
    Component: DropConfirm,
  },
  {
    id: "poll-booth",
    title: "Poll booth",
    archetype: "window",
    brief: "Scrolling group boxes, each a question with radio answers; footer note and Vote.",
    Component: PollBooth,
  },
  {
    id: "teleport-nexus",
    title: "Teleport nexus",
    archetype: "window",
    brief: "Portal Nexus layout: striped hotkey list with icons, illustration space, mode radios in a group box.",
    Component: TeleportNexus,
  },
  {
    id: "loot-filter",
    title: "Loot filter",
    archetype: "window",
    brief: "Bank-settings style: labelled dropdown, two group boxes of checkbox rows, secondary tile action.",
    Component: LootFilter,
  },
  {
    id: "minigame-lobby",
    title: "Minigame lobby",
    archetype: "window",
    brief: "Team list with ready marks, option radios, boxed countdown stat, a matched red Leave / green Ready pair.",
    Component: MinigameLobby,
  },
  {
    id: "bank-pin",
    title: "Bank PIN settings",
    archetype: "window",
    brief: "Status group box with matched round check / cross marks, stacked full-width metal actions, the destructive one red.",
    Component: BankPin,
  },
  {
    id: "wardrobe",
    title: "Costume room",
    archetype: "window",
    brief: "Panel tabs over a card grid with a selected card; Store / Wear toggle tiles.",
    Component: Wardrobe,
  },
];
