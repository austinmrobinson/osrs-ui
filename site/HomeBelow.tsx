"use client";

// MDX <HomeBelow>: the home page after the hero: the library's contents with a way into each
// section, then installation and a call to ask for what's missing on GitHub. Credits are in the footer.
//
// While we choose, on the home page:
//   ?art=1..14                      what the contents cards' stages show (see stageArt; 9-14 in StageArt.tsx; 14 is the default)
import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { cardVariants } from "@/registry/osrs/ui/card";
import { CodeBlock } from "@/registry/osrs/ui/code-block";
import { Separator } from "@/registry/osrs/ui/separator";
import { emoteSprites } from "@/registry/osrs/ui/emote-sprites";
import { prayerSprites } from "@/registry/osrs/ui/prayer-sprites";
import { skillIcons } from "@/registry/osrs/ui/skill-icons";
import { normalSpellSprites } from "@/registry/osrs/ui/spell-normal-sprites";
import { GITHUB_URL, GithubIcon } from "./header-icons";
import { PreviewImage } from "./PreviewImage";
import { StageArt } from "./StageArt";
import { cx, link, textShadow } from "./styles";
import { REGISTRY_URL } from "./site-url";

const REGISTRY = REGISTRY_URL;
const COUNTS = { components: 37, recipes: 12, assets: "1,124" };

type Sprite = React.ComponentType<{ className?: string }>;
/** A spread of sprites from several sets, picked by a fixed stride so the wall is the same every load. */
function pick(set: Record<string, Sprite>, n: number, offset = 0): Sprite[] {
  const all = Object.values(set);
  const step = Math.max(1, Math.floor(all.length / n));
  return Array.from(
    { length: n },
    (_, k) => all[(offset + k * step) % all.length],
  );
}
const SPRITES: Sprite[] = [
  ...pick(skillIcons as Record<string, Sprite>, 8),
  ...pick(prayerSprites as Record<string, Sprite>, 8, 1),
  ...pick(normalSpellSprites as Record<string, Sprite>, 8, 3),
  ...pick(emoteSprites as Record<string, Sprite>, 6, 2),
];

/** Sprites at 2x (unless the class sets another scale), as children of a layout the caller gives. */
function SpriteWall({
  count = SPRITES.length,
  from = 0,
  className,
}: {
  count?: number;
  from?: number;
  className?: string;
}) {
  return (
    <span className={cx("[--osrs-px:2px]", className)} aria-hidden="true">
      {SPRITES.slice(from, from + count).map((S, k) => (
        <span key={k} className="inline-flex leading-none">
          <S />
        </span>
      ))}
    </span>
  );
}

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

/** The stage's dark well, framing the real thing. */
const well = "bg-[#3e3529] shadow-[inset_0_0_0_1px_#5d5848]";
/** A small framed tile (the fanned and tiled takes). */
const tile =
  "bg-[#4a4136] shadow-[inset_0_0_0_1px_#5d5848,0_0_0_1px_#1f1a14,0_8px_18px_rgb(0_0_0/.45)]";

/**
 * What each card's stage shows (?art=1..8):
 *   1  the real things at their own size: small controls stacked; the Bank; a 5 x 3 sprite grid
 *   2  one hero piece each, zoomed and kept crisp: the tabs; a crop of the Bank; three sprites at 4x
 *   3  a fanned stack of three, slightly turned, like cards dealt on a table
 *   4  bigger than the stage, bleeding off its edges: the interface window; the full settings; a wall of sprites
 *   5  one iconic piece each: a window; the Grand Exchange; a skill icon at 6x on its pixel grid
 *   6  take 1 tilted back in perspective, straightening on hover
 *   7  take 1 in the stone's tones, coming into colour on hover
 *   8  components as overview tiles, recipes as two stacked screens, sprites on a transparency checkerboard
 */
function stageArt(
  section: "components" | "recipes" | "assets",
  take: number,
): React.ReactNode {
  if (take === 14 && section === "recipes") return stageArt(section, 1);
  if (take >= 9) return <StageArt section={section} take={take} />;
  if (take === 2) {
    if (section === "components")
      return (
        <PreviewImage
          page="components/tabs"
          eager
          fit={false}
          className="scale-150 [image-rendering:pixelated]"
        />
      );
    if (section === "recipes")
      return (
        <PreviewImage
          page="recipes/bank"
          eager
          fit={false}
          className="origin-[38%_45%] scale-200 [image-rendering:pixelated]"
        />
      );
    return <SpriteWall count={3} className="flex gap-[18px] [--osrs-px:4px]" />;
  }
  if (take === 3) {
    // the outer two turn out further on hover
    const fan = [
      "-translate-x-[calc(50%+70px)] translate-y-[calc(-50%+6px)] -rotate-9 group-hover/card:motion-safe:-translate-x-[calc(50%+86px)] group-hover/card:motion-safe:-rotate-14",
      "z-2 -translate-x-1/2 -translate-y-1/2",
      "z-1 translate-x-[calc(-50%+70px)] translate-y-[calc(-50%+8px)] rotate-8 group-hover/card:motion-safe:translate-x-[calc(-50%+86px)] group-hover/card:motion-safe:rotate-13",
    ];
    const card = (k: number, children: React.ReactNode) => (
      <span
        key={k}
        className={cx(
          "absolute top-1/2 left-1/2 flex items-center justify-center p-2.5 transition-[rotate,translate] duration-250",
          tile,
          fan[k],
        )}
      >
        {children}
      </span>
    );
    const pages =
      section === "components"
        ? ["components/orb", "components/button", "components/checkbox"]
        : ["recipes/grand-exchange", "recipes/bank", "recipes/all-settings"];
    return (
      <span className="relative block h-[190px] w-[260px]">
        {section === "assets"
          ? [0, 1, 2].map((k) =>
              card(
                k,
                <SpriteWall
                  count={4}
                  from={k * 8 + 1}
                  className="grid grid-cols-[repeat(2,50px)] gap-1.5"
                />,
              ),
            )
          : pages.map((p, k) =>
              card(
                k,
                <PreviewImage
                  page={p}
                  scale={section === "recipes" ? 0.6 : 1}
                  eager
                  fit={false}
                />,
              ),
            )}
      </span>
    );
  }
  if (take === 4) {
    const bleed =
      "origin-top translate-y-[22%] scale-150 [image-rendering:pixelated]";
    if (section === "components")
      return (
        <PreviewImage
          page="components/interface"
          eager
          fit={false}
          className={bleed}
        />
      );
    if (section === "recipes")
      return (
        <PreviewImage
          page="recipes/all-settings"
          eager
          fit={false}
          className={bleed}
        />
      );
    return (
      <SpriteWall className="grid scale-105 -rotate-8 grid-cols-[repeat(6,75px)] gap-2.5 [--osrs-px:3px]" />
    );
  }
  if (take === 5) {
    if (section === "components")
      return <PreviewImage page="components/window" eager />;
    if (section === "recipes")
      return <PreviewImage page="recipes/grand-exchange" eager />;
    return (
      // a skill icon at 6x on its own pixel grid
      <span
        className="relative block leading-none [--osrs-px:6px]"
        aria-hidden="true"
      >
        <skillIcons.attack />
        <span className="pointer-events-none absolute inset-0 bg-size-[6px_6px] [background-image:linear-gradient(to_right,rgb(0_0_0/.35)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/.35)_1px,transparent_1px)]" />
      </span>
    );
  }
  if (take === 6)
    return (
      <span className="block transform-[perspective(700px)_rotateX(28deg)_rotateZ(-8deg)_scale(.95)] drop-shadow-[0_14px_10px_rgb(0_0_0/.4)] transition-transform duration-350 ease-[cubic-bezier(.3,1.2,.5,1)] group-hover/card:motion-safe:transform-none">
        {stageArt(section, 1)}
      </span>
    );
  if (take === 7)
    return (
      <span className="block opacity-80 [filter:grayscale(1)_sepia(.5)_brightness(.75)_contrast(.9)] transition-[filter,opacity] duration-300 group-hover/card:opacity-100 group-hover/card:[filter:none]">
        {stageArt(section, 1)}
      </span>
    );
  if (take === 8) {
    if (section === "components")
      return (
        <span className="grid auto-rows-[84px] grid-cols-[repeat(2,120px)] gap-2">
          {["button", "orb", "checkbox", "skill-tile"].map((p) => (
            <span
              key={p}
              className="flex items-center justify-center bg-white/5 shadow-[inset_0_0_0_1px_#5d5848,0_0_0_1px_#1f1a14]"
            >
              <PreviewImage
                page={`components/${p}`}
                eager
                className="max-w-[104px]"
              />
            </span>
          ))}
        </span>
      );
    if (section === "recipes")
      return (
        <span className="relative block h-[180px] w-[240px] *:absolute *:shadow-[0_8px_16px_rgb(0_0_0/.45)]">
          <PreviewImage
            page="recipes/grand-exchange"
            scale={0.7}
            eager
            fit={false}
            className="top-0 left-0"
          />
          <PreviewImage
            page="recipes/bank"
            scale={0.7}
            eager
            fit={false}
            className="right-0 bottom-0"
          />
        </span>
      );
    return (
      <span className="flex items-center justify-center p-3.5 shadow-[inset_0_0_0_1px_#5d5848] [background:repeating-conic-gradient(#4a4339_0_25%,#3d372f_0_50%)_0_0/16px_16px]">
        <SpriteWall
          count={12}
          from={4}
          className="grid auto-rows-[50px] grid-cols-[repeat(4,50px)] gap-1.5"
        />
      </span>
    );
  }
  if (section === "components")
    return (
      // at their own size (no shrinking): a row of small controls, then the slider, then the tabs
      <span className="flex flex-col items-center gap-3.5">
        <span className="flex items-center gap-5">
          <PreviewImage page="components/button" eager fit={false} />
          <PreviewImage page="components/checkbox" eager fit={false} />
        </span>
        <PreviewImage page="components/slider" eager fit={false} />
        <PreviewImage page="components/tabs" eager fit={false} />
      </span>
    );
  if (section === "recipes") return <PreviewImage page="recipes/bank" eager />;
  // sprites at 2x on a fixed 5 x 3 grid of 50px cells
  return (
    <SpriteWall
      count={15}
      className="grid auto-rows-[50px] grid-cols-[repeat(5,50px)] place-items-center gap-x-2.5 gap-y-2"
    />
  );
}

/** A card per section; the whole card is one link: a dark stage with the real thing, its name and
 *  one line on what's there. */
function Contents() {
  const [art, setArt] = React.useState(14);
  // ?stage=well: the art in a dark well (default: on the card's own fill, a separator under it)
  const [flat, setFlat] = React.useState(true);
  // ?card=outline|flat: other card variants (default: the muted card's cut corners, on solid stone)
  const [cardVariant, setCardVariant] = React.useState<"muted" | "flat" | "outline">("muted");
  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const a = Number(q.get("art"));
    if (a >= 1 && a <= 14) setArt(a);
    if (q.get("stage") === "well") setFlat(false);
    const c = q.get("card");
    if (c === "flat" || c === "outline") setCardVariant(c);
  }, []);
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
            // contrast (provisional; revert by dropping bg-transparent): the orange body text measured
            // ~4.1:1 on the muted card's 5%-lifted fill, under 4.5:1; on the plain stone it is ~4.7:1
            className={cx(
              cardVariants({ variant: cardVariant }),
              // a solid fill, so the page's stone pattern doesn't show through
              cardVariant !== "flat" && "bg-rs-stone",
              "group/card flex min-w-0 flex-col p-2.5 text-start no-underline [--osrs-px:1px]",
            )}
          >
            <span
              className={cx(
                "flex h-60 items-center justify-center overflow-hidden",
                !flat && well,
              )}
              aria-hidden="true"
            >
              <span
                className="flex max-h-full max-w-full items-center justify-center transition-transform duration-200 group-hover/card:motion-safe:scale-103"
                inert
              >
                {stageArt(c.section, art)}
              </span>
            </span>
            {flat ? <Separator className="[--osrs-px:2px]" /> : null}
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
