"use client";

// The hamburger view menu of the Bank, Collection Log and Combat Achievements.
import * as React from "react";

import { buttonSprites } from "@/registry/osrs/ui/button-sprites";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/registry/osrs/ui/dropdown-menu";

export default function DropdownMenuDemo() {
  const [view, setView] = React.useState("overview");
  return (
    <div className="osrs osrs-texture-stone osrs-text flex items-center gap-4 p-6" style={{ minHeight: "calc(150 * var(--osrs-px))", alignItems: "flex-start" }}>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Menu" className="group">
          <buttonSprites.menu className="group-hover:hidden group-data-[popup-open]:hidden" />
          <buttonSprites.menuSelected className="hidden group-hover:block group-data-[popup-open]:block" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={view} onValueChange={(v) => setView(String(v))}>
            <DropdownMenuRadioItem value="overview">Overview</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="tasks">Tasks</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bosses">Bosses</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="rewards">Rewards</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <span>
        Combat Achievements - <span style={{ color: "var(--osrs-white)" }}>{view[0].toUpperCase() + view.slice(1)}</span>
      </span>
    </div>
  );
}
