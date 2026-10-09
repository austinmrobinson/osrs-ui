"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";

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

/** Drawn as an OSRS interface window. Pass `title` for the centred bold header. */
function DialogContent({
  className,
  children,
  title,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & { title?: React.ReactNode; showCloseButton?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "osrs-interface osrs-framed osrs-frame-iron-rivets osrs-text fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 outline-none sm:max-w-[calc(240*var(--osrs-px))]",
          className,
        )}
        {...props}
      >
        {(title || showCloseButton) && (
          <div className="osrs-interface-header">
            {title ? <DialogPrimitive.Title className="osrs-interface-title">{title}</DialogPrimitive.Title> : null}
            {showCloseButton ? <DialogPrimitive.Close aria-label="Close" className="osrs-close osrs-sprite" /> : null}
          </div>
        )}
        {children}
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
