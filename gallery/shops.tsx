// Gallery: stores, trading and storage windows.
import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { Card } from "@/registry/osrs/ui/card";
import { FieldLegend, FieldSet } from "@/registry/osrs/ui/field";
import { Inventory } from "@/registry/osrs/ui/item-slot";
import { List, ListItem, ListItemContent, ListItemDescription, ListItemMedia, ListItemTitle } from "@/registry/osrs/ui/list";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/osrs/ui/select";
import { Stat } from "@/registry/osrs/ui/stat";
import { ToggleGroup, ToggleGroupItem } from "@/registry/osrs/ui/toggle-group";
import { bankSprites } from "@/registry/osrs/ui/bank-sprites";
import { Item } from "@/site/demo-data/game";
import { items, type ItemId } from "@/site/demo-data/items";
import { Col, Instruction, px, Row, White, Win, type GalleryExample } from "./shared";

const Qty = ({ values = ["1", "5", "10", "50"] }: { values?: string[] }) => (
  <ToggleGroup defaultValue={[values[0]]}>
    {values.map((v) => (
      <ToggleGroupItem key={v} value={v} size="icon">
        {v}
      </ToggleGroupItem>
    ))}
  </ToggleGroup>
);

function StockCard({ id, label, selected, disabled }: { id: ItemId; label?: string; selected?: boolean; disabled?: boolean }) {
  const { Icon, name } = items[id];
  return (
    <Card selected={selected} disabled={disabled} className="items-center justify-center text-center" style={{ height: px(62), gap: px(2) }}>
      <Icon />
      <span style={{ lineHeight: px(13) }}>{label ?? name}</span>
    </Card>
  );
}

/** 1. The standard store: filter, stock grid, info panel, points and buy quantities. */
function SlayerRewards() {
  const stock: ItemId[] = ["abyssal-whip", "dragon-defender", "fire-cape", "amulet-of-glory-6", "barrows-gloves", "dragon-boots", "berserker-ring-i", "dragon-scimitar", "rune-platebody"];
  return (
    <Win title="Slayer Rewards">
      <Row className="min-h-0 flex-1">
        <Col className="min-w-0 flex-[3]">
          <Select defaultValue="all" items={{ all: "Show all", weapons: "Weapons", armour: "Armour" }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Show all</SelectItem>
              <SelectItem value="weapons">Weapons</SelectItem>
              <SelectItem value="armour">Armour</SelectItem>
            </SelectContent>
          </Select>
          <ScrollArea className="min-h-0 flex-1">
            <div className="grid grid-cols-3" style={{ gap: px(3), paddingRight: px(4) }}>
              {stock.map((id, i) => (
                <StockCard key={id} id={id} selected={i === 1} />
              ))}
            </div>
          </ScrollArea>
        </Col>
        <Col className="min-w-0 flex-[2]">
          <FieldSet className="flex-1">
            <FieldLegend>Dragon defender</FieldLegend>
            <p className="m-0" style={{ lineHeight: px(14) }}>
              The strongest defender. Requires 60 Attack and 60 Defence to wield.
            </p>
          </FieldSet>
          <Stat label="Slayer Points" value="1,240" />
          <Col gap={2} className="items-center">
            <span>Buy</span>
            <Qty />
          </Col>
        </Col>
      </Row>
    </Win>
  );
}

/** 2. A points shop: a grid of reward cards (icon, name, cost), points and Confirm in the footer. */
function TrawlerRewards() {
  const rows: [ItemId, string, number][] = [
    ["raw-shark", "Raw shark", 20],
    ["raw-lobster", "Raw lobster", 8],
    ["anglerfish", "Anglerfish", 35],
    ["shark", "Shark", 24],
    ["cooked-karambwan", "Karambwan", 18],
    ["lobster", "Lobster", 9],
  ];
  return (
    <Win title="Fishing Trawler Rewards">
      <Instruction>Choose your catch of the day.</Instruction>
      <div className="grid min-h-0 flex-1 grid-cols-3 content-start" style={{ gap: px(3) }}>
        {rows.map(([id, name, cost], i) => {
          const { Icon } = items[id];
          return (
            <Card key={id} selected={i === 2} className="items-center justify-center text-center" style={{ height: px(76), gap: px(2) }}>
              <Icon />
              <span style={{ lineHeight: px(13) }}>{name}</span>
              <White>{cost} pts</White>
            </Card>
          );
        })}
      </div>
      <Row className="items-center justify-between">
        <Stat variant="inline" label="Trawler points" value="142" />
        <Button style={{ width: px(180) }}>Confirm</Button>
      </Row>
    </Win>
  );
}

/** 3. A storage container: slots, capacity, empty and fill actions. */
function HerbSack() {
  const herbs: [ItemId, number][] = [
    ["grimy-ranarr-weed", 12],
    ["grimy-snapdragon", 30],
    ["grimy-torstol", 8],
    ["grimy-toadflax", 22],
    ["grimy-avantoe", 4],
  ];
  return (
    <Win title="Herb Sack" width={352} height={260}>
      <Instruction>Grimy herbs are stored here until you empty the sack.</Instruction>
      <FieldSet className="flex-1">
        <FieldLegend>Contents</FieldLegend>
        <Row gap={4} className="flex-wrap justify-center">
          {herbs.map(([id, q]) => (
            <Item key={id} id={id} quantity={q} />
          ))}
        </Row>
      </FieldSet>
      <Row className="items-center justify-between">
        <Stat variant="inline" label="Herbs" value="76 / 420" />
        <Row gap={4}>
          <Button variant="tile" size="icon" aria-label="Fill" tooltip="Fill">
            <bankSprites.depositInventory />
          </Button>
          <Button variant="tile" size="icon" aria-label="Empty" tooltip="Empty">
            <bankSprites.sendToInventory />
          </Button>
        </Row>
      </Row>
    </Win>
  );
}

/** 4. Trade: two offers side by side, values, and the accept / decline pair. */
function TradeOffer() {
  const mine: [ItemId, number][] = [
    ["dragon-bones", 100],
    ["coins-10000", 250000],
  ];
  const theirs: [ItemId, number][] = [["twisted-bow", 1]];
  const Side = ({ title, list, value }: { title: string; list: [ItemId, number][]; value: string }) => (
    <Col className="min-w-0 flex-1">
      <FieldSet className="flex-1">
        <FieldLegend>{title}</FieldLegend>
        <Row gap={4} className="flex-wrap">
          {list.map(([id, q]) => (
            <Item key={id} id={id} quantity={q} />
          ))}
        </Row>
      </FieldSet>
      <Stat variant="inline" label="Value" value={value} className="justify-center" />
    </Col>
  );
  return (
    <Win title="Trading with: Zezima">
      <Instruction>
        Zezima has <White>1</White> free inventory slot.
      </Instruction>
      <Row className="min-h-0 flex-1">
        <Side title="Your offer" list={mine} value="510,450 coins" />
        <Side title="Zezima's offer" list={theirs} value="1,402,600,000 coins" />
      </Row>
      <Row className="justify-center">
        <Button tone="positive" style={{ width: px(130) }}>
          Accept
        </Button>
        <Button tone="destructive" style={{ width: px(130) }}>
          Decline
        </Button>
      </Row>
    </Win>
  );
}

/** 5. A destination list with costs, a selected row, coins and Confirm. */
function SailingCharter() {
  const ports = [
    ["Port Sarim", "1,600"],
    ["Catherby", "480"],
    ["Brimhaven", "960"],
    ["Port Khazard", "1,280"],
    ["Mos Le'Harmless", "2,250"],
    ["Corsair Cove", "1,600"],
  ];
  return (
    <Win title="Charter Ship">
      <Instruction>Select a destination. Fares halve with the Ring of charos.</Instruction>
      <ScrollArea className="osrs-outline min-h-0 flex-1">
        <List>
          {ports.map(([port, fare], i) => (
            <ListItem key={port} selected={i === 1} className="justify-between" style={{ minHeight: px(20) }}>
              <span>
                {String.fromCharCode(65 + i)}: {port}
              </span>
              <White>{fare} coins</White>
            </ListItem>
          ))}
        </List>
      </ScrollArea>
      <Row className="items-center justify-between">
        <Stat variant="inline" label="Coins" value="12,500" />
        <Button style={{ width: px(150) }}>Set sail</Button>
      </Row>
    </Win>
  );
}

/** 6. Deposit box: the inventory laid out wide (7 x 4) top-left, quantity and deposit tiles in one row below. */
function DepositBox() {
  const inv: [ItemId, number?][] = [["rune-pickaxe"], ["iron-ore"], ["iron-ore"], ["coal", 26], ["gold-bar", 4], ["uncut-diamond"], ["tinderbox"], ["knife"]];
  return (
    <Win title="Deposit Box" width={300} height={216}>
      <Col gap={6} className="min-h-0 flex-1" style={{ padding: px(4) }}>
        <Inventory className="grid-cols-7" style={{ width: "auto", columnGap: px(4) }}>
          {Array.from({ length: 28 }, (_, i) => {
            const it = inv[i];
            return it ? <Item key={i} id={it[0]} quantity={it[1]} /> : null;
          })}
        </Inventory>
        <Row className="mt-auto items-center justify-between">
          <ToggleGroup defaultValue={["1"]} style={{ gap: px(2) }}>
            {["1", "5", "10", "X", "All"].map((v) => (
              <ToggleGroupItem key={v} value={v} size="icon-sm">
                {v}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Row gap={2}>
            <Button variant="tile" size="icon-sm" aria-label="Deposit inventory" tooltip="Deposit inventory">
              <bankSprites.depositInventory />
            </Button>
            <Button variant="tile" size="icon-sm" aria-label="Deposit worn items" tooltip="Deposit worn items">
              <bankSprites.depositEquipment />
            </Button>
          </Row>
        </Row>
      </Col>
    </Win>
  );
}

/** 7. Gravestone: items at risk, the fee, and the retrieve choices. */
function Gravestone() {
  const kept: ItemId[] = ["abyssal-whip", "dragon-defender", "fire-cape", "barrows-gloves"];
  const lost: [ItemId, number][] = [
    ["shark", 12],
    ["prayer-potion-4", 3],
    ["super-combat-potion-4", 1],
  ];
  return (
    <Win title="Grave" width={420} height={280}>
      <Instruction>Your items are held here for 15 minutes.</Instruction>
      <Row className="min-h-0 flex-1">
        <FieldSet className="flex-1">
          <FieldLegend>Retrievable</FieldLegend>
          <Row gap={4} className="flex-wrap">
            {kept.map((id) => (
              <Item key={id} id={id} />
            ))}
          </Row>
        </FieldSet>
        <FieldSet className="flex-1">
          <FieldLegend>Lost on death</FieldLegend>
          <Row gap={4} className="flex-wrap">
            {lost.map(([id, q]) => (
              <Item key={id} id={id} quantity={q} />
            ))}
          </Row>
        </FieldSet>
      </Row>
      <Row className="items-center justify-between">
        <Stat label="Fee" value="74,200 coins" />
        <Button style={{ width: px(160) }}>Retrieve all</Button>
      </Row>
    </Win>
  );
}

/** 8. Rich rows: Skill Guide style list of unlocks with requirements. */
function CraftingUnlocks() {
  const rows: [ItemId, string, string][] = [
    ["gold-bar", "Gold ring", "Level 5 Crafting"],
    ["uncut-diamond", "Diamond amulet", "Level 70 Crafting"],
    ["amulet-of-glory-6", "Amulet of glory", "Level 80 Crafting"],
    ["fire-cape", "Fire cape (display)", "TzHaar Fight Cave"],
  ];
  return (
    <Win title="Crafting - Jewellery" frame="rivets">
      <ScrollArea className="osrs-outline min-h-0 flex-1">
        <List>
          {rows.map(([id, name, req]) => {
            const { Icon } = items[id];
            return (
              <ListItem key={name}>
                <ListItemMedia>
                  <Icon />
                </ListItemMedia>
                <ListItemContent>
                  <ListItemTitle>{name}</ListItemTitle>
                  <ListItemDescription label="Requires">{req}</ListItemDescription>
                </ListItemContent>
              </ListItem>
            );
          })}
        </List>
      </ScrollArea>
    </Win>
  );
}

export const shops: GalleryExample[] = [
  {
    id: "slayer-rewards",
    title: "Slayer Rewards",
    archetype: "window",
    brief: "Classic store: filter dropdown, stock card grid (one selected), item info group box, boxed points, buy quantity toggles.",
    Component: SlayerRewards,
  },
  {
    id: "trawler-rewards",
    title: "Fishing Trawler Rewards",
    archetype: "window",
    brief: "Points shop as a grid of reward cards (one selected) with costs; inline points stat and a wide Confirm.",
    Component: TrawlerRewards,
  },
  {
    id: "herb-sack",
    title: "Herb Sack",
    archetype: "window",
    brief: "Small storage window: instruction line, contents group box with quantities, capacity stat, Fill / Empty icon tiles.",
    Component: HerbSack,
  },
  {
    id: "trade-offer",
    title: "Trade offer",
    archetype: "window",
    brief: "Two group boxes side by side (your offer / theirs) with value stats and a green Accept / red Decline pair.",
    Component: TradeOffer,
  },
  {
    id: "sailing-charter",
    title: "Charter ship",
    archetype: "window",
    brief: "Striped list with hotkey letters and fares, a selected row, coins stat and the primary action.",
    Component: SailingCharter,
  },
  {
    id: "deposit-box",
    title: "Deposit box",
    archetype: "window",
    brief: "Compact window: the inventory laid out 7 x 4, quantity toggles and deposit icon tiles in one row below.",
    Component: DepositBox,
  },
  { id: "gravestone", title: "Gravestone", archetype: "window", brief: "Two titled groups (kept / lost), a boxed fee and Retrieve all.", Component: Gravestone },
  { id: "crafting-unlocks", title: "Crafting unlocks", archetype: "window", brief: "Rivet window with Skill Guide rich rows: item icon, title, 'Requires:' detail.", Component: CraftingUnlocks },
];
