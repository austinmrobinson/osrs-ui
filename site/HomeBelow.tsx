"use client";

// MDX <HomeBelow>: the home page after the hero: the library's contents with a way into each
// section, then installation and a call to ask for what's missing on GitHub. Credits are in the footer.
import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { cardVariants } from "@/registry/osrs/ui/card";
import { CodeBlock } from "@/registry/osrs/ui/code-block";
import { Separator } from "@/registry/osrs/ui/separator";
import { GITHUB_URL, GithubIcon } from "./header-icons";
import { BankArt, ButtonArt, CollectionArt, ScaleArt, StatArt } from "./StageArt";
import { cx, link, textShadow } from "./styles";
import { REGISTRY_URL } from "./site-url";

const REGISTRY = REGISTRY_URL;
const COUNTS = { components: 37, recipes: 13, assets: "1,124" };

/** A section of the page: full width of the main column, content centred, 120px apart. */
const screen =
  "flex scroll-mt-[66px] flex-col items-center gap-7 px-(--main-pad) py-[120px]";

/** A section's heading: Plain 12 at 3x (2x on narrow screens) over one line in the body text. */
function Heading({
  title,
  children,
  align = "center",
  next,
}: {
  title: React.ReactNode;
  children?: React.ReactNode;
  align?: "center" | "start";
  next?: boolean;
}) {
  return (
    <header
      className={cx(
        "max-w-[720px] text-balance",
        align === "center" ? "text-center" : "text-start",
      )}
    >
      <h2
        data-home-next={next ? "" : undefined}
        className="m-0 mb-2 p-0 font-rs text-[length:32px] leading-[1.15] font-normal text-rs-orange [text-shadow:2px_2px_0_#000] min-[640px]:text-[length:48px] min-[640px]:[text-shadow:3px_3px_0_#000]"
      >
        {title}
      </h2>
      {children ? (
        <p className={cx("m-0 text-rs-orange", textShadow)}>{children}</p>
      ) : null}
    </header>
  );
}

/* ---------- Contents ---------- */

/** One bento tile; the whole tile is one link: its picture, a separator, then a bold lead and one
 *  line, left-aligned on the tile's gutter. */
function Tile({
  href,
  lead,
  body,
  art,
  artHeight,
  className,
}: {
  href: string;
  lead: string;
  body: React.ReactNode;
  art: React.ReactNode;
  /** the picture's height, as Tailwind classes */
  artHeight: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      // the muted card's cut corners on a solid fill, so the page's stone pattern doesn't show
      // through (the orange body text is ~4.7:1 on it; the card's own 5%-lifted fill is ~4.1:1)
      className={cx(
        cardVariants({ variant: "muted" }),
        "bg-rs-stone",
        "group/card flex min-w-0 flex-col p-2.5 text-start no-underline [--osrs-px:1px]",
        className,
      )}
    >
      <span className={cx("relative block overflow-hidden", artHeight)} aria-hidden="true" inert>
        {art}
      </span>
      <Separator className="[--osrs-px:2px]" />
      <span className={cx("block px-2 pt-3.5 pb-1.5 text-balance text-rs-orange", textShadow)}>
        <span className="font-rs-bold text-rs-white group-hover/card:text-rs-yellow">{lead}</span> {body}
      </span>
    </a>
  );
}

/** The library's contents as a bento: the Bank leads (the one tile that moves through a story), a
 *  big number beside it, then a control, a collection and a diagram, so no two neighbours are the
 *  same kind. Stacks hero-first on narrow screens. */
function Contents() {
  return (
    <section className={cx(screen, "pt-0")}>
      <Heading title="Everything on the game's screen" next>
        {COUNTS.components} components, {COUNTS.recipes} whole-screen recipes
        and {COUNTS.assets} sprites, frames and textures.
      </Heading>
      <div className="grid w-full max-w-[1120px] grid-cols-1 gap-3 min-[900px]:grid-cols-3">
        <Tile
          className="min-[900px]:col-span-2"
          href="/recipes"
          lead="Recipes."
          body="Whole screens assembled from the components, ready to copy into your app."
          art={<BankArt />}
          artHeight="h-60 min-[900px]:h-80"
        />
        <Tile
          href="/components"
          lead="Components."
          body="Every control from the game, built on Base UI, each with a live playground."
          art={<StatArt value={String(COUNTS.components)} unit="controls" />}
          artHeight="h-50 min-[900px]:h-80"
        />
        <Tile
          href="/components/button"
          lead="Buttons."
          body="Metal, stone and tile, with the game's own pressed and hover looks."
          art={<ButtonArt />}
          artHeight="h-50"
        />
        <Tile
          href="/assets"
          lead="Assets."
          body="Every sprite, frame and texture as SVG or crisp PNG, free for videos and overlays."
          art={<CollectionArt />}
          artHeight="h-50"
        />
        <Tile
          href="/getting-started"
          lead="Any size."
          body="One variable scales every frame, font and sprite together, still pixel-sharp."
          art={<ScaleArt />}
          artHeight="h-50"
        />
      </div>
    </section>
  );
}

/* ---------- Installation ---------- */

/** One install command and the way to ask for more: the last screen. Credits live in the footer. */
function Install() {
  return (
    <section id="installation" className={cx(screen, "pb-[200px]")}>
      <Heading title="Install in one line">
        The theme brings the tokens, frames, textures and fonts. Then add components one at a time from the{" "}
        <a className={link} href="/getting-started">
          guide
        </a>
        .
      </Heading>
      <CodeBlock copyLabel="Copy the install command" className="w-full max-w-[640px] [--osrs-px:1px] [&>pre]:whitespace-nowrap">
        <span className="text-rs-orange">$</span> npx shadcn@latest add {REGISTRY}/osrs-theme.json
      </CodeBlock>
      <div className={cx("mt-6 flex flex-col items-center gap-3 text-rs-orange", textShadow)}>
        <p className="m-0">Missing something from the game?</p>
        <div className="flex flex-wrap justify-center gap-2 [--osrs-px:1px]">
          <Button size="lg" tone="white" nativeButton={false} render={<a href={`${GITHUB_URL}/issues/new`} />}>
            Request on GitHub
          </Button>
          <Button size="lg" tone="white" nativeButton={false} render={<a href={GITHUB_URL} />}>
            <GithubIcon />
            Star the repo
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function HomeBelow() {
  return (
    <div className="w-[calc(100cqw+2*var(--main-pad))] mx-[calc(50%-50cqw-var(--main-pad))]">
      <Contents />
      <Install />
    </div>
  );
}
