"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";
import { px } from "@/lib/osrs";
import { panelSprites } from "@/components/ui/panel-sprites";
import { tabSprites, type TabSpriteName } from "@/components/ui/tab-sprites";

/** x offset of each of the 7 stones in a 241px tab row */
const STONE_X = [5, 38, 71, 104, 137, 170, 203];

type SidePanelTab = { value: string; icon: TabSpriteName; label: string };

/** The resizable-mode side panel: two rows of tab stones around the stone content area. */
function SidePanel({
  top,
  bottom = [],
  children,
  className,
  style,
  ...props
}: TabsPrimitive.Root.Props & { top: SidePanelTab[]; bottom?: SidePanelTab[] }) {
  const row = (tabs: SidePanelTab[], y: number, Row: typeof panelSprites.tabsTopRow) => (
    <div className="absolute left-0" style={{ top: px(y), width: px(241), height: px(37) }}>
      <Row className="absolute inset-0" />
      {tabs.slice(0, 7).map((t, i) => {
        const Icon = tabSprites[t.icon];
        return (
          <TabsPrimitive.Tab
            key={t.value}
            value={t.value}
            aria-label={t.label}
            title={t.label}
            className="group absolute cursor-pointer border-0 bg-transparent p-0 outline-none"
            style={{ left: px(STONE_X[i]), top: px(0), width: px(33), height: px(36) }}
          >
            <tabSprites.tabStoneMiddleSelected className="absolute inset-0 opacity-0 group-data-[active]:opacity-100" />
            <Icon className="absolute inset-0" />
          </TabsPrimitive.Tab>
        );
      })}
    </div>
  );
  return (
    <TabsPrimitive.Root
      data-slot="side-panel"
      className={cn("relative", className)}
      style={{ width: px(241), height: px(37 + 261 + 37), ...style }}
      {...props}
    >
      <TabsPrimitive.List render={<div />} className="contents">
        {row(top, 0, panelSprites.tabsTopRow)}
        {row(bottom, 37 + 261, panelSprites.tabsBottomRow)}
      </TabsPrimitive.List>
      <div
        className="osrs-texture-side-panel absolute"
        style={{ left: px(26), top: px(37), width: px(190), height: px(261) }}
      >
        <div className="absolute flex justify-center" style={{ inset: px(0), paddingTop: px(6) }}>
          {children}
        </div>
      </div>
      <panelSprites.sidePanelEdgeLeft className="pointer-events-none absolute left-0" style={{ top: px(37) }} />
      <panelSprites.sidePanelEdgeRight className="pointer-events-none absolute" style={{ top: px(37), left: px(215) }} />
    </TabsPrimitive.Root>
  );
}

function SidePanelContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel data-slot="side-panel-content" className={cn("outline-none", className)} {...props} />;
}

export { SidePanel, SidePanelContent };
export type { SidePanelTab };
