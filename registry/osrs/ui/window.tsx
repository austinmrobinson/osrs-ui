"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type Point = { x: number; y: number };
type Size = { width: number; height: number };

type WindowContextValue = {
  draggable: boolean;
  onDragStart: (e: React.PointerEvent) => void;
};
const WindowContext = React.createContext<WindowContextValue>({ draggable: false, onDragStart: () => {} });

/** Size of one game pixel in CSS px, read from --osrs-px (falls back to 1). */
function gamePixel(el: HTMLElement | null) {
  if (!el) return 1;
  const probe = document.createElement("div");
  probe.style.width = "var(--osrs-px)";
  el.appendChild(probe);
  const w = probe.getBoundingClientRect().width || 1;
  probe.remove();
  return w;
}

type WindowProps = React.ComponentProps<"div"> & {
  /** Drag the window by its header. */
  draggable?: boolean;
  /** Resize from the bottom-right drag dots. Sizes snap to whole game pixels. */
  resizable?: boolean;
  /** Initial offset when draggable (CSS px). */
  defaultPosition?: Point;
  /** Initial size when resizable (CSS px). Falls back to the element's own size. */
  defaultSize?: Partial<Size>;
  minWidth?: number;
  minHeight?: number;
  onPositionChange?: (p: Point) => void;
  onSizeChange?: (s: Size) => void;
};

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
  draggable = false,
  resizable = false,
  defaultPosition = { x: 0, y: 0 },
  defaultSize,
  minWidth = 160,
  minHeight = 100,
  onPositionChange,
  onSizeChange,
  ...props
}: WindowProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<Point>(defaultPosition);
  const [size, setSize] = React.useState<Partial<Size>>(defaultSize ?? {});

  const track = (e: React.PointerEvent, move: (dx: number, dy: number, unit: number) => void) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const start = { x: e.clientX, y: e.clientY };
    const unit = gamePixel(ref.current);
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => move(ev.clientX - start.x, ev.clientY - start.y, unit);
    const onUp = () => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerup", onUp);
      target.removeEventListener("pointercancel", onUp);
    };
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerup", onUp);
    target.addEventListener("pointercancel", onUp);
  };

  const onDragStart = (e: React.PointerEvent) => {
    if (!draggable || (e.target as HTMLElement).closest("button, a, input, select, textarea, [role=button]")) return;
    const origin = pos;
    track(e, (dx, dy, unit) => {
      const next = { x: Math.round((origin.x + dx) / unit) * unit, y: Math.round((origin.y + dy) / unit) * unit };
      setPos(next);
      onPositionChange?.(next);
    });
  };

  const onResizeStart = (e: React.PointerEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const origin = { width: rect.width, height: rect.height };
    track(e, (dx, dy, unit) => {
      const next = {
        width: Math.max(minWidth, Math.round((origin.width + dx) / unit) * unit),
        height: Math.max(minHeight, Math.round((origin.height + dy) / unit) * unit),
      };
      setSize(next);
      onSizeChange?.(next);
    });
  };

  return (
    <WindowContext.Provider value={{ draggable, onDragStart }}>
      <div
        ref={ref}
        data-slot="window"
        data-draggable={draggable || undefined}
        data-resizable={resizable || undefined}
        className={cn("osrs-window osrs-framed osrs-frame-tan-border-thick osrs-text", className)}
        style={{
          ...style,
          ...(draggable ? { translate: `${pos.x}px ${pos.y}px` } : null),
          ...(size.width !== undefined ? { width: size.width } : null),
          ...(size.height !== undefined ? { height: size.height } : null),
        }}
        {...props}
      >
        {children}
        {resizable ? (
          <span
            aria-hidden
            data-slot="window-resize"
            className="osrs-window-resize osrs-sprite osrs-control-drag-corner"
            onPointerDown={onResizeStart}
          />
        ) : null}
      </div>
    </WindowContext.Provider>
  );
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
  const { draggable, onDragStart } = React.useContext(WindowContext);
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

export { Window, WindowHeader, WindowClose, WindowBody };
