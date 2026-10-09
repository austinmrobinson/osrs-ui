import * as React from "react";

import { cn } from "@/lib/utils";

/** Striped list, as in the Collection Log and World Switcher. */
function List({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="list" data-slot="list" className={cn("osrs-list osrs-text", className)} {...props} />;
}

/** A row. Renders a button when `onClick` is given. `tone="green"` uses the World Switcher's current-world highlight. */
function ListItem({
  className,
  selected,
  tone,
  onClick,
  ...props
}: React.ComponentProps<"div"> & { selected?: boolean; tone?: "green" }) {
  const shared = {
    "data-slot": "list-item",
    "data-selected": selected || undefined,
    "data-tone": tone,
    className: cn("osrs-list-item", className),
  };
  if (onClick)
    return (
      <button
        type="button"
        role="listitem"
        aria-current={selected || undefined}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLButtonElement>}
        {...shared}
        {...(props as React.ComponentProps<"button">)}
      />
    );
  return <div role="listitem" {...shared} {...props} />;
}

export { List, ListItem };
