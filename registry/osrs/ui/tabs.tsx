"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

type TabsVariant = "stone" | "panel";
const VariantContext = React.createContext<TabsVariant>("stone");

/**
 * `stone` (default): the slanted tab stones (Collection Log, Settings classic).
 * `panel`: cut-corner tabs joined to a bevelled panel (Account Management, Combat Achievements).
 * In both, pressing a tab looks the same as the selected tab, as in game.
 */
function Tabs({ className, variant = "stone", ...props }: TabsPrimitive.Root.Props & { variant?: TabsVariant }) {
  return (
    <VariantContext.Provider value={variant}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-variant={variant}
        className={cn("flex flex-col", variant === "panel" && "osrs-tabs-panel", className)}
        {...props}
      />
    </VariantContext.Provider>
  );
}

/**
 * Tabs never squeeze below their label. When they don't fit, the list scrolls
 * horizontally: the mouse wheel scrolls it sideways and the active tab is kept in view.
 */
function TabsList({ className, onWheel, ...props }: TabsPrimitive.List.Props) {
  const ref = React.useRef<HTMLDivElement>(null);

  // Keep the active tab visible when it changes (keyboard, programmatic value).
  React.useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const reveal = () => {
      const active = list.querySelector<HTMLElement>("[data-active]");
      if (!active) return;
      const l = active.offsetLeft;
      const r = l + active.offsetWidth;
      if (l < list.scrollLeft) list.scrollTo({ left: l, behavior: "smooth" });
      else if (r > list.scrollLeft + list.clientWidth) list.scrollTo({ left: r - list.clientWidth, behavior: "smooth" });
    };
    reveal();
    const mo = new MutationObserver(reveal);
    mo.observe(list, { subtree: true, attributeFilter: ["data-active"] });
    return () => mo.disconnect();
  }, []);

  return (
    <TabsPrimitive.List
      ref={ref}
      data-slot="tabs-list"
      className={cn("osrs-tabs-list", React.useContext(VariantContext) === "panel" && "osrs-tabs-list-panel", className)}
      onWheel={(e) => {
        onWheel?.(e);
        const list = ref.current;
        // Vertical wheel scrolls the strip sideways when it overflows.
        if (list && list.scrollWidth > list.clientWidth && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          list.scrollLeft += e.deltaY;
        }
      }}
      {...props}
    />
  );
}

const sizes = { small: "", medium: "osrs-tab-medium", large: "osrs-tab-large" } as const;

function TabsTrigger({ className, size = "small", ...props }: TabsPrimitive.Tab.Props & { size?: keyof typeof sizes }) {
  const variant = React.useContext(VariantContext);
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        variant === "panel" ? "osrs-tab-panel osrs-text" : cn("osrs-tab osrs-framed osrs-text", sizes[size]),
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  const variant = React.useContext(VariantContext);
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("outline-none", variant === "panel" && "osrs-tabs-panel-body", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
