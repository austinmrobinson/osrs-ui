import * as React from "react";

import { cn } from "@/lib/utils";
import { optionSprites } from "@/components/ui/option-sprites";

/**
 * The game's inline status marks: a round green check for done / on, a round red cross for not done
 * / off (Bank settings, Ironman setup). Both are the same 15x15 round box, so they align in a column.
 * Use beside a label; it's announced as `label`.
 */
function StatusIcon({ status, label, className, ...props }: React.ComponentProps<"span"> & { status: "done" | "failed"; label?: string }) {
  // a matched pair: the round boxes the game uses in Bank settings and Ironman setup
  const Icon = status === "done" ? optionSprites.roundCheckBoxCheckedGreen : optionSprites.roundCheckBoxCrossed;
  return (
    <span data-slot="status-icon" data-status={status} role="img" aria-label={label ?? (status === "done" ? "Yes" : "No")} className={cn("osrs-status-icon", className)} {...props}>
      <Icon />
    </span>
  );
}

export { StatusIcon };
