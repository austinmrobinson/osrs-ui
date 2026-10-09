import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A modern OSRS interface window (All Settings, Grand Exchange, Collection Log…):
 * interface stone inside the thick tan border, with a header row.
 */
function Window({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="window" className={cn("osrs-window osrs-framed osrs-frame-tan-border-thick osrs-text", className)} {...props} />;
}

/** Header row. Put header buttons in `start` / `end`; children become the centred title. */
function WindowHeader({
  className,
  children,
  start,
  end,
  ...props
}: React.ComponentProps<"div"> & { start?: React.ReactNode; end?: React.ReactNode }) {
  return (
    <div data-slot="window-header" className={cn("osrs-window-header", className)} {...props}>
      <div className="flex items-center gap-[calc(3*var(--osrs-px))]">{start}</div>
      {children ? <h2 className="osrs-window-title m-0 text-[length:inherit]">{children}</h2> : null}
      <div className="flex items-center gap-[calc(3*var(--osrs-px))]">{end}</div>
    </div>
  );
}

function WindowClose({ className, ...props }: React.ComponentProps<"button">) {
  return <button type="button" aria-label="Close" data-slot="window-close" className={cn("osrs-close osrs-sprite", className)} {...props} />;
}

function WindowBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="window-body" className={cn("flex min-h-0 flex-1", className)} {...props} />;
}

export { Window, WindowHeader, WindowClose, WindowBody };
