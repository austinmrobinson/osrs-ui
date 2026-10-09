"use client";

import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { ItemSlot } from "@/registry/osrs/ui/item-slot";
import { List, ListItem } from "@/registry/osrs/ui/list";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";
import { Window, WindowClose, WindowHeader } from "@/registry/osrs/ui/window";
import { items, type ItemId } from "../data/items";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;

const ENTRIES = [
  ["Barbarian Assault", true], ["Barracuda Trials", true], ["Brimhaven Agility Arena", true], ["Castle Wars", false],
  ["Fishing Trawler", true], ["Giants' Foundry", true], ["Gnome Restaurant", true], ["Guardians of the Rift", true],
  ["Hallowed Sepulchre", true], ["Last Man Standing", false], ["Magic Training Arena", false], ["Mahogany Homes", true],
  ["Pest Control", true], ["Rogues' Den", true], ["Shades of Mort'ton", true], ["Soul Wars", false], ["Tempoross", true],
] as const;

const LOG: [ItemId, number | undefined][] = [
  ["fire-cape", 2], ["dragon-defender", undefined], ["barrows-gloves", undefined], ["abyssal-whip", undefined],
  ["dragon-boots", undefined], ["fighter-torso", undefined], ["amulet-of-glory-6", 80], ["berserker-ring-i", 2],
  ["clue-scroll-elite", undefined],
];

export default function CollectionLogRecipe() {
  const [selected, setSelected] = React.useState("Barbarian Assault");
  return (
    <div className="osrs flex justify-center p-6">
      <Window style={{ width: px(500), height: px(314) }}>
        <WindowHeader start={<Button variant="metal" size="sm">☰</Button>} end={<WindowClose />}>
          Collection Log - 1210/1717
        </WindowHeader>
        <Tabs defaultValue="minigames">
          <TabsList>
            {["Bosses", "Raids", "Clues", "Minigames", "Other"].map((t) => (
              <TabsTrigger key={t} value={t.toLowerCase()}>
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex min-h-0 flex-1" style={{ gap: px(4) }}>
          <ScrollArea style={{ width: px(196) }}>
            <List>
              {ENTRIES.map(([name, done]) => (
                <ListItem
                  key={name}
                  selected={name === selected}
                  onClick={() => setSelected(name)}
                  style={{ color: done ? "var(--osrs-green)" : "var(--osrs-orange)" }}
                >
                  {name}
                </ListItem>
              ))}
            </List>
          </ScrollArea>
          <div className="flex min-w-0 flex-1 flex-col">
            <div style={{ padding: `${px(2)} ${px(4)}`, background: "rgb(0 0 0 / 0.1)" }}>
              <div className="osrs-text-bold">{selected}</div>
              <div className="osrs-text-small">
                Obtained: <span style={{ color: "var(--osrs-green)" }}>11/11</span>
              </div>
              <div className="osrs-text-small">
                High-level Gambles: <span style={{ color: "var(--osrs-white)" }}>2,781</span>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-6" style={{ gap: px(4), padding: px(4) }}>
                {LOG.map(([id, q]) => {
                  const { Icon, name } = items[id];
                  return (
                    <ItemSlot key={id} quantity={q} title={name}>
                      <Icon />
                    </ItemSlot>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </Window>
    </div>
  );
}
