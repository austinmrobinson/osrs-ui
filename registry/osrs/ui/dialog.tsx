"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";
import { useMovable, type MovableOptions } from "@/lib/movable";
import { WindowResizeHandle } from "@/components/ui/window";

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 z-50 bg-black/40", className)}
      {...props}
    />
  );
}

/** Drawn as an OSRS interface window. Pass `title` for the centred bold header; `draggable` / `resizable` to move it. */
function DialogContent({
  className,
  children,
  title,
  showCloseButton = true,
  style,
  draggable,
  resizable,
  defaultPosition,
  defaultSize,
  minWidth,
  minHeight,
  onPositionChange,
  onSizeChange,
  ...props
}: DialogPrimitive.Popup.Props & MovableOptions & { title?: React.ReactNode; showCloseButton?: boolean }) {
  const m = useMovable({ draggable, resizable, defaultPosition, defaultSize, minWidth, minHeight, onPositionChange, onSizeChange });
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        ref={m.ref}
        data-slot="dialog-content"
        {...m.dataAttrs}
        className={cn(
          // centred with margin auto so `translate` stays free for dragging
          "osrs-interface osrs-framed osrs-frame-iron-rivets osrs-text fixed inset-0 z-50 m-auto h-fit w-full max-w-[calc(100%-2rem)] outline-none sm:max-w-[calc(240*var(--osrs-px))]",
          className,
        )}
        style={{ ...(style as React.CSSProperties), ...m.style }}
        {...props}
      >
        {(title || showCloseButton) && (
          <div className={cn("osrs-interface-header", m.draggable && "cursor-move touch-none select-none")} onPointerDown={m.onDragStart}>
            {title ? <DialogPrimitive.Title className="osrs-interface-title">{title}</DialogPrimitive.Title> : null}
            {showCloseButton ? <DialogPrimitive.Close aria-label="Close" className="osrs-close osrs-sprite" /> : null}
          </div>
        )}
        {children}
        {m.resizable ? <WindowResizeHandle onPointerDown={m.onResizeStart} /> : null}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn(className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("mt-[calc(8*var(--osrs-px))] flex justify-center gap-[calc(6*var(--osrs-px))]", className)}
      {...props}
    />
  );
}

export { Dialog, DialogTrigger, DialogClose, DialogOverlay, DialogContent, DialogDescription, DialogFooter };
