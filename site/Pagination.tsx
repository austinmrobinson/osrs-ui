// Previous / next page as the game's stone buttons, at the foot of the content column.
import { buttonVariants } from "@/registry/osrs/ui/button";
import { cx } from "./styles";

type Page = { route: string; label: string } | null;

export default function Pagination({ prev, next }: { prev: Page; next: Page }) {
  if (!prev && !next) return null;
  const button = cx(buttonVariants({ variant: "stone" }), "no-underline");
  return (
    <nav aria-label="Pagination" className="osrs-text mx-auto mt-12 flex max-w-[48rem] justify-between gap-4 [--osrs-px:1px]">
      {prev ? (
        <a href={prev.route} className={button}>
          ← {prev.label}
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a href={next.route} className={button}>
          {next.label} →
        </a>
      ) : null}
    </nav>
  );
}
