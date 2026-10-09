"use client";

import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { ItemSlot } from "@/registry/osrs/ui/item-slot";
import { List, ListItem } from "@/registry/osrs/ui/list";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";
import { Window, WindowClose, WindowHeader, WindowMenu, WindowSeparator } from "@/registry/osrs/ui/window";
import { geSprites } from "@/registry/osrs/ui/ge-sprites";
import { glyphSprites } from "@/registry/osrs/ui/glyph-sprites";
import { items, type ItemId } from "@/site/demo-data/items";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;

const ENTRIES: [string, boolean][] = [
  ["Abyssal Sire", false], ["Alchemical Hydra", false], ["Amoxliatl", false], ["Araxxor", false],
  ["Barrows Chests", false], ["Brutus", false], ["Bryophyta", false], ["Callisto and Artio", false],
  ["Cerberus", true], ["Chaos Elemental", false], ["Chaos Fanatic", false], ["Commander Zilyana", false],
  ["Corporeal Beast", false], ["Crazy Archaeologist", false], ["Dagannoth Kings", false],
  ["Deranged Archaeologist", false], ["Doom of Mokhaiotl", false], ["Duke Sucellus", false],
];

const LOG: { id: ItemId; q?: number; obtained: boolean }[] = [
  { id: "dragon-boots", obtained: false },
  { id: "rune-pickaxe", obtained: false },
  { id: "dragon-axe", q: 1, obtained: true },
  { id: "abyssal-whip", obtained: false },
  { id: "dragon-defender", obtained: false },
  { id: "toxic-blowpipe", obtained: false },
];

export default function CollectionLogRecipe() {
  const [selected, setSelected] = React.useState("Callisto and Artio");
  const [view, setView] = React.useState("log");
  return (
    <div className="osrs flex items-start justify-start p-6">
      <Window draggable resizable style={{ width: px(500), height: px(314) }} minWidth={360} minHeight={220}>
        <WindowHeader
          start={
            <>
              <WindowMenu
                items={[
                  { value: "log", label: "Collection Log" },
                  { value: "recent", label: "Recent drops" },
                  { value: "search", label: "Search" },
                ]}
                value={view}
                onValueChange={setView}
              />
              <Button variant="metal" size="sm" style={{ gap: px(4) }}>
                <geSprites.search />
                Search
              </Button>
            </>
          }
          end={<WindowClose />}
        >
          Collection Log - 321/1717
        </WindowHeader>
        <div className="flex min-h-0 flex-1 flex-col" style={{ padding: `${px(4)} ${px(4)} 0` }}>
          <Tabs defaultValue="bosses">
            <TabsList>
              {["Bosses", "Raids", "Clues", "Minigames", "Other"].map((t) => (
                <TabsTrigger key={t} value={t.toLowerCase()} size="medium">
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex min-h-0 flex-1">
            <ScrollArea style={{ width: px(190) }}>
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
              <div className="flex items-start justify-between" style={{ padding: `${px(3)} ${px(6)}` }}>
                <div className="flex flex-col">
                  <span className="osrs-text-bold">{selected}</span>
                  <span>
                    Obtained: <span style={{ color: "var(--osrs-yellow)" }}>1/6</span>
                  </span>
                  <span>
                    Callisto kills: <span style={{ color: "var(--osrs-white)" }}>250</span>
                  </span>
                  <span>
                    Artio kills: <span style={{ color: "var(--osrs-white)" }}>4</span>
                  </span>
                </div>
                <Button variant="metal" size="icon" aria-label="Open boss log" style={{ width: px(44), height: px(22) }}>
                  <glyphSprites.combatAchievementsCollectionsLogged />
                </Button>
              </div>
              <WindowSeparator style={{ height: px(2), background: "#1f1a14" }} />
              <ScrollArea className="flex-1">
                <div className="grid grid-cols-6" style={{ gap: px(4), padding: px(6) }}>
                  {LOG.map(({ id, q, obtained }) => {
                    const { Icon, name } = items[id];
                    return (
                      <ItemSlot key={id} quantity={q} title={name} style={{ opacity: obtained ? 1 : 0.35 }}>
                        <Icon />
                      </ItemSlot>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </Window>
    </div>
  );
}
