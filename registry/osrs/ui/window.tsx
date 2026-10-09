"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MovableContext, useMovable, type MovableOptions } from "@/lib/movable";

type WindowProps = React.ComponentProps<"div"> & MovableOptions;

/**
 * A modern OSRS interface window (All Settings, Grand Exchange, Collection Log…):
 * interface stone inside the thick tan border, with a header row.
 * Optionally draggable by its header and resizable from the corner, like the game's
 * resizable interfaces.
 */
function Window({
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
}: WindowProps) {
  const m = useMovable({ draggable, resizable, defaultPosition, defaultSize, minWidth, minHeight, onPositionChange, onSizeChange });
  return (
    <MovableContext.Provider value={{ draggable: m.draggable, onDragStart: m.onDragStart }}>
      <div
        ref={m.ref}
        data-slot="window"
        {...m.dataAttrs}
        className={cn("osrs-window osrs-framed osrs-frame-tan-border-thick osrs-text", className)}
        style={{ ...style, ...m.style }}
        {...props}
      >
        {children}
        {m.resizable ? <WindowResizeHandle onPointerDown={m.onResizeStart} /> : null}
      </div>
    </MovableContext.Provider>
  );
}

/** The game's drag-dots corner. */
function WindowResizeHandle(props: React.ComponentProps<"span">) {
  return <span aria-hidden data-slot="window-resize" className="osrs-window-resize osrs-sprite osrs-control-drag-corner" {...props} />;
}

/** Header row. Put header buttons in `start` / `end`; children become the centred title. Drag handle when the window is draggable. */
function WindowHeader({
  className,
  children,
  start,
  end,
  onPointerDown,
  ...props
}: React.ComponentProps<"div"> & { start?: React.ReactNode; end?: React.ReactNode }) {
  const { draggable, onDragStart } = React.useContext(MovableContext);
  return (
    <div
      data-slot="window-header"
      className={cn("osrs-window-header", draggable && "cursor-move touch-none select-none", className)}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        onDragStart(e);
      }}
      {...props}
    >
      <div className="flex items-center gap-[calc(3*var(--osrs-px))]">{start}</div>
      {children ? <h2 className="osrs-window-title m-0 text-[length:inherit]">{children}</h2> : null}
      <div className="flex items-center gap-[calc(3*var(--osrs-px))]">{end}</div>
    </div>
  );
}

function WindowClose({ className, ...props }: React.ComponentProps<"button">) {
  return <button type="button" aria-label="Close" data-slot="window-close" className={cn("osrs-close osrs-sprite", className)} {...props} />;
}

/** Window content. `scroll` wraps it in the OSRS scroll area. */
function WindowBody({ className, scroll, children, ...props }: React.ComponentProps<"div"> & { scroll?: boolean }) {
  if (scroll)
    return (
      <ScrollArea data-slot="window-body" className="min-h-0 flex-1">
        <div className={cn("flex flex-col", className)} {...props}>
          {children}
        </div>
      </ScrollArea>
    );
  return (
    <div data-slot="window-body" className={cn("flex min-h-0 flex-1", className)} {...props}>
      {children}
    </div>
  );
}

export { Window, WindowHeader, WindowClose, WindowBody, WindowResizeHandle };
