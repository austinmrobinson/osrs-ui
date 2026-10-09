// The HTML elements of every page's Markdown, as our own components (registered under `mdx` in
// components.ts). The page's own text is drawn like the game: orange body text on the stone, white
// titles, yellow links, sections opened by the Settings band, code on a darkened stone strip.
import * as React from "react";

import { CopiedIcon, CopyIcon } from "./icons";
import { band, cx, focusRing, link, textShadow } from "../styles";

type Props<T extends keyof React.JSX.IntrinsicElements> = React.ComponentProps<T>;

/** Section titles: the Settings band. Blume puts a self-link inside, which takes the band's look. */
export function H2({ className, ...props }: Props<"h2">) {
  return (
    <h2
      className={cx(band, "mt-10 mb-4 scroll-mt-16 [&>a]:text-inherit [&>a]:no-underline", textShadow, className)}
      {...props}
    />
  );
}

export function H3({ className, ...props }: Props<"h3">) {
  return <h3 className={cx("mt-8 mb-2 scroll-mt-16 font-rs-bold text-rs text-rs-orange [&>a]:text-inherit [&>a]:no-underline", textShadow, className)} {...props} />;
}

export function H4({ className, ...props }: Props<"h4">) {
  return <h4 className={cx("mt-6 mb-2 scroll-mt-16 font-rs-bold text-rs text-rs-white [&>a]:text-inherit [&>a]:no-underline", textShadow, className)} {...props} />;
}

export function P({ className, ...props }: Props<"p">) {
  return <p className={cx("my-5 text-rs leading-[1.7] text-rs-orange", textShadow, className)} {...props} />;
}

export function A({ className, ...props }: Props<"a">) {
  return <a className={cx(link, focusRing, className)} {...props} />;
}

export function Strong({ className, ...props }: Props<"strong">) {
  return <strong className={cx("font-normal text-rs-white", className)} {...props} />;
}

export function Ul({ className, ...props }: Props<"ul">) {
  return <ul className={cx("my-5 list-disc ps-6 text-rs-orange marker:text-rs-orange", className)} {...props} />;
}

export function Ol({ className, ...props }: Props<"ol">) {
  return <ol className={cx("my-5 list-decimal ps-6 text-rs-orange marker:text-rs-orange", className)} {...props} />;
}

export function Li({ className, ...props }: Props<"li">) {
  return <li className={cx("my-2 text-rs leading-[1.7] text-rs-orange", textShadow, className)} {...props} />;
}

export function Hr({ className, ...props }: Props<"hr">) {
  return <hr className={cx("my-8 h-0 border-0 shadow-[0_1px_0_var(--color-rs-line),0_2px_0_var(--color-rs-separator)]", className)} {...props} />;
}

/** Inline code: the body text's orange and shadow on a light chip with a dark 1px edge. Inside a
 *  code block the block draws everything, so the chip is dropped there (see Pre). */
export function Code({ className, ...props }: Props<"code">) {
  return (
    <code
      className={cx(
        "bg-white/8 px-1 font-code text-rs-code text-rs-orange shadow-[0_0_0_1px_var(--color-rs-line)]",
        textShadow,
        className,
      )}
      {...props}
    />
  );
}

/** Code blocks: the library's Code Block markup (a flat strip of darkened stone, the copy button in
 *  its corner), in Shiki's colours (site/code-theme.ts). Markdown renders without JavaScript, so the
 *  page shell's copy handler (components/shell/Layout.astro) does the copying, and flags the button
 *  `data-copied` for the tick. */
export function Pre({ className, children, style, ...props }: Props<"pre">) {
  return (
    <div className="osrs-code-block my-3 [--osrs-px:1px]">
      <pre
        className={cx(
          className,
          "text-[color:var(--shiki-dark,var(--color-rs-white))] [&_span]:text-[color:var(--shiki-dark,inherit)]",
          // the code inside is plain text on the strip, not an inline-code chip
          "[&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit [&_code]:shadow-none [&_code]:text-shadow-none",
        )}
        // Shiki's own background is transparent; keep its colour variables but let the strip show
        style={{ ...style, backgroundColor: undefined }}
        {...props}
      >
        {children}
      </pre>
      <CopyButton label="Copy code" />
    </div>
  );
}

/** The copy button, as the library's (orange copy icon, white on hover, a green tick once copied).
 *  It copies `text`, or the `<pre>` beside it. */
export function CopyButton({ label, text, className }: { label: string; text?: string; className?: string }) {
  return (
    <button type="button" data-rs-copy={text ?? ""} data-label={label} aria-label={label} className={cx("osrs-copy-button group", className)}>
      <CopyIcon className="group-data-copied:hidden" />
      <CopiedIcon className="hidden group-data-copied:block" />
    </button>
  );
}

/** Tables: a striped list with a dark outline, a Settings band for the header row and the World
 *  Switcher's dark column rules. Blume wraps every table in a scrolling frame of its own; cell padding
 *  is set on the cells, where its frame's rule can't reach past it. */
export function Table({ className, ...props }: Props<"table">) {
  return <table className={cx("m-0 w-full border-collapse bg-black/10 text-rs", className)} {...props} />;
}

export function Thead(props: Props<"thead">) {
  return <thead {...props} />;
}

export function Tbody({ className, ...props }: Props<"tbody">) {
  return <tbody className={cx("[&>tr:nth-child(odd)]:bg-black/10 [&>tr:nth-child(even)]:bg-white/5", className)} {...props} />;
}

export function Tr(props: Props<"tr">) {
  return <tr {...props} />;
}

const cell = { padding: "5px 10px" } as const;

export function Th({ className, style, ...props }: Props<"th">) {
  return (
    <th
      className={cx(
        "border-0 bg-black/22 text-start align-top font-rs-bold font-normal whitespace-nowrap text-rs-white leading-5 shadow-[inset_0_-1px_0_var(--color-rs-line),0_1px_0_var(--color-rs-separator)] [&+th]:shadow-[inset_1px_0_0_rgb(0_0_0/0.35),inset_0_-1px_0_var(--color-rs-line)]",
        textShadow,
        className,
      )}
      style={{ ...cell, ...style }}
      {...props}
    />
  );
}

export function Td({ className, style, ...props }: Props<"td">) {
  return (
    <td
      className={cx(
        "border-0 text-start align-top leading-5 text-rs-muted first:whitespace-nowrap first:text-rs-white [&+td]:shadow-[inset_1px_0_0_rgb(0_0_0/0.35)]",
        textShadow,
        className,
      )}
      style={{ ...cell, ...style }}
      {...props}
    />
  );
}

export function Blockquote({ className, ...props }: Props<"blockquote">) {
  return <blockquote className={cx("my-5 border-s-2 border-rs-separator ps-4 text-rs-orange", className)} {...props} />;
}

/** The element map for components.ts. */
export const elements = {
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  a: A,
  strong: Strong,
  ul: Ul,
  ol: Ol,
  li: Li,
  hr: Hr,
  code: Code,
  pre: Pre,
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
  blockquote: Blockquote,
};
