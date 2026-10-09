"use client";

// MDX <HomeBelow>: the home page after the hero: the library's contents with a way into each
// section, installation, then the credits and a call to ask for what's missing on GitHub.
//
// While we choose, on the home page:
//   ?art=1..8                       what the contents cards' stages show (see stageArt)
//   ?install=split|column|cards     the installation section's layout (see Install)
import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { cardVariants } from "@/registry/osrs/ui/card";
import { CodeBlock } from "@/registry/osrs/ui/code-block";
import { Separator } from "@/registry/osrs/ui/separator";
import { Step, StepNumber, Steps } from "@/registry/osrs/ui/steps";
import { emoteSprites } from "@/registry/osrs/ui/emote-sprites";
import { prayerSprites } from "@/registry/osrs/ui/prayer-sprites";
import { skillIcons } from "@/registry/osrs/ui/skill-icons";
import { normalSpellSprites } from "@/registry/osrs/ui/spell-normal-sprites";
import { GITHUB_URL, GithubIcon } from "./header-icons";
import { PreviewImage } from "./PreviewImage";
import { cx, link, textShadow } from "./styles";

const REGISTRY = "https://osrs-ui.vercel.app/r";
const COUNTS = { components: 37, recipes: 12, assets: "1,124" };

type Sprite = React.ComponentType<{ className?: string }>;
/** A spread of sprites from several sets, picked by a fixed stride so the wall is the same every load. */
function pick(set: Record<string, Sprite>, n: number, offset = 0): Sprite[] {
  const all = Object.values(set);
  const step = Math.max(1, Math.floor(all.length / n));
  return Array.from({ length: n }, (_, k) => all[(offset + k * step) % all.length]);
}
const SPRITES: Sprite[] = [
  ...pick(skillIcons as Record<string, Sprite>, 8),
  ...pick(prayerSprites as Record<string, Sprite>, 8, 1),
  ...pick(normalSpellSprites as Record<string, Sprite>, 8, 3),
  ...pick(emoteSprites as Record<string, Sprite>, 6, 2),
];

/** Sprites at 2x (unless the class sets another scale), as children of a layout the caller gives. */
function SpriteWall({ count = SPRITES.length, from = 0, className }: { count?: number; from?: number; className?: string }) {
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
const screen = "flex scroll-mt-[66px] flex-col items-center gap-7 px-(--main-pad) py-[120px]";

/** A section's heading: Plain 12 at 3x (2x on narrow screens) over one line in the body text. */
function Heading({ title, children, align = "center", next }: { title: React.ReactNode; children: React.ReactNode; align?: "center" | "start"; next?: boolean }) {
  return (
    <header className={cx("max-w-[720px] text-balance", align === "center" ? "text-center" : "text-start")}>
      <h2
        data-home-next={next ? "" : undefined}
        className="m-0 mb-2 p-0 font-rs text-[length:32px] leading-[1.15] font-normal text-rs-orange [text-shadow:2px_2px_0_#000] min-[900px]:text-[length:48px] min-[900px]:[text-shadow:3px_3px_0_#000]"
      >
        {title}
      </h2>
      <p className={cx("m-0 text-rs-orange", textShadow)}>{children}</p>
    </header>
  );
}

/* ---------- Contents ---------- */

/** The stage's dark well, framing the real thing. */
const well = "bg-[#3e3529] shadow-[inset_0_0_0_1px_#5d5848]";
/** A small framed tile (the fanned and tiled takes). */
const tile = "bg-[#4a4136] shadow-[inset_0_0_0_1px_#5d5848,0_0_0_1px_#1f1a14,0_8px_18px_rgb(0_0_0/.45)]";

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
function stageArt(section: "components" | "recipes" | "assets", take: number): React.ReactNode {
  if (take === 2) {
    if (section === "components")
      return <PreviewImage page="components/tabs" eager fit={false} className="scale-150 [image-rendering:pixelated]" />;
    if (section === "recipes")
      return <PreviewImage page="recipes/bank" eager fit={false} className="origin-[38%_45%] scale-200 [image-rendering:pixelated]" />;
    return <SpriteWall count={3} className="flex gap-[18px] [--osrs-px:4px]" />;
  }
  if (take === 3) {
    // the outer two turn out further on hover
    const fan = ["-translate-x-[calc(50%+70px)] translate-y-[calc(-50%+6px)] -rotate-9 group-hover/card:motion-safe:-translate-x-[calc(50%+86px)] group-hover/card:motion-safe:-rotate-14", "z-2 -translate-x-1/2 -translate-y-1/2", "z-1 translate-x-[calc(-50%+70px)] translate-y-[calc(-50%+8px)] rotate-8 group-hover/card:motion-safe:translate-x-[calc(-50%+86px)] group-hover/card:motion-safe:rotate-13"];
    const card = (k: number, children: React.ReactNode) => (
      <span key={k} className={cx("absolute top-1/2 left-1/2 flex items-center justify-center p-2.5 transition-[rotate,translate] duration-250", tile, fan[k])}>
        {children}
      </span>
    );
    const pages =
      section === "components" ? ["components/orb", "components/button", "components/checkbox"] : ["recipes/grand-exchange", "recipes/bank", "recipes/all-settings"];
    return (
      <span className="relative block h-[190px] w-[260px]">
        {section === "assets"
          ? [0, 1, 2].map((k) => card(k, <SpriteWall count={4} from={k * 8 + 1} className="grid grid-cols-[repeat(2,50px)] gap-1.5" />))
          : pages.map((p, k) => card(k, <PreviewImage page={p} scale={section === "recipes" ? 0.6 : 1} eager fit={false} />))}
      </span>
    );
  }
  if (take === 4) {
    const bleed = "origin-top translate-y-[22%] scale-150 [image-rendering:pixelated]";
    if (section === "components") return <PreviewImage page="components/interface" eager fit={false} className={bleed} />;
    if (section === "recipes") return <PreviewImage page="recipes/all-settings" eager fit={false} className={bleed} />;
    return <SpriteWall className="grid scale-105 -rotate-8 grid-cols-[repeat(6,75px)] gap-2.5 [--osrs-px:3px]" />;
  }
  if (take === 5) {
    if (section === "components") return <PreviewImage page="components/window" eager />;
    if (section === "recipes") return <PreviewImage page="recipes/grand-exchange" eager />;
    return (
      // a skill icon at 6x on its own pixel grid
      <span className="relative block leading-none [--osrs-px:6px]" aria-hidden="true">
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
            <span key={p} className="flex items-center justify-center bg-white/5 shadow-[inset_0_0_0_1px_#5d5848,0_0_0_1px_#1f1a14]">
              <PreviewImage page={`components/${p}`} eager className="max-w-[104px]" />
            </span>
          ))}
        </span>
      );
    if (section === "recipes")
      return (
        <span className="relative block h-[180px] w-[240px] *:absolute *:shadow-[0_8px_16px_rgb(0_0_0/.45)]">
          <PreviewImage page="recipes/grand-exchange" scale={0.7} eager fit={false} className="top-0 left-0" />
          <PreviewImage page="recipes/bank" scale={0.7} eager fit={false} className="right-0 bottom-0" />
        </span>
      );
    return (
      <span className="flex items-center justify-center p-3.5 shadow-[inset_0_0_0_1px_#5d5848] [background:repeating-conic-gradient(#4a4339_0_25%,#3d372f_0_50%)_0_0/16px_16px]">
        <SpriteWall count={12} from={4} className="grid auto-rows-[50px] grid-cols-[repeat(4,50px)] gap-1.5" />
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
  return <SpriteWall count={15} className="grid auto-rows-[50px] grid-cols-[repeat(5,50px)] place-items-center gap-x-2.5 gap-y-2" />;
}

/** A card per section; the whole card is one link: a dark stage with the real thing, its name and
 *  one line on what's there. */
function Contents() {
  const [art, setArt] = React.useState(1);
  React.useEffect(() => {
    const a = Number(new URLSearchParams(window.location.search).get("art"));
    if (a >= 1 && a <= 8) setArt(a);
  }, []);
  const cols = [
    { section: "components", title: "Components", body: "Every control from the game, built on Base UI, each with a live playground.", href: "/components" },
    { section: "recipes", title: "Recipes", body: "Whole screens assembled from the components, ready to copy into your app.", href: "/recipes" },
    { section: "assets", title: "Assets", body: "Every sprite, frame and texture as SVG or crisp PNG at any scale, free for videos and overlays.", href: "/assets" },
  ] as const;
  return (
    <section className={cx(screen, "pt-0")}>
      <Heading title="Everything on the game's screen" next>
        {COUNTS.components} components, {COUNTS.recipes} whole-screen recipes and {COUNTS.assets} sprites, frames and textures.
      </Heading>
      <div className="grid w-full max-w-[1120px] grid-cols-1 gap-3 min-[900px]:grid-cols-3">
        {cols.map((c) => (
          <a
            key={c.href}
            href={c.href}
            // contrast (provisional; revert by dropping bg-transparent): the orange body text measured
            // ~4.1:1 on the muted card's 5%-lifted fill, under 4.5:1; on the plain stone it is ~4.7:1
            className={cx(cardVariants({ variant: "muted" }), "group/card flex min-w-0 flex-col bg-transparent p-2.5 text-start no-underline [--osrs-px:1px]")}
          >
            <span className={cx("flex h-60 items-center justify-center overflow-hidden", well)} aria-hidden="true">
              <span className="flex max-h-full max-w-full items-center justify-center transition-transform duration-200 group-hover/card:motion-safe:scale-103" inert>
                {stageArt(c.section, art)}
              </span>
            </span>
            <span className="flex flex-col items-center gap-1.5 px-2 pt-3.5 pb-1.5 text-center">
              <span className="font-rs text-[length:32px] leading-[1.1] text-rs-white [text-shadow:2px_2px_0_#000] group-hover/card:text-rs-yellow">{c.title}</span>
              <span className={cx("text-balance text-rs-orange", textShadow)}>{c.body}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---------- Installation ---------- */

/** A command on the darkened stone strip, with the copy button at its end. */
function CopyLine({ code, label }: { code: string; label: string }) {
  return (
    <CodeBlock copyLabel={label} className="[--osrs-px:1px] [&>pre]:whitespace-nowrap">
      <span className="text-rs-orange">$</span> {code}
    </CodeBlock>
  );
}

/** An inline code chip in running text. */
function Code({ children }: { children: React.ReactNode }) {
  return <code className="bg-white/8 px-1 font-code text-rs-code text-rs-orange shadow-[0_0_0_1px_#1f1a14]">{children}</code>;
}

const STEPS = [
  {
    title: "Set up shadcn/ui",
    body: (
      <p className="m-0">
        Any framework, with Tailwind v4. Follow the{" "}
        <a className={link} href="https://ui.shadcn.com/docs/installation">
          shadcn/ui installation
        </a>
        .
      </p>
    ),
  },
  {
    title: "Add the theme",
    body: (
      <>
        <CopyLine code={`npx shadcn@latest add ${REGISTRY}/osrs-theme.json`} label="Copy the theme install command" />
        <p className="m-0">
          Then <Code>@import &quot;../styles/osrs.css&quot;;</Code> after Tailwind in your global CSS.
        </p>
      </>
    ),
  },
  { title: "Add components", body: <CopyLine code={`npx shadcn@latest add ${REGISTRY}/button.json`} label="Copy the component install command" /> },
];

/** The steps down a rail: each number joined to the next by the library Separator. */
function StepRail({ className }: { className?: string }) {
  return (
    <Steps className={cx("w-full [--osrs-px:1px]", textShadow, className)}>
      {STEPS.map((s, k) => (
        <Step key={k} n={k + 1} title={s.title} className="text-rs-orange">
          {s.body}
        </Step>
      ))}
    </Steps>
  );
}

const INSTALL_INTRO = "The theme brings the tokens, frames, textures and fonts in one CSS file; components install one at a time and are yours to edit.";

function More({ className }: { className?: string }) {
  return (
    <p className={cx("m-0 text-rs-orange", textShadow, className)}>
      Next:{" "}
      <a className={link} href="/theming">
        scale, palette and utility classes
      </a>
      , or{" "}
      <a className={link} href="/components">
        pick a component
      </a>
      .
    </p>
  );
}

type InstallVariant = "split" | "column" | "cards";

/**
 * Installation, three ways of lining up the heading with the steps (?install=):
 *   split (default)  heading and next links on the left, the steps on the right; both left-aligned
 *   column           one left-aligned column: heading, steps, next links
 *   cards            all centred: three numbered cards side by side, joined by a rule through their numbers
 */
function Install({ variant }: { variant: InstallVariant }) {
  const title = "Install in three steps";
  if (variant === "column")
    return (
      <section id="installation" className={screen}>
        <div className="flex w-full max-w-[760px] flex-col gap-7">
          <Heading title={title} align="start">
            {INSTALL_INTRO}
          </Heading>
          <StepRail />
          <More />
        </div>
      </section>
    );
  if (variant === "cards")
    return (
      <section id="installation" className={screen}>
        <Heading title={title}>{INSTALL_INTRO}</Heading>
        <ol className="relative m-0 grid w-full max-w-[1120px] list-none grid-cols-1 gap-3 p-0 min-[900px]:grid-cols-3">
          {/* the rule through the numbers, behind the cards' tops */}
          <Separator className="absolute top-[30px] right-[16%] left-[16%] hidden min-[900px]:block" />
          {STEPS.map((s, k) => (
            <li
              key={k}
              className={cx(cardVariants({ variant: "muted" }), "relative flex min-w-0 flex-col items-center gap-3 bg-transparent p-4 text-center text-rs-orange [--osrs-px:1px]", textShadow)}
            >
              <span className="bg-rs-stone p-1">
                <StepNumber>{k + 1}</StepNumber>
              </span>
              <h3 className="m-0 font-rs-bold text-rs font-normal text-rs-white">{s.title}</h3>
              <div className="flex w-full flex-col gap-2 text-balance">{s.body}</div>
            </li>
          ))}
        </ol>
        <More />
      </section>
    );
  return (
    <section id="installation" className={screen}>
      <div className="grid w-full max-w-[1120px] grid-cols-1 gap-10 min-[900px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[900px]:gap-16">
        <div className="flex flex-col gap-6 min-[900px]:sticky min-[900px]:top-24 min-[900px]:self-start">
          <Heading title={title} align="start">
            {INSTALL_INTRO}
          </Heading>
          <More />
        </div>
        <StepRail className="min-[900px]:pt-3" />
      </div>
    </section>
  );
}

/* ---------- Credits ---------- */

const CREDITS: { role: string; who: React.ReactNode }[] = [
  {
    role: "Made by",
    who: (
      <a className={link} href="https://github.com/austinmrobinson">
        Austin Robinson
      </a>
    ),
  },
  {
    role: "Old School RuneScape",
    who: (
      <>
        <a className={link} href="https://www.jagex.com">
          Jagex Ltd.
        </a>{" "}
        Fan content, not endorsed by or affiliated with Jagex
      </>
    ),
  },
  {
    role: "Fonts",
    who: (
      <>
        <a className={link} href="https://github.com/RuneStar/fonts">
          RuneStar
        </a>{" "}
        (CC0)
      </>
    ),
  },
  {
    role: "Sprite reference",
    who: (
      <a className={link} href="https://github.com/melkypie/resource-packs">
        melkypie/resource-packs
      </a>
    ),
  },
  {
    role: "Item icons and data",
    who: (
      <a className={link} href="https://oldschool.runescape.wiki">
        OSRS Wiki
      </a>
    ),
  },
  {
    role: "Code font",
    who: (
      <>
        <a className={link} href="https://departuremono.com">
          Departure Mono
        </a>{" "}
        by Helena Zhang (SIL OFL)
      </>
    ),
  },
];

/** The last screen: who made it and on whose shoulders, and a big way to ask for what's missing. */
function Credits() {
  return (
    <section className={cx(screen, "gap-12 pb-20")}>
      <Heading title="Missing something from the game?">
        Ask for a component, a sprite or a whole screen on GitHub. Requests decide what gets traced next.
      </Heading>
      <div className="flex flex-wrap justify-center gap-2 [--osrs-px:1px] min-[640px]:[--osrs-px:2px]">
        <Button size="lg" nativeButton={false} render={<a href={`${GITHUB_URL}/issues/new`} />}>
          Request on GitHub
        </Button>
        <Button size="lg" tone="white" nativeButton={false} render={<a href={GITHUB_URL} />}>
          <GithubIcon />
          Star the repo
        </Button>
      </div>
      {/* the credits roll: role on the left in the body text, who on the right, on striped rows */}
      <dl className={cx("m-0 grid w-full max-w-[720px] grid-cols-1 shadow-[0_0_0_1px_#1f1a14] min-[640px]:grid-cols-[auto_minmax(0,1fr)]", textShadow)}>
        {CREDITS.map((c, k) => (
          <div key={k} className={cx("col-span-full grid grid-cols-subgrid gap-x-6 px-3 py-2", k % 2 ? "bg-white/5" : "bg-black/10")}>
            <dt className="text-rs-orange">{c.role}</dt>
            <dd className="m-0 text-rs-white">{c.who}</dd>
          </div>
        ))}
      </dl>
      <p className={cx("m-0 max-w-[720px] text-center text-balance text-rs-muted", textShadow)}>
        Created using intellectual property belonging to Jagex Limited under the terms of Jagex&apos;s Fan Content Policy. The code is MIT; the
        traced art is Jagex&apos;s.
      </p>
    </section>
  );
}

export default function HomeBelow() {
  const [install, setInstall] = React.useState<InstallVariant>("split");
  React.useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("install");
    if (v === "split" || v === "column" || v === "cards") setInstall(v);
  }, []);
  return (
    <div className="w-[calc(100cqw+2*var(--main-pad))] mx-[calc(50%-50cqw-var(--main-pad))]">
      <Contents />
      <Install variant={install} />
      <Credits />
    </div>
  );
}
