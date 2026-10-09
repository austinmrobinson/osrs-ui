"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";
import { px } from "@/lib/osrs";
import { MovableContext, useMovable, type MovableOptions } from "@/lib/movable";
import { SlicedSprite } from "@/lib/sprite";
import { panelSprites } from "@/components/ui/panel-sprites";
import { tabSprites, type TabSpriteName } from "@/components/ui/tab-sprites";
import { WindowResizeHandle } from "@/components/ui/window";

type SidePanelTab = { value: string; icon: TabSpriteName; label: string };

const ROW_H = 37;
const STONE = 33;
const CAP = 38; // curved end stone at each end of a tab row
const PILLAR_W = 26;
const PILLAR_CAP = 8;

/** Snap a width so the tab row is a whole number of stones. */
const snapWidth = (w: number) => CAP * 2 + Math.max(1, Math.round((w - CAP * 2) / STONE)) * STONE;

/** Size of one game pixel in CSS px. */
function unitOf(el: HTMLElement) {
  const probe = document.createElement("div");
  probe.style.width = "var(--osrs-px)";
  el.appendChild(probe);
  const u = probe.getBoundingClientRect().width || 1;
  probe.remove();
  return u;
}

/**
 * The resizable-mode side panel: rows of tab stones around the stone content area,
 * between two stone pillars. Defaults to the game's 241×335; `width` / `height` (game px)
 * make it any size: pillars and tab rows stretch without distortion.
 */
function SidePanel({
  top,
  bottom = [],
  width = 241,
  height = ROW_H * 2 + 261,
  children,
  className,
  style,
  draggable,
  resizable,
  defaultPosition,
  defaultSize,
  minWidth = 241,
  minHeight = 200,
  onPositionChange,
  onSizeChange,
  ...props
}: TabsPrimitive.Root.Props &
  MovableOptions & {
    top: SidePanelTab[];
    bottom?: SidePanelTab[];
    /** Width in game pixels (snapped to whole tab stones). */
    width?: number;
    /** Height in game pixels. */
    height?: number;
  }) {
  const m = useMovable({ draggable, resizable, defaultPosition, defaultSize, minWidth, minHeight, onPositionChange, onSizeChange });
  const [dims, setDims] = React.useState({ w: snapWidth(width), h: Math.round(height) });

  // When resized by the user, follow the element's size (converted to game pixels).
  React.useEffect(() => {
    const el = m.ref.current;
    if (!el || !resizable) return;
    const ro = new ResizeObserver(() => {
      const u = unitOf(el);
      const r = el.getBoundingClientRect();
      setDims({ w: snapWidth(r.width / u), h: Math.round(r.height / u) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [m.ref, resizable]);

  const { w, h } = dims;
  const slots = 2 + (w - CAP * 2) / STONE;
  const contentH = h - ROW_H * 2;

  const row = (tabs: SidePanelTab[], y: number, sprite: typeof panelSprites.tabsTopRow) => (
    <div className="absolute left-0" style={{ top: px(y), width: px(w), height: px(ROW_H) }}>
      <SlicedSprite sprite={sprite} axis="x" length={w} start={CAP} end={CAP} className="absolute inset-0" />
      {tabs.slice(0, slots).map((t, i) => {
        const Icon = tabSprites[t.icon];
        return (
          <TabsPrimitive.Tab
            key={t.value}
            value={t.value}
            aria-label={t.label}
            title={t.label}
            className="group absolute cursor-pointer border-0 bg-transparent p-0 outline-none"
            style={{ left: px(5 + i * STONE), top: px(0), width: px(STONE), height: px(36) }}
          >
            <tabSprites.tabStoneMiddleSelected className="absolute inset-0 opacity-0 group-data-[active]:opacity-100" />
            <Icon className="absolute inset-0" />
          </TabsPrimitive.Tab>
        );
      })}
    </div>
  );

  return (
    <MovableContext.Provider value={{ draggable: m.draggable, onDragStart: m.onDragStart }}>
      <TabsPrimitive.Root
        ref={m.ref}
        data-slot="side-panel"
        {...m.dataAttrs}
        className={cn("relative", className)}
        style={{ width: px(w), height: px(h), ...style, ...m.style }}
        {...props}
      >
        <TabsPrimitive.List render={<div />} className="contents">
          <div className={cn(m.draggable && "cursor-move")} onPointerDown={m.onDragStart}>
            {row(top, 0, panelSprites.tabsTopRow)}
          </div>
          {row(bottom, ROW_H + contentH, panelSprites.tabsBottomRow)}
        </TabsPrimitive.List>
        <div
          className="osrs-texture-side-panel absolute"
          style={{ left: px(PILLAR_W), top: px(ROW_H), width: px(w - PILLAR_W * 2 + 1), height: px(contentH) }}
        >
          <div className="absolute flex justify-center overflow-hidden" style={{ inset: px(0), paddingTop: px(6) }}>
            {children}
          </div>
        </div>
        <SlicedSprite
          sprite={panelSprites.sidePanelEdgeLeft}
          axis="y"
          length={contentH}
          start={PILLAR_CAP}
          end={PILLAR_CAP}
          className="pointer-events-none absolute left-0"
          style={{ top: px(ROW_H) }}
        />
        <SlicedSprite
          sprite={panelSprites.sidePanelEdgeRight}
          axis="y"
          length={contentH}
          start={PILLAR_CAP}
          end={PILLAR_CAP}
          className="pointer-events-none absolute"
          style={{ top: px(ROW_H), left: px(w - PILLAR_W) }}
        />
        {m.resizable ? <WindowResizeHandle onPointerDown={m.onResizeStart} style={{ right: px(2), bottom: px(ROW_H + 2) }} /> : null}
      </TabsPrimitive.Root>
    </MovableContext.Provider>
  );
}

function SidePanelContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel data-slot="side-panel-content" className={cn("outline-none", className)} {...props} />;
}

export { SidePanel, SidePanelContent };
export type { SidePanelTab };
