import * as React from "react";

import { cn } from "@/lib/utils";

/** The standard OSRS interface window: stone fill inside an iron-rivet steel frame. */
function Interface({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="interface"
      className={cn("osrs-interface osrs-framed osrs-frame-iron-rivets osrs-text", className)}
      {...props}
    />
  );
}

function InterfaceHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="interface-header" className={cn("osrs-interface-header", className)} {...props} />;
}

function InterfaceTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 data-slot="interface-title" className={cn("osrs-interface-title", className)} {...props} />;
}

function InterfaceClose({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label="Close"
      data-slot="interface-close"
      className={cn("osrs-close osrs-sprite", className)}
      {...props}
    />
  );
}

function InterfaceContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="interface-content" className={cn("flex min-h-0 flex-1 flex-col", className)} {...props} />;
}

export { Interface, InterfaceHeader, InterfaceTitle, InterfaceClose, InterfaceContent };
