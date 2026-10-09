"use client";

import * as React from "react";

import { List, ListItem } from "@/registry/osrs/ui/list";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { Window, WindowClose, WindowHeader } from "@/registry/osrs/ui/window";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;

const WORLDS: [number, boolean, string, number, string][] = [
  [301, false, "US", 885, "Trade - Free"], [302, true, "UK", 1156, "Trade - Members"], [303, true, "DE", 648, "-"],
  [304, true, "DE", 536, "Trouble Brewing"], [305, true, "US", 991, "Falador Party Room"], [306, true, "US", 968, "Barbarian Assault"],
  [307, true, "US", 1152, "Wintertodt"], [308, false, "UK", 589, "Wilderness PK"], [309, true, "UK", 690, "Wintertodt"],
  [310, true, "UK", 338, "Barbarian Assault"], [311, true, "DE", 488, "Wintertodt"], [312, true, "DE", 418, "-"],
  [339, true, "US", 573, "-"], [415, true, "US", 351, "2200 skill total"],
];

export default function WorldSwitcherRecipe() {
  const [current, setCurrent] = React.useState(339);
  return (
    <div className="osrs flex justify-center p-6">
      <Window style={{ width: px(204), height: px(275) }}>
        <WindowHeader end={<WindowClose />}>Current world - {current}</WindowHeader>
        <ScrollArea className="flex-1">
          <List className="osrs-text-small">
            {WORLDS.map(([w, members, region, players, activity]) => (
              <ListItem key={w} selected={w === current} tone="green" onClick={() => setCurrent(w)}>
                <span style={{ color: members ? "var(--osrs-yellow)" : "#c0c0c0", width: px(10) }}>★</span>
                <span style={{ color: "var(--osrs-yellow)", width: px(22) }}>{w}</span>
                <span style={{ color: "var(--osrs-white)", width: px(16) }}>{region}</span>
                <span style={{ color: "var(--osrs-white)", width: px(24), textAlign: "right" }}>{players}</span>
                <span className="truncate" style={{ color: "var(--osrs-orange)", flex: 1 }}>{activity}</span>
              </ListItem>
            ))}
          </List>
        </ScrollArea>
      </Window>
    </div>
  );
}
