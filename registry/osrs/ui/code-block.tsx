"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const COPY_FILL =
  "M0 0h5v1h-5zM0 1h1v1h-1zM0 2h1v1h-1zM2 2h6v1h-6zM0 3h1v1h-1zM2 3h1v1h-1zM7 3h1v1h-1zM0 4h1v1h-1zM2 4h1v1h-1zM7 4h1v1h-1zM2 5h1v1h-1zM7 5h1v1h-1zM2 6h1v1h-1zM7 6h1v1h-1zM2 7h6v1h-6z";
const COPY_SHADOW = "M1 1h5v1h-5zM1 2h1v4h-1zM3 3h4v1h-4zM3 4h1v3h-1zM8 3h1v6h-1zM3 8h5v1h-5z";

/** A sheet with the corner of its copy behind it, in the text's colour with its black shadow. */
function CopyGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 9 9" shapeRendering="crispEdges">
      <path fill="#000001" d={COPY_SHADOW} />
      <path fill="currentColor" d={COPY_FILL} />
    </svg>
  );
}

/** The green tick shown once something has been copied. */
function CopiedGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 10" shapeRendering="crispEdges">
      <path
        fill="#000001"
        d="M10 0h2v1h-2zM9 1h1v1h-1zM11 1h1v2h-1zM8 2h1v1h-1zM0 3h2v1h-2zM7 3h1v1h-1zM10 3h1v1h-1zM0 4h1v2h-1zM2 4h1v1h-1zM6 4h1v1h-1zM9 4h1v1h-1zM3 5h1v1h-1zM5 5h1v1h-1zM8 5h1v1h-1zM1 6h1v1h-1zM4 6h1v1h-1zM7 6h1v1h-1zM2 7h1v1h-1zM6 7h1v1h-1zM3 8h1v1h-1zM5 8h1v1h-1zM4 9h1v1h-1z"
      />
      <path fill="#5cd34a" d="M10 1h1v1h-1zM9 2h1v1h-1zM8 3h1v1h-1zM1 4h1v1h-1zM7 4h1v1h-1zM2 5h1v1h-1zM6 5h1v1h-1zM3 6h1v1h-1zM5 6h1v1h-1zM4 7h1v1h-1z" />
      <path fill="#2a8a1e" d="M10 2h1v1h-1zM9 3h1v1h-1zM8 4h1v1h-1zM1 5h1v1h-1zM7 5h1v1h-1zM2 6h1v1h-1zM6 6h1v1h-1zM3 7h1v1h-1zM5 7h1v1h-1zM4 8h1v1h-1z" />
    </svg>
  );
}

/**
 * A ghost copy button: the orange copy icon, white on hover, a green tick for a moment once copied.
 * `value` is the text to copy, or a function that returns it when pressed. `label` is its
 * accessible name ("Copy code"); it reads "Copied" while the tick shows.
 */
function CopyButton({
  value,
  label = "Copy",
  className,
  onClick,
  ...props
}: Omit<React.ComponentProps<"button">, "value"> & { value: string | (() => string); label?: string }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      data-slot="copy-button"
      data-copied={copied || undefined}
      aria-label={copied ? "Copied" : label}
      className={cn("osrs-copy-button", className)}
      onClick={async (e) => {
        onClick?.(e);
        try {
          await navigator.clipboard.writeText(typeof value === "function" ? value() : value);
          setCopied(true);
        } catch {
          // clipboard blocked: leave the icon as it was
        }
      }}
      {...props}
    >
      {copied ? <CopiedGlyph /> : <CopyGlyph />}
    </button>
  );
}

/**
 * A block of code on a flat strip of darkened stone, with a copy button in its corner that copies
 * the block's text. Children are the code (plain text, or highlighted markup).
 * `copyLabel` names the copy button ("Copy the install command").
 */
function CodeBlock({ className, children, copyLabel = "Copy code", ...props }: React.ComponentProps<"pre"> & { copyLabel?: string }) {
  const pre = React.useRef<HTMLPreElement>(null);
  return (
    <div data-slot="code-block" className={cn("osrs-code-block", className)}>
      <pre ref={pre} {...props}>
        {children}
      </pre>
      <CopyButton label={copyLabel} value={() => pre.current?.innerText ?? ""} />
    </div>
  );
}

export { CodeBlock, CopyButton };
