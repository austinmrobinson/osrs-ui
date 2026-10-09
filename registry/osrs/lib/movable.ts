"use client";

import * as React from "react";

export type Point = { x: number; y: number };
export type Size = { width: number; height: number };

export type MovableOptions = {
  /** Drag by the element's handle (the header). */
  draggable?: boolean;
  /** Resize from a corner handle. Sizes snap to whole game pixels. */
  resizable?: boolean;
  defaultPosition?: Point;
  defaultSize?: Partial<Size>;
  minWidth?: number;
  minHeight?: number;
  onPositionChange?: (p: Point) => void;
  onSizeChange?: (s: Size) => void;
};

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

function track(e: React.PointerEvent, el: HTMLElement | null, move: (dx: number, dy: number, unit: number) => void) {
  if (e.button !== 0) return;
  e.preventDefault();
  const start = { x: e.clientX, y: e.clientY };
  const unit = gamePixel(el);
  const target = e.currentTarget as HTMLElement;
  target.setPointerCapture?.(e.pointerId);
  // no text selection while dragging
  const prevSelect = document.body.style.userSelect;
  document.body.style.userSelect = "none";
  const onMove = (ev: PointerEvent) => move(ev.clientX - start.x, ev.clientY - start.y, unit);
  const onUp = () => {
    document.body.style.userSelect = prevSelect;
    target.removeEventListener("pointermove", onMove);
    target.removeEventListener("pointerup", onUp);
    target.removeEventListener("pointercancel", onUp);
  };
  target.addEventListener("pointermove", onMove);
  target.addEventListener("pointerup", onUp);
  target.addEventListener("pointercancel", onUp);
}

/** Shared drag / resize behaviour for Window and Interface. */
export function useMovable({
  draggable = false,
  resizable = false,
  defaultPosition = { x: 0, y: 0 },
  defaultSize,
  minWidth = 160,
  minHeight = 100,
  onPositionChange,
  onSizeChange,
}: MovableOptions) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<Point>(defaultPosition);
  const [size, setSize] = React.useState<Partial<Size>>(defaultSize ?? {});

  const onDragStart = (e: React.PointerEvent) => {
    if (!draggable || (e.target as HTMLElement).closest("button, a, input, select, textarea, [role=button]")) return;
    const origin = pos;
    track(e, ref.current, (dx, dy, unit) => {
      const next = { x: Math.round((origin.x + dx) / unit) * unit, y: Math.round((origin.y + dy) / unit) * unit };
      setPos(next);
      onPositionChange?.(next);
    });
  };

  const onResizeStart = (e: React.PointerEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const origin = { width: rect.width, height: rect.height };
    track(e, ref.current, (dx, dy, unit) => {
      const next = {
        width: Math.max(minWidth, Math.round((origin.width + dx) / unit) * unit),
        height: Math.max(minHeight, Math.round((origin.height + dy) / unit) * unit),
      };
      setSize(next);
      onSizeChange?.(next);
    });
  };

  const style: React.CSSProperties = {
    ...(draggable ? { translate: `${pos.x}px ${pos.y}px` } : null),
    ...(size.width !== undefined ? { width: size.width } : null),
    ...(size.height !== undefined ? { height: size.height } : null),
  };

  const dataAttrs = { "data-draggable": draggable || undefined, "data-resizable": resizable || undefined };

  return { ref, style, dataAttrs, draggable, resizable, onDragStart, onResizeStart };
}

export type MovableContextValue = { draggable: boolean; onDragStart: (e: React.PointerEvent) => void };
export const MovableContext = React.createContext<MovableContextValue>({ draggable: false, onDragStart: () => {} });

/** Measure an element in game pixels (its CSS size divided by --osrs-px), live. */
export function useGameSize<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [size, setSize] = React.useState<Size | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const u = gamePixel(el);
      const r = el.getBoundingClientRect();
      setSize({ width: Math.round(r.width / u), height: Math.round(r.height / u) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}
