// Previous / next page as the game's stone buttons, at the foot of the content column.
import { buttonVariants } from "@/registry/osrs/ui/button";
import { chevronSprites } from "@/registry/osrs/ui/chevron-sprites";
import { cx } from "./styles";

type Page = { route: string; label: string } | null;

export default function Pagination({ prev, next }: { prev: Page; next: Page }) {
  if (!prev && !next) return null;
  // the yellow chevrons of the home page's scroll cue, pointing the way
  const button = cx(buttonVariants({ variant: "stone" }), "gap-2 no-underline [&>svg]:shrink-0");
  return (
    <nav aria-label="Pagination" className="osrs-text mx-auto mt-12 flex max-w-[48rem] justify-between gap-4 [--osrs-px:1px]">
      {prev ? (
        <a href={prev.route} className={button}>
          <chevronSprites.yellowLeftSingle />
          {prev.label}
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a href={next.route} className={button}>
          {next.label}
          <chevronSprites.yellowRightSingle />
        </a>
      ) : null}
    </nav>
  );
}
