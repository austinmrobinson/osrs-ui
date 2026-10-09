"use client";

import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";

import { cn } from "@/lib/utils";

function ContextMenu(props: ContextMenuPrimitive.Root.Props) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({ className, ...props }: ContextMenuPrimitive.Trigger.Props) {
  return <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" className={cn("select-none", className)} {...props} />;
}

/** The in-game right-click menu, with its "Choose Option" header. */
function ContextMenuContent({
  className,
  children,
  header = "Choose Option",
  ...props
}: ContextMenuPrimitive.Popup.Props & { header?: React.ReactNode }) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner className="z-50 outline-none">
        <ContextMenuPrimitive.Popup data-slot="context-menu-content" className={cn("osrs-menu osrs-text", className)} {...props}>
          <ContextMenuPrimitive.Group>
            {header ? <ContextMenuPrimitive.GroupLabel className="osrs-menu-header">{header}</ContextMenuPrimitive.GroupLabel> : null}
            {children}
          </ContextMenuPrimitive.Group>
        </ContextMenuPrimitive.Popup>
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

/** A menu option. `target` is the coloured object name, e.g. <ContextMenuItem target="Bank booth">Use</ContextMenuItem>. */
function ContextMenuItem({
  className,
  children,
  target,
  ...props
}: ContextMenuPrimitive.Item.Props & { target?: React.ReactNode }) {
  return (
    <ContextMenuPrimitive.Item data-slot="context-menu-item" className={cn("osrs-menu-item", className)} {...props}>
      <span>{children}</span>
      {target ? <span className="osrs-menu-target">{target}</span> : null}
    </ContextMenuPrimitive.Item>
  );
}

export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem };
