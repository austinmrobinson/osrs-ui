// Blume Pagination slot: prev / next as OSRS stone buttons.
import { buttonVariants } from "@/registry/osrs/ui/button";

type Page = { route: string; label: string } | null;

export default function Pagination({ prev, next }: { prev: Page; next: Page }) {
  if (!prev && !next) return null;
  return (
    <nav aria-label="Pagination" className="osrs-text mx-auto mt-12 flex max-w-content justify-between gap-4" style={{ "--osrs-px": "1px" } as React.CSSProperties}>
      {prev ? (
        <a href={prev.route} className={buttonVariants({ variant: "stone" })} style={{ textDecoration: "none" }}>
          ← {prev.label}
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a href={next.route} className={buttonVariants({ variant: "stone" })} style={{ textDecoration: "none" }}>
          {next.label} →
        </a>
      ) : null}
    </nav>
  );
}
