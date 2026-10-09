import * as React from "react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

/**
 * Two buttons sharing one metal frame, a separator between them: the main action on the left
 * (it takes the spare width), a menu of related actions on the right ("Download all", then a
 * category). Put two `Button`s in it; the second is usually a `DropdownMenuTrigger`.
 *
 * <SplitButton>
 *   <Button>Download all</Button>
 *   <DropdownMenu>
 *     <DropdownMenuTrigger render={<Button size="icon" aria-label="Download a category" />}>…</DropdownMenuTrigger>
 *     …
 *   </DropdownMenu>
 * </SplitButton>
 */
function SplitButton({ className, children, ...props }: React.ComponentProps<"div">) {
  const parts = React.Children.toArray(children);
  return (
    <div role="group" data-slot="split-button" className={cn("osrs-split-button osrs-framed", className)} {...props}>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <Separator orientation="vertical" /> : null}
          {part}
        </React.Fragment>
      ))}
    </div>
  );
}

export { SplitButton };
