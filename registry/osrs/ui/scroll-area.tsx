"use client";

import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";

import { cn } from "@/lib/utils";

/** Scroll area with the in-game scrollbar: arrow buttons, a stone track and a 3-slice thumb. */
function ScrollArea({ className, children, ...props }: ScrollAreaPrimitive.Root.Props) {
  const viewport = React.useRef<HTMLDivElement>(null);
  const step = (dir: 1 | -1) => viewport.current?.scrollBy({ top: dir * 32 });
  return (
    <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn("relative overflow-hidden", className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        ref={viewport}
        data-slot="scroll-area-viewport"
        className="size-full pr-[calc(16*var(--osrs-px))] outline-none"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        data-slot="scroll-area-scrollbar"
        orientation="vertical"
        keepMounted
        className="osrs-scrollbar absolute top-0 right-0 bottom-0"
      >
        <ScrollAreaPrimitive.Thumb data-slot="scroll-area-thumb" className="osrs-scrollbar-thumb" />
      </ScrollAreaPrimitive.Scrollbar>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Scroll up"
        className="osrs-scroll-arrow osrs-scroll-arrow-up osrs-sprite"
        onClick={() => step(-1)}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label="Scroll down"
        className="osrs-scroll-arrow osrs-scroll-arrow-down osrs-sprite"
        onClick={() => step(1)}
      />
    </ScrollAreaPrimitive.Root>
  );
}

export { ScrollArea };
