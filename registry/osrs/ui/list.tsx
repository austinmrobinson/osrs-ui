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

/** Fixed-width slot for an item icon (36 x 32 game px, like the Skill Guide's item column), centred. */
function ListItemIcon({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="list-item-icon" className={cn("osrs-list-item-icon", className)} {...props} />;
}

/** The text column of a rich row: a title and any detail lines. */
function ListItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="list-item-content" className={cn("osrs-list-item-content", className)} {...props} />;
}

/** The row's name, in the list's orange. */
function ListItemTitle({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="list-item-title" className={cn("osrs-list-item-title", className)} {...props} />;
}

/** A detail line. With `label`, reads like the Skill Guide's "Requires: Level 10 Defence": orange label, pale value. */
function ListItemDetail({ label, className, children, ...props }: React.ComponentProps<"span"> & { label?: React.ReactNode }) {
  return (
    <span data-slot="list-item-detail" className={cn("osrs-list-item-detail", className)} {...props}>
      {label ? <span className="osrs-list-item-detail-label">{label}: </span> : null}
      <span className="osrs-list-item-detail-value">{children}</span>
    </span>
  );
}

export { List, ListItem, ListItemIcon, ListItemContent, ListItemTitle, ListItemDetail };
