"use client";

import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";

import { cn } from "@/lib/utils";
import { useAnchorScale } from "@/lib/osrs";

/**
 * A dropdown menu with shadcn/ui's API, drawn as the game's view menu: a stone popup in the
 * iron-rivet frame with centred orange items, white when highlighted or chosen (the hamburger menu
 * of the Bank, Collection Log and Combat Achievements). `WindowMenu` is built on it.
 */
function DropdownMenu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" className={cn("osrs-window-menu-trigger", className)} {...props} />;
}

function DropdownMenuContent({
  className,
  side = "bottom",
  align = "start",
  sideOffset = 2,
  collisionPadding = 8,
  children,
  scale,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "side" | "align" | "sideOffset" | "collisionPadding"> & {
    /** Draw the popup at this scale (CSS px per game pixel) instead of its trigger's. */ scale?: number;
  }) {
  const scaleRef = useAnchorScale<HTMLDivElement>(scale);
  return (
    <MenuPrimitive.Portal>
      {/* flips and shifts to stay on screen; a long menu scrolls inside its frame (--available-height
          is the room the positioner found) */}
      <MenuPrimitive.Positioner className="z-50 outline-none" side={side} align={align} sideOffset={sideOffset} collisionPadding={collisionPadding}>
        <MenuPrimitive.Popup ref={scaleRef} data-slot="dropdown-menu-content" className={cn("osrs-window-menu osrs-framed osrs-frame-iron-rivets osrs-text", className)} {...props}>
          <div className="osrs-window-menu-scroll">{children}</div>
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
  return <MenuPrimitive.Item data-slot="dropdown-menu-item" className={cn("osrs-window-menu-item", className)} {...props} />;
}

function DropdownMenuRadioGroup(props: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({ className, closeOnClick = true, ...props }: MenuPrimitive.RadioItem.Props) {
  return <MenuPrimitive.RadioItem data-slot="dropdown-menu-radio-item" closeOnClick={closeOnClick} className={cn("osrs-window-menu-item", className)} {...props} />;
}

function DropdownMenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return <MenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("osrs-window-menu-separator", className)} {...props} />;
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator };
