"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col", className)} {...props} />;
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
      className={cn("osrs-tabs-list", className)}
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
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn("osrs-tab osrs-framed osrs-text", sizes[size], className)}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel data-slot="tabs-content" className={cn("outline-none", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
