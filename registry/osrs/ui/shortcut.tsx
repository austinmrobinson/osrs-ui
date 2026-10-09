import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A keyboard shortcut: each key a small light chip with the key in white ("⌘ K", "Esc").
 * Pass `keys` for a combination, or a single key as children.
 */
function Shortcut({ keys, className, children, ...props }: React.ComponentProps<"kbd"> & { keys?: React.ReactNode[] }) {
  if (!keys) {
    return (
      <kbd data-slot="shortcut" className={cn("osrs-shortcut", className)} {...props}>
        {children}
      </kbd>
    );
  }
  return (
    <kbd data-slot="shortcut" className={cn("osrs-shortcut-group", className)} {...props}>
      {keys.map((k, i) => (
        <kbd key={i} className="osrs-shortcut">
          {k}
        </kbd>
      ))}
    </kbd>
  );
}

export { Shortcut };
