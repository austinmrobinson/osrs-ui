"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

/** The pixel magnifier (10 x 10 game pixels, drawn at 2x) in the text's colour. */
function SearchGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" shapeRendering="crispEdges">
      <path fill="currentColor" d="M2 1h1v1h-1zM3 1h1v1h-1zM4 1h1v1h-1zM5 1h1v1h-1zM1 2h1v1h-1zM6 2h1v1h-1zM1 3h1v1h-1zM6 3h1v1h-1zM1 4h1v1h-1zM6 4h1v1h-1zM1 5h1v1h-1zM6 5h1v1h-1zM2 6h1v1h-1zM3 6h1v1h-1zM4 6h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM7 6h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM8 8h1v1h-1z" />
    </svg>
  );
}

/**
 * A search field: the inset input with an orange "Search…" placeholder and the pixel magnifier at
 * its end. `end` replaces the magnifier (a Shortcut hint, a clear button). Give it an `aria-label`
 * when there's no visible label. `size` (game px tall): `sm` 20, `default` 30, `lg` 36.
 */
function SearchField({
  className,
  end,
  size = "default",
  placeholder = "Search…",
  ...props
}: Omit<React.ComponentProps<typeof Input>, "size"> & { end?: React.ReactNode; size?: "sm" | "default" | "lg" }) {
  return (
    <div data-slot="search-field" data-size={size} className={cn("osrs-search-field", className)}>
      <Input type="search" placeholder={placeholder} {...props} />
      <span className="osrs-search-field-end">{end ?? <SearchGlyph />}</span>
    </div>
  );
}

export { SearchField };
