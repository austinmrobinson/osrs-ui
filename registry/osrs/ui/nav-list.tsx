"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";

/** Vertical category nav, as in the All Settings window. Wrap with <Tabs orientation="vertical">. */
function NavList({ className, ...props }: TabsPrimitive.List.Props) {
  return <TabsPrimitive.List data-slot="nav-list" className={cn("osrs-nav-list", className)} {...props} />;
}

function NavItem({ className, ...props }: TabsPrimitive.Tab.Props) {
  return <TabsPrimitive.Tab data-slot="nav-item" className={cn("osrs-nav-item osrs-framed osrs-text", className)} {...props} />;
}

export { NavList, NavItem };
