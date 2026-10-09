"use client";

import * as React from "react";

import { List, ListItem } from "@/registry/osrs/ui/list";

export default function ListDemo() {
  const [sel, setSel] = React.useState("Abyssal Sire");
  return (
    <div className="osrs osrs-texture-stone w-[calc(200*var(--osrs-px))] p-6">
      <List>
        {["Abyssal Sire", "Alchemical Hydra", "Araxxor", "Barrows Chests", "Bryophyta"].map((b, i) => (
          <ListItem key={b} selected={b === sel} onClick={() => setSel(b)} style={{ color: i < 3 ? "var(--osrs-green)" : "var(--osrs-orange)" }}>
            {b}
          </ListItem>
        ))}
      </List>
    </div>
  );
}
