// Small pixel icons the site's own chrome uses (copy, copied, the section-link chevron), as SVG.
// One game pixel per unit; drawn at 2x. Colours follow the game: orange at rest, white on hover
// (via `currentColor`), with the 1px black drop shadow baked in.

const COPY_FILL =
  "M0 0h5v1h-5zM0 1h1v1h-1zM0 2h1v1h-1zM2 2h6v1h-6zM0 3h1v1h-1zM2 3h1v1h-1zM7 3h1v1h-1zM0 4h1v1h-1zM2 4h1v1h-1zM7 4h1v1h-1zM2 5h1v1h-1zM7 5h1v1h-1zM2 6h1v1h-1zM7 6h1v1h-1zM2 7h6v1h-6z";
const COPY_SHADOW =
  "M1 1h5v1h-5zM1 2h1v4h-1zM3 3h4v1h-4zM3 4h1v3h-1zM8 3h1v6h-1zM3 8h5v1h-5z";

/** The copy icon: a sheet with the corner of its copy behind it (8 x 8, at 2x = 18px). */
export function CopyIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 9 9" width={18} height={18} shapeRendering="crispEdges" className={className}>
      <path fill="#000001" d={COPY_SHADOW} />
      <path fill="currentColor" d={COPY_FILL} />
    </svg>
  );
}

/** The green tick shown once something has been copied (12 x 10, at 2x). */
export function CopiedIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 10" width={24} height={20} shapeRendering="crispEdges" className={className}>
      <path
        fill="#000001"
        d="M10 0h2v1h-2zM9 1h1v1h-1zM11 1h1v2h-1zM8 2h1v1h-1zM0 3h2v1h-2zM7 3h1v1h-1zM10 3h1v1h-1zM0 4h1v2h-1zM2 4h1v1h-1zM6 4h1v1h-1zM9 4h1v1h-1zM3 5h1v1h-1zM5 5h1v1h-1zM8 5h1v1h-1zM1 6h1v1h-1zM4 6h1v1h-1zM7 6h1v1h-1zM2 7h1v1h-1zM6 7h1v1h-1zM3 8h1v1h-1zM5 8h1v1h-1zM4 9h1v1h-1z"
      />
      <path fill="#5cd34a" d="M10 1h1v1h-1zM9 2h1v1h-1zM8 3h1v1h-1zM1 4h1v1h-1zM7 4h1v1h-1zM2 5h1v1h-1zM6 5h1v1h-1zM3 6h1v1h-1zM5 6h1v1h-1zM4 7h1v1h-1z" />
      <path fill="#2a8a1e" d="M10 2h1v1h-1zM9 3h1v1h-1zM8 4h1v1h-1zM1 5h1v1h-1zM7 5h1v1h-1zM2 6h1v1h-1zM6 6h1v1h-1zM3 7h1v1h-1zM5 7h1v1h-1zM4 8h1v1h-1z" />
    </svg>
  );
}

/** A thin chevron drawn like the font (4 x 7 game pixels with its shadow, at 1x). */
export function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 5 8" width={5} height={8} shapeRendering="crispEdges" className={className}>
      <path fill="#000001" d="M1 7h1v1h-1zM2 6h1v1h-1zM3 5h1v1h-1zM4 4h1v1h-1z" />
      <path fill="currentColor" d="M0 0h1v1h-1zM1 1h1v1h-1zM2 2h1v1h-1zM3 3h1v1h-1zM2 4h1v1h-1zM1 5h1v1h-1zM0 6h1v1h-1z" />
    </svg>
  );
}
