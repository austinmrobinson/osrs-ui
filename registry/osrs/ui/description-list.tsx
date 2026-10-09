import * as React from "react";

import { cn } from "@/lib/utils";

/** Label / value rows, label orange on the left and value white on the right (League summary, bonuses). */
function DescriptionList({ striped, className, ...props }: React.ComponentProps<"dl"> & { striped?: boolean }) {
  return <dl data-slot="description-list" data-striped={striped || undefined} className={cn("osrs-dl osrs-text", className)} {...props} />;
}

function DescriptionItem({ label, children, className, ...props }: React.ComponentProps<"div"> & { label: React.ReactNode }) {
  return (
    <div data-slot="description-item" className={cn("osrs-dl-item", className)} {...props}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export { DescriptionList, DescriptionItem };
