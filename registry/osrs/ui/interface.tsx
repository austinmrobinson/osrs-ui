"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MovableContext, useMovable, type MovableOptions } from "@/lib/movable";
import { WindowResizeHandle } from "@/components/ui/window";

/**
 * The classic OSRS interface (bank, shops, quest journal): stone fill inside an
 * iron-rivet steel frame. Optionally draggable by its header and resizable.
 */
function Interface({
  className,
  style,
  children,
  draggable,
  resizable,
  defaultPosition,
  defaultSize,
  minWidth,
  minHeight,
  onPositionChange,
  onSizeChange,
  ...props
}: React.ComponentProps<"div"> & MovableOptions) {
  const m = useMovable({ draggable, resizable, defaultPosition, defaultSize, minWidth, minHeight, onPositionChange, onSizeChange });
  return (
    <MovableContext.Provider value={{ draggable: m.draggable, onDragStart: m.onDragStart }}>
      <div
        ref={m.ref}
        data-slot="interface"
        {...m.dataAttrs}
        className={cn("osrs-interface osrs-framed osrs-frame-iron-rivets osrs-text", className)}
        style={{ ...style, ...m.style }}
        {...props}
      >
        {children}
        {m.resizable ? <WindowResizeHandle onPointerDown={m.onResizeStart} /> : null}
      </div>
    </MovableContext.Provider>
  );
}

function InterfaceHeader({ className, onPointerDown, ...props }: React.ComponentProps<"div">) {
  const { draggable, onDragStart } = React.useContext(MovableContext);
  return (
    <div
      data-slot="interface-header"
      className={cn("osrs-interface-header", draggable && "cursor-move touch-none select-none", className)}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        onDragStart(e);
      }}
      {...props}
    />
  );
}

function InterfaceTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="interface-title" className={cn("osrs-interface-title", className)} {...props} />;
}

/** The close button. Shows the game's "Close" hover label; pass `tooltip={false}` to hide it. */
function InterfaceClose({ className, tooltip = "Close", ...props }: React.ComponentProps<"button"> & { tooltip?: React.ReactNode | false }) {
  const button = (
    <button type="button" aria-label="Close" data-slot="interface-close" className={cn("osrs-close osrs-sprite", className)} {...props} />
  );
  if (tooltip === false) return button;
  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent variant="interface" side="bottom" align="end" sideOffset={2}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

function InterfaceContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="interface-content" className={cn("flex min-h-0 flex-1 flex-col", className)} {...props} />;
}

export { Interface, InterfaceHeader, InterfaceTitle, InterfaceClose, InterfaceContent };
