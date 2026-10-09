"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";

import { ScrollArea } from "@/components/ui/scroll-area";
import { buttonSprites } from "@/components/ui/button-sprites";
import { MovableContext, useMovable, type MovableOptions } from "@/lib/movable";

type WindowFrame = "rivets" | "tan";
type WindowProps = React.ComponentProps<"div"> &
  MovableOptions & {
    /** `rivets`: steel iron-rivet frame (Combat Achievements, Collection Log, Bank). `tan`: brown border (Grand Exchange, Settings). */
    frame?: WindowFrame;
  };

const FrameContext = React.createContext<WindowFrame>("rivets");

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
  frame = "rivets",
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
    <FrameContext.Provider value={frame}>
    <MovableContext.Provider value={{ draggable: m.draggable, onDragStart: m.onDragStart }}>
      <div
        ref={m.ref}
        data-slot="window"
        data-frame={frame}
        {...m.dataAttrs}
        className={cn(
          "osrs-window osrs-framed osrs-text",
          frame === "rivets" ? "osrs-frame-iron-rivets" : "osrs-frame-tan-border-thick",
          className,
        )}
        style={{ ...style, ...m.style }}
        {...props}
      >
        {children}
        {m.resizable ? <WindowResizeHandle onPointerDown={m.onResizeStart} /> : null}
      </div>
    </MovableContext.Provider>
    </FrameContext.Provider>
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
  const frame = React.useContext(FrameContext);
  return (
    <>
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
      {frame === "rivets" ? <WindowSeparator /> : null}
    </>
  );
}

/** A riveted steel divider, as between a window's sections. */
function WindowSeparator({ className, orientation = "horizontal", ...props }: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      data-slot="window-separator"
      className={cn(orientation === "vertical" ? "osrs-rivet-divider-v" : "osrs-rivet-divider", className)}
      {...props}
    />
  );
}

type WindowMenuItem = { value: string; label: React.ReactNode };

/** The hamburger view menu in a window's header (Combat Achievements: Overview / Tasks / Bosses / Rewards). */
function WindowMenu({
  items,
  value,
  onValueChange,
}: {
  items: WindowMenuItem[];
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <MenuPrimitive.Root>
      <MenuPrimitive.Trigger aria-label="Menu" className="osrs-window-menu-trigger group">
        <buttonSprites.menu className="group-hover:hidden group-data-[popup-open]:hidden" />
        <buttonSprites.menuSelected className="hidden group-hover:block group-data-[popup-open]:block" />
      </MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner className="z-50 outline-none" side="bottom" align="start" sideOffset={2}>
          <MenuPrimitive.Popup className="osrs-window-menu osrs-framed osrs-frame-iron-rivets osrs-text">
            <MenuPrimitive.RadioGroup value={value} onValueChange={(v) => onValueChange(String(v))}>
              {items.map((i) => (
                <MenuPrimitive.RadioItem key={i.value} value={i.value} className="osrs-window-menu-item" closeOnClick>
                  {i.label}
                </MenuPrimitive.RadioItem>
              ))}
            </MenuPrimitive.RadioGroup>
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
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

export { Window, WindowHeader, WindowClose, WindowBody, WindowResizeHandle, WindowSeparator, WindowMenu };
export type { WindowFrame, WindowMenuItem };
