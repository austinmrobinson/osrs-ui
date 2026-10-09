// The last tile of a shortened card grid (home page): the same card, with a pixel ellipsis in place
// of a preview, linking to the full overview page.
import { cardVariants } from "@/registry/osrs/ui/card";
import { cardLink, cardTitle, cx, gridCard, gridPreview } from "./styles";

/** Three 3 x 3 game-pixel dots in the text's orange, each with the text's 1px black shadow. */
function Ellipsis() {
  const dots = [0, 6, 12].map((x) => `M${x} 0h3v3h-3z`).join("");
  const shadow = [0, 6, 12].map((x) => `M${x + 1} 1h3v3h-3z`).join("");
  return (
    <svg aria-hidden="true" width={34} height={8} viewBox="0 0 17 4" shapeRendering="crispEdges" className="block [image-rendering:pixelated]">
      <path fill="#000001" d={shadow} />
      <path fill="var(--osrs-orange)" d={dots} />
    </svg>
  );
}

export function MoreCard({ href, title }: { href: string; title: string }) {
  return (
    <a href={href} className={cx(cardVariants({ variant: "flat" }), gridCard, cardLink)}>
      <span className={gridPreview} aria-hidden="true">
        <Ellipsis />
      </span>
      <span className={cardTitle}>{title}</span>
    </a>
  );
}
