// Gallery: side-panel tabs and chatbox prompts.
import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { cardVariants } from "@/registry/osrs/ui/card";
import { Chatbox, NpcDialogue, OptionDialogue } from "@/registry/osrs/ui/chatbox";
import { DescriptionItem, DescriptionList } from "@/registry/osrs/ui/description-list";
import { FieldLegend, FieldSet } from "@/registry/osrs/ui/field";
import { List, ListItem, ListItemContent, ListItemDescription, ListItemMedia, ListItemTitle } from "@/registry/osrs/ui/list";
import { Progress } from "@/registry/osrs/ui/progress";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/osrs/ui/select";
import { SidePanel, SidePanelContent } from "@/registry/osrs/ui/side-panel";
import { Stat } from "@/registry/osrs/ui/stat";
import { StatusIcon } from "@/registry/osrs/ui/status-icon";
import { ToggleGroup, ToggleGroupItem } from "@/registry/osrs/ui/toggle-group";
import { skillIcons } from "@/registry/osrs/ui/skill-icons";
import { BOTTOM_TABS, Item, TOP_TABS } from "@/site/demo-data/game";
import { items, type ItemId } from "@/site/demo-data/items";
import { Col, Green, px, Red, Row, White, Yellow, type GalleryExample } from "./shared";

/** The side panel with one tab's content, which fills the 190 x 261 area. */
function Panel({ tab = "quests", children }: { tab?: string; children: React.ReactNode }) {
  return (
    <SidePanel top={TOP_TABS} bottom={BOTTOM_TABS} defaultValue={tab}>
      <SidePanelContent value={tab} className="osrs-text flex flex-col" style={{ width: px(184), height: px(250), gap: px(4) }}>
        {children}
      </SidePanelContent>
    </SidePanel>
  );
}
const PanelTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="m-0 text-center" style={{ fontFamily: "var(--osrs-font-bold)" }}>
    {children}
  </p>
);

/** 28. A minigame tab: title, key/values, a role bar and one stone action. */
function BarbarianAssault() {
  return (
    <Panel>
      <PanelTitle>Barbarian Assault</PanelTitle>
      <DescriptionList striped>
        <DescriptionItem label="Wave">7 / 10</DescriptionItem>
        <DescriptionItem label="Role">Healer</DescriptionItem>
        <DescriptionItem label="Honour points">412</DescriptionItem>
        <DescriptionItem label="Queen kills">3</DescriptionItem>
      </DescriptionList>
      <FieldSet>
        <FieldLegend>Healer level</FieldLegend>
        <Col gap={2}>
          <Progress value={80} color="green" segments={5} />
          <p className="m-0 text-center">
            <White>4</White> of 5
          </p>
        </Col>
      </FieldSet>
      <Button variant="stone" className="mt-auto">
        Leave game
      </Button>
    </Panel>
  );
}

/** 29. Group finder: a dropdown, the open groups, two stone actions. */
function GroupFinder() {
  const groups: [string, string, number][] = [
    ["Corporeal Beast", "Gabeeeeee", 4],
    ["Nex", "Faux", 7],
    ["Barbarian Assault", "Tinyorca", 3],
    ["Tombs of Amascut", "Raid Daddy", 2],
  ];
  return (
    <Panel>
      <PanelTitle>Grouping</PanelTitle>
      <Select
        defaultValue="all"
        items={{
          all: "All activities",
          bosses: "Bosses",
          minigames: "Minigames",
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All activities</SelectItem>
          <SelectItem value="bosses">Bosses</SelectItem>
          <SelectItem value="minigames">Minigames</SelectItem>
        </SelectContent>
      </Select>
      <ScrollArea className="osrs-outline min-h-0 flex-1">
        <List>
          {groups.map(([act, leader, size]) => (
            <ListItem key={act} className="flex-col items-stretch" style={{ padding: `${px(2)} ${px(4)}`, gap: 0 }}>
              <White>{act}</White>
              <Row className="justify-between">
                <span>{leader}</span>
                <Yellow>{size} / 8</Yellow>
              </Row>
            </ListItem>
          ))}
        </List>
      </ScrollArea>
      <Row gap={4}>
        <Button variant="stone" className="flex-1">
          Join
        </Button>
        <Button variant="stone" className="flex-1">
          Create
        </Button>
      </Row>
    </Panel>
  );
}

/** 30. XP tracker: skill rich rows with rates. */
function XpTracker() {
  const rows: [keyof typeof skillIcons, string, string][] = [
    ["slayer", "Slayer", "48,200 xp/hr"],
    ["ranged", "Ranged", "61,900 xp/hr"],
    ["hitpoints", "Hitpoints", "20,600 xp/hr"],
    ["defence", "Defence", "12,100 xp/hr"],
  ];
  return (
    <Panel tab="stats">
      <PanelTitle>XP Tracker</PanelTitle>
      <ScrollArea className="osrs-outline min-h-0 flex-1">
        <List>
          {rows.map(([s, name, rate]) => {
            const Icon = skillIcons[s];
            return (
              <ListItem
                key={name}
                style={{
                  minHeight: px(34),
                  gap: px(4),
                  padding: `${px(2)} ${px(3)}`,
                }}
              >
                <ListItemMedia style={{ width: px(26) }}>
                  <Icon />
                </ListItemMedia>
                <ListItemContent>
                  <ListItemTitle>{name}</ListItemTitle>
                  <ListItemDescription>{rate}</ListItemDescription>
                </ListItemContent>
              </ListItem>
            );
          })}
        </List>
      </ScrollArea>
      <Stat variant="inline" label="Session" value="1:42:10" className="justify-center" />
    </Panel>
  );
}

/** 31. A friends-style list: names white, status coloured, stone buttons. */
function ClanRoster() {
  const members: [string, React.ReactNode][] = [
    ["Zezima", <Green>World 420</Green>],
    ["Lynx Titan", <Yellow>World 302</Yellow>],
    ["Settled", <Yellow>World 330</Yellow>],
    ["Woox", <Red>Offline</Red>],
    ["B0aty", <Red>Offline</Red>],
    ["Faux", <Red>Offline</Red>],
  ];
  return (
    <Panel tab="clan">
      <PanelTitle>Clan - Iron Wolves</PanelTitle>
      <ScrollArea className="osrs-outline min-h-0 flex-1">
        <List>
          {members.map(([n, w]) => (
            <ListItem key={n} className="justify-between" style={{ minHeight: px(16) }}>
              <White>{n}</White>
              {w}
            </ListItem>
          ))}
        </List>
      </ScrollArea>
      <Row gap={4}>
        <Button variant="stone" className="flex-1">
          Settings
        </Button>
        <Button variant="stone" className="flex-1">
          Leave
        </Button>
      </Row>
    </Panel>
  );
}

/** 32. Slayer task: the assignment, progress and status marks. */
function SlayerTask() {
  return (
    <Panel>
      <PanelTitle>Slayer Task</PanelTitle>
      <FieldSet>
        <FieldLegend>Abyssal demons</FieldLegend>
        <Col gap={2}>
          <Progress value={62} color="orange" />
          <p className="m-0 text-center">
            <White>118</White> of 190 left
          </p>
        </Col>
      </FieldSet>
      <DescriptionList striped>
        <DescriptionItem label="Master">Duradel</DescriptionItem>
        <DescriptionItem label="Streak">412</DescriptionItem>
        <DescriptionItem label="Points">1,240</DescriptionItem>
      </DescriptionList>
      <Col gap={2}>
        <Row gap={6} className="items-center">
          <StatusIcon status="done" />
          <span>Slayer helmet worn</span>
        </Row>
        <Row gap={6} className="items-center">
          <StatusIcon status="failed" />
          <span>Superior unlocked</span>
        </Row>
      </Col>
    </Panel>
  );
}

/** 33. Make-X in the chatbox: each product a card you click, quantity tiles on the right. */
function MakeX() {
  const products: ItemId[] = ["gold-bar", "bronze-bar", "uncut-diamond"];
  return (
    <Chatbox className="flex flex-col items-center justify-center" style={{ gap: px(6) }}>
      <p className="osrs-text m-0" style={{ color: "#000" }}>
        What would you like to make?
      </p>
      <Row gap={8} className="items-center">
        {products.map((id, i) => {
          const { Icon, name } = items[id];
          return (
            <button
              key={id}
              type="button"
              className={cardVariants({
                variant: "flat",
                className: "cursor-pointer items-center justify-center text-center",
              })}
              data-selected={i === 0 || undefined}
              style={{ width: px(84), height: px(74), gap: px(2) }}
            >
              <Icon />
              <span style={{ lineHeight: px(13) }}>{name}</span>
            </button>
          );
        })}
        <ToggleGroup defaultValue={["All"]} className="ml-4">
          {["1", "5", "10", "X", "All"].map((v) => (
            <ToggleGroupItem key={v} value={v} size="icon-sm">
              {v}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Row>
    </Chatbox>
  );
}

/** 34. The option dialogue, for a choice with consequences. */
function ChooseOption() {
  return <OptionDialogue title="Where would you like to sail?" options={["Port Sarim", "Catherby", "Brimhaven", "Stay here"]} />;
}

/** 35. A typed-amount prompt in the chatbox. */
function EnterAmount() {
  return (
    <Chatbox className="flex flex-col items-center justify-center" style={{ gap: px(6) }}>
      <p className="osrs-text m-0" style={{ color: "#000" }}>
        Enter amount:
      </p>
      <p className="osrs-text m-0" style={{ color: "#0000ff" }}>
        2500*
      </p>
    </Chatbox>
  );
}

/** 36. NPC dialogue, as in quests. */
function NpcLine() {
  return (
    <NpcDialogue
      name="Captain Tobias"
      head={
        // stands in for a chathead, which is drawn about twice an item's size
        <span style={{ "--osrs-px": "calc(2 * var(--osrs-px))" } as React.CSSProperties}>
          <Item id="ring-of-dueling-8" />
        </span>
      }
    >
      The seas north of Catherby are rough this time of year. Mind you take a spare plank or two.
    </NpcDialogue>
  );
}

export const panels: GalleryExample[] = [
  {
    id: "barbarian-assault",
    title: "Barbarian Assault tab",
    archetype: "panel",
    brief: "Side-panel tab: bold title, striped key/values, segmented role bar in a group box, stone action at the bottom.",
    Component: BarbarianAssault,
  },
  {
    id: "group-finder",
    title: "Group finder",
    archetype: "panel",
    brief: "Side-panel tab: dropdown filter, two-line list rows, a pair of stone buttons.",
    Component: GroupFinder,
  },
  {
    id: "xp-tracker",
    title: "XP tracker",
    archetype: "panel",
    brief: "Side-panel tab: compact skill rich rows with rates, inline session stat.",
    Component: XpTracker,
  },
  {
    id: "clan-roster",
    title: "Clan roster",
    archetype: "panel",
    brief: "Friends-list style: white names, status coloured by state, stone buttons.",
    Component: ClanRoster,
  },
  {
    id: "slayer-task",
    title: "Slayer task",
    archetype: "panel",
    brief: "Side-panel tab: progress group box, key/values, check / cross status rows.",
    Component: SlayerTask,
  },
  {
    id: "make-x",
    title: "Make-X",
    archetype: "chatbox",
    brief: "Chatbox prompt: each product a flat card (icon over name, first selected), quantity tiles beside them.",
    Component: MakeX,
  },
  {
    id: "choose-option",
    title: "Choose an option",
    archetype: "chatbox",
    brief: "The option dialogue with a custom question and numbered options.",
    Component: ChooseOption,
  },
  {
    id: "enter-amount",
    title: "Enter amount",
    archetype: "chatbox",
    brief: "Typed-amount prompt: black prompt, blue input with the caret star; no text shadow on parchment.",
    Component: EnterAmount,
  },
  {
    id: "npc-dialogue",
    title: "NPC dialogue",
    archetype: "chatbox",
    brief: "Quest-style NPC dialogue with a chathead-sized head and continue link.",
    Component: NpcLine,
  },
];
