import * as React from "react";

import { cn } from "@/lib/utils";
import { formatQuantity, px } from "@/lib/osrs";

/** One 36×32 item cell. Put any icon (sprite, img, svg) inside; `quantity` draws the stack count. */
function ItemSlot({
  className,
  children,
  quantity,
  selected,
  style,
  ...props
}: React.ComponentProps<"div"> & { quantity?: number; selected?: boolean }) {
  const q = quantity !== undefined && quantity > 1 ? formatQuantity(quantity) : null;
  return (
    <div
      data-slot="item-slot"
      data-selected={selected || undefined}
      className={cn("osrs-item-slot relative flex items-center justify-center", className)}
      style={{ width: px(36), height: px(32), ...style }}
      {...props}
    >
      {children}
      {q ? (
        <span
          className="osrs-text osrs-text-small pointer-events-none absolute top-0 left-0"
          style={{ color: q.color, lineHeight: px(10) }}
        >
          {q.text}
        </span>
      ) : null}
    </div>
  );
}

/** The 4×7 inventory grid. Pass up to 28 children (use `null` for empty slots). */
function Inventory({ className, children, style, ...props }: React.ComponentProps<"div">) {
  // keep explicit nulls as empty slots (Children.toArray would drop them)
  const slots = (Array.isArray(children) ? children.flat() : [children]) as React.ReactNode[];
  return (
    <div
      data-slot="inventory"
      className={cn("grid grid-cols-4", className)}
      style={{ columnGap: px(6), rowGap: px(4), width: px(162), ...style }}
      {...props}
    >
      {Array.from({ length: Math.max(28, slots.length) }, (_, i) => (
        <React.Fragment key={i}>{slots[i] ?? <ItemSlot />}</React.Fragment>
      ))}
    </div>
  );
}

export { ItemSlot, Inventory };
