"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import type * as React from "react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/** Vertical category nav, as in the All Settings window. Wrap with <Tabs orientation="vertical">. */
function NavList({ className, ...props }: TabsPrimitive.List.Props) {
  return <TabsPrimitive.List data-slot="nav-list" className={cn("osrs-nav-list", className)} {...props} />;
}

/** A category button. Hover and pressed turn the label white; `tooltip` adds the game's hover label ("Select Audio"). */
function NavItem({ className, tooltip, ...props }: TabsPrimitive.Tab.Props & { tooltip?: React.ReactNode }) {
  const tab = <TabsPrimitive.Tab data-slot="nav-item" className={cn("osrs-nav-item osrs-text", className)} {...props} />;
  if (!tooltip) return tab;
  return (
    <Tooltip>
      <TooltipTrigger render={tab} />
      <TooltipContent variant="interface" side="bottom" align="start" sideOffset={-6} alignOffset={40}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export { NavList, NavItem };
