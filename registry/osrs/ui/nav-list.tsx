"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import type * as React from "react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Vertical category nav. Wrap with <Tabs orientation="vertical">.
 * `settings` (default): centred bevelled buttons in a darker column (All Settings).
 * `attached`: left-aligned bars attached to the content panel on their right (skill guides);
 *   pair with <NavPanel> so the selected bar opens into it.
 */
function NavList({ className, variant = "settings", ...props }: TabsPrimitive.List.Props & { variant?: "settings" | "attached" }) {
  return (
    <TabsPrimitive.List
      data-slot="nav-list"
      data-variant={variant}
      className={cn(variant === "attached" ? "osrs-nav-list-attached" : "osrs-nav-list", className)}
      {...props}
    />
  );
}

/** The bevelled panel an `attached` NavList opens into. */
function NavPanel({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="nav-panel" className={cn("osrs-nav-panel", className)} {...props} />;
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

/**
 * A nav item that links to a page, for a site's or app's navigation (put them in a `<nav>` styled
 * with `osrs-nav-list`, rather than in Tabs). Set `current` on the current page's link: it gets
 * `aria-current="page"` and opens into the page beside the column, its frame unfilled and the
 * column's divider covered by a strip of the page's surface (`--osrs-nav-surface`, the stone by
 * default).
 */
function NavLink({ className, current, ...props }: React.ComponentProps<"a"> & { current?: boolean }) {
  return <a data-slot="nav-link" aria-current={current ? "page" : undefined} className={cn("osrs-nav-item osrs-text", className)} {...props} />;
}

export { NavList, NavItem, NavLink, NavPanel };
