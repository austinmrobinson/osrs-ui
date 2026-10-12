"use client";

// MDX <HomeBelow>: the home page after the hero: the library's contents with a way into each
// section, then installation and a call to ask for what's missing on GitHub. Credits are in the footer.
import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { cardVariants } from "@/registry/osrs/ui/card";
import { CodeBlock } from "@/registry/osrs/ui/code-block";
import { Separator } from "@/registry/osrs/ui/separator";
import { GITHUB_URL, GithubIcon } from "./header-icons";
import { StageArt } from "./StageArt";
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

/** A card per section; the whole card is one link: the real thing, a separator, its name and one
 *  line on what's there. */
function Contents() {
  const cols = [
    {
      section: "components",
      title: "Components",
      body: "Every control from the game, built on Base UI, each with a live playground.",
      href: "/components",
    },
    {
      section: "recipes",
      title: "Recipes",
      body: "Whole screens assembled from the components, ready to copy into your app.",
      href: "/recipes",
    },
    {
      section: "assets",
      title: "Assets",
      body: "Every sprite, frame and texture as SVG or crisp PNG at any scale, free for videos and overlays.",
      href: "/assets",
    },
  ] as const;
  return (
    <section className={cx(screen, "pt-0")}>
      <Heading title="Everything on the game's screen" next>
        {COUNTS.components} components, {COUNTS.recipes} whole-screen recipes
        and {COUNTS.assets} sprites, frames and textures.
      </Heading>
      <div className="grid w-full max-w-[1120px] grid-cols-1 gap-3 min-[900px]:grid-cols-3">
        {cols.map((c) => (
          <a
            key={c.href}
            href={c.href}
            // the muted card's cut corners on a solid fill, so the page's stone pattern doesn't show
            // through (the orange body text is ~4.7:1 on it; the card's own 5%-lifted fill is ~4.1:1)
            className={cx(
              cardVariants({ variant: "muted" }),
              "bg-rs-stone",
              "group/card flex min-w-0 flex-col p-2.5 text-start no-underline [--osrs-px:1px]",
            )}
          >
            <span className="flex h-60 items-center justify-center overflow-hidden" aria-hidden="true">
              <span
                className="flex max-h-full max-w-full items-center justify-center transition-transform duration-200 group-hover/card:motion-safe:scale-103"
                inert
              >
                <StageArt section={c.section} />
              </span>
            </span>
            <Separator className="[--osrs-px:2px]" />
            <span className="flex flex-col items-center gap-1.5 px-2 pt-3.5 pb-1.5 text-center">
              {/* Bold 12 at 1x until the cards are wide enough for Plain 12 at 2x */}
              <span className="font-rs-bold text-rs leading-[1.1] text-rs-white [text-shadow:1px_1px_0_#000] group-hover/card:text-rs-yellow min-[1100px]:font-rs min-[1100px]:text-[length:32px] min-[1100px]:[text-shadow:2px_2px_0_#000]">
                {c.title}
              </span>
              <span className={cx("text-balance text-rs-orange", textShadow)}>
                {c.body}
              </span>
            </span>
          </a>
        ))}
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
