"use client";

// The home page hero (MDX <LandingHero>): the logo, then a headline set huge in Plain 12 with three
// live chips that each show one thing the library does differently. The wrench in the corner opens a
// small control window that re-styles the headline; its Scale slider shows that one knob (--osrs-px)
// drives everything: the font, the skill icon, the frame and the React mark step up together, still
// crisp. Right-click anywhere in the hero for the game's "Choose Option" menu. The site header stays
// hidden until the hero has scrolled away (html[data-home-past], set here).
//
// Three takes on the headline while we choose, picked with ?hero= on the home page:
//   sentence (default)  the centred sentence with live chips
//   overhead            the headline as the game's overhead chat, with its chat effects; type your own
//   dialogue            left-aligned, with an NPC dialogue that walks you to the docs
import * as React from "react";

import { buttonVariants } from "@/registry/osrs/ui/button";
import { Checkbox } from "@/registry/osrs/ui/checkbox";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/registry/osrs/ui/context-menu";
import { buttonSprites } from "@/registry/osrs/ui/button-sprites";
import { chevronSprites } from "@/registry/osrs/ui/chevron-sprites";
import { skillIcons } from "@/registry/osrs/ui/skill-icons";
import { Field, FieldLabel } from "@/registry/osrs/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/osrs/ui/popover";
import { Slider } from "@/registry/osrs/ui/slider";
import { SpriteButton } from "@/registry/osrs/ui/sprite-button";
import { ToggleGroup, ToggleGroupItem } from "@/registry/osrs/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/osrs/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/osrs/ui/select";
import { COLOUR_EFFECTS, MOTION_EFFECTS, type ColourEffect, type MotionEffect, colourAt, DialogueHeadline, offsetAt, OverheadHeadline, useTicks } from "./HeroVariants";
import { LogoMark } from "./Logo";
import { LoupeIcon, LoupeRingIcon } from "./loupe-icon";
import { ClapperIcon, PluginIcon } from "./app-icons";
import { ReactIcon } from "./react-icon";
import { play } from "./sound";
import { cx } from "./styles";
import { REGISTRY_URL } from "./site-url";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;
export const INSTALL = `npx shadcn@latest add ${REGISTRY_URL}/osrs-theme.json`;

const COLOURS = {
  orange: { label: "Orange", value: "var(--osrs-orange)" },
  yellow: { label: "Yellow", value: "var(--osrs-yellow)" },
  white: { label: "White", value: "#ffffff" },
  cyan: { label: "Cyan", value: "#00ffff" },
} as const;
type Colour = keyof typeof COLOURS;

const FONTS = {
  plain: { label: "Plain", value: "var(--osrs-font)" },
  bold: { label: "Bold", value: "var(--osrs-font-bold)" },
  quill: { label: "Quill", value: "var(--osrs-font-quill)" },
} as const;
type Font = keyof typeof FONTS;

const SKILLS = (Object.keys(skillIcons) as (keyof typeof skillIcons)[]).filter((k) => k !== "total");
const skillName = (k: string) => k.charAt(0).toUpperCase() + k.slice(1);

/** Looping motion is off: the visitor asked for less motion, or turned Motion off in the header. */
export const still = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.hasAttribute("data-still"));

/** The headline's words rise in one after another. */
const rise = "inline-block motion-safe:animate-[osrs-home-rise_.7s_cubic-bezier(.2,.8,.2,1)_both]";
export const delay = (i: number, base = 250): React.CSSProperties => ({ animationDelay: `${i * 55 + base}ms` });

/** The chip's shell: an inline-block whose baseline is its label's, so its words sit on the line with
 *  the words around it; the pill sits 1 headline pixel lower than the line box, because the font's
 *  glyphs ride low in it. */
const chip =
  "relative isolate mx-[.06em] inline-block whitespace-nowrap leading-[.85] pt-[calc(4*var(--art-px))] pb-[calc(3*var(--art-px))] ps-[calc(4*var(--art-px))] pe-[calc(7*var(--art-px))] motion-safe:animate-[osrs-home-pop_.6s_cubic-bezier(.3,1.5,.5,1)_both]";

/** The chips' pill: the library's notched edge (cut corners) at the chips' scale. */
function Pill() {
  return <span aria-hidden="true" className="osrs-notched osrs-framed absolute inset-0 -z-1 translate-y-(--hero-px) [--osrs-px:var(--art-px)]" />;
}

/** The live art at the start of a chip, centred on the text at the chips' scale. */
const chipArt = "relative me-[calc(3*var(--art-px))] inline-flex items-center align-middle text-shadow-none [--osrs-px:var(--art-px)]";

/** Chip: a sunken pill inside the headline holding a live component and a few words. Its explainer
 *  follows the pointer along the badge, and stays up while its art is clicked or dragged. */
function Chip({ i, from, children, label, tip }: { i: number; from: number; children: React.ReactNode; label: React.ReactNode; tip: React.ReactNode }) {
  const shift = useChipShift(from);
  return (
    <Tooltip trackCursorAxis="x">
      <TooltipTrigger closeOnClick={false} render={<span className={chip} style={{ ...delay(i, 300), ...shift.style }} />}>
        <Pill />
        <span className={chipArt}>{children}</span>
        <ChatEffect.Provider value={shift.value}>{label}</ChatEffect.Provider>
      </TooltipTrigger>
      <TooltipContent variant="interface" side="top" sideOffset={6} scale={1}>
        {tip}
      </TooltipContent>
    </Tooltip>
  );
}

/** The loupe's glass radius and magnification, in game pixels (site/loupe-icon.tsx draws the ring). */
const LENS_R = 7;
const LENS_Z = 3;

/**
 * The most interesting spot on an icon for the loupe to land on: reads the rendered sprite's pixel runs
 * back into a 25 x 25 grid, and scores each glass-sized window by its number of colours (weighted) and colour changes between
 * neighbouring pixels (outlines, highlights, detail), skipping mostly-empty ones. Returns its centre.
 */
function focusPoint(svg: SVGSVGElement | null): [number, number] {
  if (!svg) return [12.5, 12.5];
  const N = 25;
  const grid: (string | null)[] = new Array(N * N).fill(null);
  for (const path of svg.querySelectorAll("path")) {
    const fill = path.getAttribute("fill") ?? "";
    for (const m of (path.getAttribute("d") ?? "").matchAll(/M(\d+) (\d+)h(\d+)v(\d+)/g)) {
      const [x, y, w, h] = m.slice(1).map(Number);
      for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i < N && j < N) grid[j * N + i] = fill;
    }
  }
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= N || y >= N ? null : grid[y * N + x]);
  const W = Math.round((2 * LENS_R) / LENS_Z); // pixels visible across the glass when zoomed
  let best: [number, number] = [12.5, 12.5];
  let bestScore = -1;
  for (let y = 1; y + W <= N - 1; y++)
    for (let x = 1; x + W <= N - 1; x++) {
      let filled = 0;
      let edges = 0;
      const colours = new Set<string>();
      for (let j = y; j < y + W; j++)
        for (let i = x; i < x + W; i++) {
          const c = at(i, j);
          if (!c) continue;
          filled++;
          colours.add(c);
          if (at(i + 1, j) !== c) edges++;
          if (at(i, j + 1) !== c) edges++;
        }
      if (filled < W * W * 0.6) continue;
      const score = edges + colours.size * 8;
      if (score > bestScore) (bestScore = score), (best = [x + W / 2, y + W / 2]);
    }
  return best;
}

/**
 * Traced pixel for pixel: a magnifying glass slides in from the bottom right onto the most detailed
 * part of a skill icon, magnifies what's under its glass until the pixels show as a grid, then slides
 * away; a new skill each loop. Hover holds it; click skips to the next skill. Its explainer is the badge's (Chip).
 *
 * The loupe's centre (--lx, --ly in game px, registered numbers in site.css so they animate) slides in
 * from off the bottom right onto the icon's most detailed spot (--tx, --ty), drifts a pixel or so while
 * it rests there, then slides back out. Like a real loupe, anything under the glass is always magnified
 * (--z), with a one-pixel grid, including on the way in and out. Inside the glass, the copy of the icon
 * is scaled by --z and offset so the point under the glass's centre stays under it: left = (r - lx * z).
 * The clock (@keyframes osrs-home-loupe): 0-6% fade in, off the icon; 6-34% slide on, settling with a
 * slight overshoot; 30-38% a glint crosses the glass; 34-76% rest, drifting; 76-96% slide out and fade.
 */
function SkillChipArt() {
  const [n, setN] = React.useState(0);
  // the loupe with or without its handle (?loupe=handle for the handled one), while we choose
  const [handle, setHandle] = React.useState(false);
  React.useEffect(() => setHandle(new URLSearchParams(window.location.search).get("loupe") === "handle"), []);
  const Ring = handle ? LoupeIcon : LoupeRingIcon;
  const [focus, setFocus] = React.useState<[number, number]>([12.5, 12.5]);
  const base = React.useRef<HTMLSpanElement>(null);
  const key = SKILLS[n];
  const Icon = skillIcons[key];
  React.useLayoutEffect(() => setFocus(focusPoint(base.current?.querySelector("svg") ?? null)), [key]);
  const next = () => setN((v) => (v + 1) % SKILLS.length);
  const loop = "[--loop:4.6s] group-hover/skill:[animation-play-state:paused]";
  return (
    <button
      type="button"
      className="group/skill relative block size-[calc(25*var(--osrs-px))] cursor-pointer border-0 bg-transparent p-0 leading-none"
      aria-label={`${skillName(key)} icon, show the next skill`}
      onClick={next}
      style={{ ["--tx" as string]: focus[0], ["--ty" as string]: focus[1], ["--r" as string]: LENS_R, ["--zmax" as string]: LENS_Z } as React.CSSProperties}
    >
      <span ref={base} className="flex">
        <Icon key={key} />
      </span>
      <span
        className={cx("pointer-events-none absolute inset-0 [--z:var(--zmax)] motion-safe:animate-[osrs-home-loupe_var(--loop)_infinite]", loop)}
        onAnimationIteration={(e) => e.target === e.currentTarget && next()}
      >
        <span className="absolute top-[calc((var(--ly)-var(--r))*var(--osrs-px))] left-[calc((var(--lx)-var(--r))*var(--osrs-px))] size-[calc(2*var(--r)*var(--osrs-px))] overflow-hidden rounded-full bg-[rgb(20_16_10/.55)] opacity-(--lo)">
          <span className="absolute top-[calc((var(--r)-var(--ly)*var(--z))*var(--osrs-px))] left-[calc((var(--r)-var(--lx)*var(--z))*var(--osrs-px))] size-[calc(25*var(--osrs-px))] origin-top-left scale-(--z) [&_svg]:block">
            <Icon />
            {/* one cell per icon pixel, its lines 1 screen pixel at the glass's zoom */}
            <span className="absolute inset-0 bg-size-[var(--osrs-px)_var(--osrs-px)] [background-image:linear-gradient(to_right,rgb(0_0_0/.55)_calc(1px/var(--z)),transparent_0),linear-gradient(to_bottom,rgb(0_0_0/.55)_calc(1px/var(--z)),transparent_0)]" />
          </span>
          {/* the glass: a faint cool tint, and a stepped glint once it has landed */}
          <span
            className={cx(
              "pointer-events-none absolute inset-0 [background:linear-gradient(120deg,transparent_40%,rgb(255_255_255/.4)_45%,rgb(255_255_255/.4)_53%,transparent_58%)_no-repeat,radial-gradient(circle_at_32%_28%,rgb(210_235_255/.16),transparent_62%)] [background-size:300%_100%,100%_100%] motion-safe:animate-[osrs-home-glint_var(--loop)_infinite]",
              loop,
            )}
          />
        </span>
        <Ring className="absolute top-[calc((var(--ly)-8.5)*var(--osrs-px))] left-[calc((var(--lx)-8.5)*var(--osrs-px))] opacity-(--lo) drop-shadow-[var(--osrs-px)_var(--osrs-px)_0_rgb(0_0_0/.35)]" />
      </span>
    </button>
  );
}

/**
 * Any size: a tile frame that stretches side to side, then up and down, then from the corner (each
 * move in whole game pixels). Drag an edge to resize along that axis, or a corner for both (the
 * middle doesn't drag); arrow keys too.
 */
const FRAME = { w: [12, 44], h: [10, 26] } as const;
const clamp = (v: number, [lo, hi]: readonly [number, number]) => Math.min(hi, Math.max(lo, v));
const EDGE = 5; // game px from an edge that count as a handle
type Handle = { x: -1 | 0 | 1; y: -1 | 0 | 1 };
const CURSORS: Record<string, string> = { "1,0": "ew-resize", "-1,0": "ew-resize", "0,1": "ns-resize", "0,-1": "ns-resize", "1,1": "nwse-resize", "-1,-1": "nwse-resize", "1,-1": "nesw-resize", "-1,1": "nesw-resize" };

function handleAt(el: HTMLElement, e: React.PointerEvent): Handle {
  const unit = parseFloat(getComputedStyle(el).getPropertyValue("--osrs-px")) || 1;
  const r = el.getBoundingClientRect();
  const edge = Math.min(EDGE * unit, r.width / 3, r.height / 3);
  const x = e.clientX - r.left < edge ? -1 : r.right - e.clientX < edge ? 1 : 0;
  const y = e.clientY - r.top < edge ? -1 : r.bottom - e.clientY < edge ? 1 : 0;
  return { x, y } as Handle;
}

function FrameChipArt() {
  const [size, setSize] = React.useState<{ w: number; h: number } | null>(null);
  const [cursor, setCursor] = React.useState<string | undefined>();
  const drag = React.useRef<{ x: number; y: number; w: number; h: number; unit: number; handle: Handle } | null>(null);
  return (
    <span className="inline-flex h-[calc(26*var(--osrs-px))] w-[calc(44*var(--osrs-px))] items-center justify-center">
      <button
        type="button"
        aria-label="Resize the frame"
        aria-description="Arrow keys change its width and height; drag an edge or a corner"
        className={cx(
          buttonVariants({ variant: "tile" }),
          "block h-[calc(18*var(--osrs-px))] min-h-0 w-[calc(28*var(--osrs-px))] min-w-0 cursor-default touch-none p-0 select-none",
          size === null && "motion-safe:animate-[osrs-home-stretch_7.2s_infinite] hover:[animation-play-state:paused]",
        )}
        style={{ ...(size === null ? {} : { width: px(size.w), height: px(size.h) }), cursor }}
        onKeyDown={(e) => {
          const step = { ArrowRight: [2, 0], ArrowLeft: [-2, 0], ArrowUp: [0, 2], ArrowDown: [0, -2] }[e.key];
          if (!step) return;
          e.preventDefault();
          setSize((v) => ({ w: clamp((v?.w ?? 28) + step[0], FRAME.w), h: clamp((v?.h ?? 18) + step[1], FRAME.h) }));
        }}
        onPointerDown={(e) => {
          const el = e.currentTarget;
          const handle = handleAt(el, e);
          if (!handle.x && !handle.y) return;
          const unit = parseFloat(getComputedStyle(el).getPropertyValue("--osrs-px")) || 1;
          const r = el.getBoundingClientRect();
          drag.current = { x: e.clientX, y: e.clientY, w: r.width / unit, h: r.height / unit, unit, handle };
          el.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) {
            const h = handleAt(e.currentTarget, e);
            setCursor(CURSORS[`${h.x},${h.y}`]);
            return;
          }
          // the frame is centred in its slot, so it grows by twice the pointer's move, on the handle's axes
          setSize({
            w: clamp(Math.round(d.w + (2 * d.handle.x * (e.clientX - d.x)) / d.unit), FRAME.w),
            h: clamp(Math.round(d.h + (2 * d.handle.y * (e.clientY - d.y)) / d.unit), FRAME.h),
          });
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => !drag.current && setCursor(undefined)}
      />
    </span>
  );
}

/**
 * Ready for …: where the library goes; click for the next one. Three takes, picked with ?ready= on the home page:
 *   roll (default)  icon and words roll up like a slot, one destination at a time
 *   pop             the icon pops out and the next pops in; the words cross-fade; React's
 *                   electrons orbit while it's showing
 *   type            the destination is typed and deleted like a chat line, the icon flipping per word
 */
const TARGETS = [
  { key: "react", word: "React.", Icon: ReactIcon, tip: "Base UI primitives, installed with shadcn" },
  { key: "video", word: "videos.", Icon: ClapperIcon, tip: "Every sprite and frame as SVG or PNG, for edits and thumbnails" },
  { key: "runelite", word: "RuneLite.", Icon: PluginIcon, tip: "On the roadmap: a port for RuneLite plugins" },
] as const;
type ReadyVariant = "roll" | "pop" | "type";

/** React's electrons: one bright pixel pair per orbit, stepping round the sprite's own ellipses. */
function Electrons() {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    if (still()) return;
    const id = setInterval(() => setT((v) => v + 1), 70);
    return () => clearInterval(id);
  }, []);
  // the orbits of site/react-icon.tsx: centre (15, 12), rx 14, ry 5.2, at 0 and +/-60 degrees
  const dots = [0, 60, -60].map((deg, k) => {
    const a = (deg * Math.PI) / 180;
    const th = (t / 22) * Math.PI * 2 + (k * Math.PI * 2) / 3;
    const x = 14 * Math.cos(th);
    const y = 5.2 * Math.sin(th);
    return [Math.round(15 + x * Math.cos(a) - y * Math.sin(a)), Math.round(12 + x * Math.sin(a) + y * Math.cos(a))];
  });
  return (
    <svg className="absolute inset-0 size-full" viewBox="0 0 32 26" shapeRendering="crispEdges" aria-hidden="true">
      {dots.map(([x, y], k) => (
        <rect key={k} x={x} y={y} width={1} height={1} fill="#ffffff" />
      ))}
    </svg>
  );
}

function TargetIcon({ i, electrons, className }: { i: number; electrons?: boolean; className?: string }) {
  const { Icon } = TARGETS[i];
  return (
    <span
      className={cx(
        "relative me-[calc(3*var(--osrs-px))] inline-flex h-[calc(26*var(--osrs-px))] w-[calc(32*var(--osrs-px))] items-center justify-center align-middle text-shadow-none [--osrs-px:var(--art-px)]",
        className,
      )}
    >
      <Icon />
      {electrons && TARGETS[i].key === "react" ? <Electrons /> : null}
    </span>
  );
}

/** The icon flips over (in four steps) when the destination changes. */
const flip = "inline-block motion-safe:animate-[osrs-home-ready-flip_.32s_steps(4)_both]";
/** Pop and type: the longest entry sizes the badge, so the headline never reflows. */
const stack = "inline-grid align-baseline *:[grid-area:1/1] *:whitespace-nowrap";

/** Where the badge's word sits in the headline's letters ("Old School … and ready for "). */
const READY_FROM = 92;

function ReadyChip({ i: order, variant }: { i: number; variant: ReadyVariant }) {
  // changes only on click
  const [n, setN] = React.useState(0);
  // the badge moves with the text effect as one piece; its word's letters move inside it
  const shift = useChipShift(READY_FROM);
  const target = TARGETS[n];
  const next = () => setN((v) => (v + 1) % TARGETS.length);
  const longest = TARGETS.reduce((a, b) => (b.word.length > a.length ? b.word : a), "");

  // roll position: the track repeats the first entry at the end, so last -> first keeps rolling up
  // onto the copy, then snaps back to the top without a transition
  const [pos, setPos] = React.useState({ at: 0, snap: false });
  const prev = React.useRef(n);
  React.useEffect(() => {
    const was = prev.current;
    prev.current = n;
    if (n === 0 && was === TARGETS.length - 1) {
      setPos({ at: TARGETS.length, snap: false });
      const t = setTimeout(() => setPos({ at: 0, snap: true }), 700);
      return () => clearTimeout(t);
    }
    setPos({ at: n, snap: false });
  }, [n]);

  // roll: only the destination word rolls; its window animates to each word's width, so the badge
  // grows and shrinks with it. Widths are measured from the rolled rows themselves.
  const rowRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const [widths, setWidths] = React.useState<number[]>([]);
  React.useLayoutEffect(() => {
    if (variant !== "roll") return;
    // layout widths (offsetWidth), not on-screen ones: the chip is scaled while it pops in
    const measure = () => setWidths(rowRefs.current.map((r) => r?.offsetWidth ?? 0));
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    rowRefs.current.forEach((r) => r && ro.observe(r));
    return () => ro.disconnect();
  }, [variant]);

  let body: React.ReactNode;
  if (variant === "roll") {
    const rows = [...TARGETS.keys(), 0];
    const snap = pos.snap ? "" : undefined;
    body = (
      <>
        <span key={target.key} className={flip}>
          <TargetIcon i={n} />
        </span>
        {/* a one-row window over a column of destinations: the hidden current entry is the in-flow
            line (so the badge keeps the text baseline); the rows sit over it, each a full 1em so
            descenders never reach the next, clipped to one row */}
        <span
          className="relative inline-block [clip-path:inset(0_-.2em_-.075em_0)] align-baseline data-moving:[clip-path:inset(-.35em_-.2em_-.35em_0)] whitespace-nowrap transition-[width] duration-500 ease-[cubic-bezier(.3,1.2,.5,1)] data-snap:transition-none"
          data-snap={snap}
          // a text effect moves letters up and down: the window opens a little to let them
          data-moving={shift.value.motion ? "" : undefined}
          style={widths[pos.at] ? { width: widths[pos.at] } : undefined}
        >
          <span className="invisible inline-block w-0" aria-hidden="true">
            {TARGETS[n].word}
          </span>
          <span
            className="absolute -top-[.075em] left-0 grid translate-y-[calc(var(--n)*-1em)] transition-transform duration-600 ease-[cubic-bezier(.3,1.35,.5,1)] data-snap:transition-none"
            data-snap={snap}
            style={{ ["--n" as string]: pos.at }}
          >
            {rows.map((k, j) => (
              <span key={j} className={cx("flex h-[1em] w-max items-center whitespace-nowrap", shift.value.motion && j !== pos.at && "invisible")}
                aria-hidden={j !== pos.at}>
                <span ref={(el) => void (rowRefs.current[j] = el)} className="inline-block">
                  {j === pos.at ? <Letters text={TARGETS[k].word} from={READY_FROM} /> : TARGETS[k].word}
                </span>
              </span>
            ))}
          </span>
        </span>
      </>
    );
  } else if (variant === "pop") {
    body = (
      <span className={stack}>
        <span className="invisible" aria-hidden="true">
          <TargetIcon i={0} />
          {longest}
        </span>
        <span key={target.key}>
          <TargetIcon i={n} electrons className="motion-safe:animate-[osrs-home-ready-pop_.5s_cubic-bezier(.3,1.6,.5,1)_both]" />
          <span className="inline-block motion-safe:animate-[osrs-home-ready-word_.4s_.08s_cubic-bezier(.2,.8,.2,1)_both]"><Letters text={target.word} from={READY_FROM} /></span>
        </span>
      </span>
    );
  } else {
    body = (
      <span className={stack}>
        <span className="invisible" aria-hidden="true">
          <TargetIcon i={0} />
          {longest}
        </span>
        <span>
          <span key={target.key} className={flip}>
            <TargetIcon i={n} />
          </span>
          <Typed text={target.word} />
        </span>
      </span>
    );
  }

  return (
    <span className={chip} style={{ ...delay(order, 300), ...shift.style }}>
      <Pill />
      <Tooltip trackCursorAxis="x">
        <TooltipTrigger
          // stays open while clicking through the destinations
          closeOnClick={false}
          render={
            <button
              type="button"
              // buttons don't inherit text-shadow from the browser's defaults; this one takes the headline's
              className="inline-block cursor-pointer border-0 bg-transparent p-0 text-start leading-[inherit] [text-shadow:inherit]"
              aria-label={`Ready for ${target.word} Show the next one`}
              onClick={next}
            />
          }
        >
          <ChatEffect.Provider value={shift.value}>{body}</ChatEffect.Provider>
        </TooltipTrigger>
        <TooltipContent variant="interface" side="top" sideOffset={4} scale={1}>
          {target.tip}
        </TooltipContent>
      </Tooltip>
    </span>
  );
}

/** Types `text` in, holds, then deletes it, like a chat line; a block cursor blinks after it. */
function Typed({ text }: { text: string }) {
  const [shown, setShown] = React.useState(text.length);
  React.useEffect(() => {
    if (still()) return setShown(text.length);
    setShown(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let k = 1; k <= text.length; k++) timers.push(setTimeout(() => setShown(k), 120 + k * 70));
    const typedAt = 120 + text.length * 70;
    for (let d = 1; d <= text.length; d++) timers.push(setTimeout(() => setShown(text.length - d), typedAt + 2400 + d * 35));
    return () => timers.forEach(clearTimeout);
  }, [text]);
  return (
    <>
      {text.slice(0, shown)}
      <span
        className="ms-[.06em] inline-block h-[.62em] w-[.4em] bg-current align-baseline shadow-[var(--osrs-px)_var(--osrs-px)_0_#000] motion-safe:animate-[osrs-home-caret_1s_steps(1)_infinite]"
        aria-hidden="true"
      />
    </>
  );
}

/** The game's chat effects on the headline (Controls > Colour effect, Text effect): the clock's
 *  tick and the text effect, read by the headline's words. */
const ChatEffect = React.createContext<{ t: number; motion: MotionEffect; base: [number, number] }>({ t: 0, motion: null, base: [0, 0] });

/** A chip moves with the text effect as one piece, at the place of its first letter in the line;
 *  the letters inside it then move relative to it (`base`), so together they follow the effect. */
function useChipShift(from: number) {
  const ctx = React.useContext(ChatEffect);
  const [x, y] = ctx.motion ? offsetAt(ctx.motion, from, 0, ctx.t) : [0, 0];
  const value = React.useMemo(() => ({ t: ctx.t, motion: ctx.motion, base: [x, y] as [number, number] }), [ctx.t, ctx.motion, x, y]);
  return {
    style: x || y ? ({ translate: `calc(${x} * var(--osrs-px)) calc(${y} * var(--osrs-px))` } as React.CSSProperties) : undefined,
    /** The context for the chip's contents, so its letters move relative to the chip. */
    value,
  };
}

/** Letters that follow the text effect (relative to their chip): the "ready for" destination word. */
function Letters({ text, from }: { text: string; from: number }) {
  const { t, motion, base } = React.useContext(ChatEffect);
  if (!motion) return <>{text}</>;
  return (
    <>
      {[...text].map((c, j) => {
        const [ax, ay] = offsetAt(motion, from + j, 0, t);
        const [x, y] = [ax - base[0], ay - base[1]];
        return (
          <span key={j} className="inline-block" style={x || y ? { translate: `calc(${x} * var(--osrs-px)) calc(${y} * var(--osrs-px))` } : undefined}>
            {c}
          </span>
        );
      })}
    </>
  );
}

/** Runs the chat-effect clock while an effect is on: a colour effect recolours the headline each
 *  tick (through --hero-colour on the hero); a text effect moves the words' letters. Only the words
 *  re-render each tick, not the chips. */
function ChatEffectClock({
  hero,
  colour,
  motion,
  restColour,
  children,
}: {
  hero: React.RefObject<HTMLElement | null>;
  colour: ColourEffect | null;
  motion: MotionEffect;
  restColour: string;
  children: React.ReactNode;
}) {
  const t = useTicks(`${colour}:${motion}`, Boolean(colour || motion));
  React.useEffect(() => {
    const el = hero.current;
    if (!el) return;
    el.style.setProperty("--hero-colour", colour ? colourAt(colour, t) : restColour);
  }, [hero, colour, t, restColour]);
  const value = React.useMemo(() => ({ t, motion, base: [0, 0] as [number, number] }), [t, motion]);
  return <ChatEffect.Provider value={value}>{children}</ChatEffect.Provider>;
}

/** Words that rise in one after another; with a text effect on, each letter moves on its own.
 *  `from` is the index of the first letter in the whole headline, so the effect runs on across words. */
function Words({ text, start, from, rises = true }: { text: string; start: number; from: number; rises?: boolean }) {
  const { t, motion, base } = React.useContext(ChatEffect);
  // a chip's label with no effect on is plain text, so it keeps its place on the chip's baseline
  if (!rises && !motion) return <>{text}</>;
  let i = from;
  return (
    <>
      {text.split(" ").map((w, k) => {
        const word = (
          <span className={rises ? rise : "inline-block"} style={rises ? delay(start + k) : undefined}>
            {motion
              ? [...w].map((c, j) => {
                  // inside a chip, letters move relative to the chip, which moves itself
                  const [ax, ay] = offsetAt(motion, i++, 0, t);
                  const [x, y] = [ax - base[0], ay - base[1]];
                  return (
                    <span key={j} className="inline-block" style={x || y ? { translate: `calc(${x} * var(--osrs-px)) calc(${y} * var(--osrs-px))` } : undefined}>
                      {c}
                    </span>
                  );
                })
              : w}
          </span>
        );
        i++;
        return (
          <React.Fragment key={k}>
            {word}
            {k < text.split(" ").length - 1 || rises ? " " : null}
          </React.Fragment>
        );
      })}
    </>
  );
}

/** The centred sentence with its three live chips. */
function SentenceHeadline({ titleRef, ready, style }: { titleRef: React.Ref<HTMLHeadingElement>; ready: ReadyVariant; style: React.CSSProperties }) {
  return (
    <h1
      ref={titleRef}
      aria-labelledby="osrs-home-title-text"
      className="m-0 max-w-[1180px] p-0 font-(family-name:--hero-font) text-[length:calc(16*var(--osrs-px))] leading-[1.15] font-normal text-pretty min-[1100px]:text-balance text-(--hero-colour) transition-colors duration-200 [--osrs-px:var(--hero-px)]"
      style={style}
    >
      <Words text="Old School RuneScape's interface, traced" start={0} from={0} />
      <Chip i={5} from={41} label={<Words text="pixel for pixel," start={0} from={41} rises={false} />} tip="Every sprite is traced from the game, one SVG rectangle per run of pixels, so it stays crisp at any size.">
        <SkillChipArt />
      </Chip>{" "}
      <Words text="framed at" start={7} from={58} />
      <Chip i={9} from={68} label={<Words text="any size," start={0} from={68} rises={false} />} tip="Frames are built from the game’s own edge sprites and tile to any width or height.">
        <FrameChipArt />
      </Chip>{" "}
      <Words text="and ready for" start={11} from={78} />
      <ReadyChip i={14} variant={ready} />
    </h1>
  );
}

/** A chat effect picker: None, then the game's effect names (glow1, wave2, …). */
function EffectSelect({ label, value, onChange, options }: { label: string; value: string | null; onChange: (v: string | null) => void; options: readonly string[] }) {
  const items = { none: "None", ...Object.fromEntries(options.map((o) => [o, o])) };
  return (
    <Select value={value ?? "none"} items={items} onValueChange={(v) => onChange(v === "none" || v == null ? null : String(v))}>
      <SelectTrigger aria-label={label} style={{ width: px(132) }} />
      <SelectContent>
        {Object.entries(items).map(([v, l]) => (
          <SelectItem key={v} value={v}>
            {l}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** One row of the Controls window: the label, then its control(s) at the right. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Field density="spacious">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center justify-end gap-2.5">{children}</div>
    </Field>
  );
}

type HeroVariant = "sentence" | "overhead" | "dialogue";

export function HomeHero() {
  // the scale follows the viewport until someone touches the slider
  const [scale, setScale] = React.useState(4);
  const [colour, setColour] = React.useState<Colour>("orange");
  const [font, setFont] = React.useState<Font>("plain");
  const [shadow, setShadow] = React.useState(true);
  // the game's chat effects, as the overhead chat draws them ("glow1:wave:")
  const [colourEffect, setColourEffect] = React.useState<ColourEffect | null>(null);
  const [textEffect, setTextEffect] = React.useState<MotionEffect>(null);
  const [toast, setToast] = React.useState<string | null>(null);
  const touched = React.useRef(false);
  // which hero (?hero=) and which take on the "ready for …" badge (?ready=), while we choose
  const [hero, setHero] = React.useState<HeroVariant>("sentence");
  const [ready, setReady] = React.useState<ReadyVariant>("roll");
  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const h = q.get("hero");
    if (h === "overhead" || h === "dialogue") setHero(h);
    const v = q.get("ready");
    if (v === "pop" || v === "type" || v === "roll") setReady(v);
  }, []);
  const heroRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);

  React.useLayoutEffect(() => {
    const fit = () => {
      if (touched.current) return;
      const w = window.innerWidth;
      setScale(w < 560 ? 2 : w < 1100 ? 3 : w < 1280 ? 4 : 5);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // One scroll handler, run at most once a frame:
  // - the site header slides in once the top 48px of the hero's headline has scrolled out of view
  // - the hero's text fades away over the first half-screen (--out, 0 -> 1)
  // - the scroll cue shows only while the hero sits at the top and the next section's title is below
  //   the fold (hidden on load too, then eased in once the headline has landed)
  const [cue, setCue] = React.useState(false);
  React.useEffect(() => {
    const root = document.documentElement;
    let ready = false;
    let frame = 0;
    const update = () => {
      frame = 0;
      const title = titleRef.current;
      const next = document.querySelector("[data-home-next]");
      root.toggleAttribute("data-home-past", title ? title.getBoundingClientRect().top <= -48 : window.scrollY > 0);
      heroRef.current?.style.setProperty("--out", String(Math.min(1, window.scrollY / (window.innerHeight * 0.5))));
      // "in view" once a line of it shows: the heading starts right at the hero's bottom edge
      const nextInView = next ? next.getBoundingClientRect().top < window.innerHeight - 24 : false;
      setCue(ready && window.scrollY <= 4 && !nextInView);
    };
    const schedule = () => (frame ||= requestAnimationFrame(update));
    const t = setTimeout(() => ((ready = true), schedule()), still() ? 0 : 1400);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.removeAttribute("data-home-past");
    };
  }, [hero]);

  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const copy = () => {
    navigator.clipboard?.writeText(INSTALL).then(
      () => setToast("Install command copied."),
      () => setToast(INSTALL),
    );
  };

  const scrollPast = () => {
    const el = heroRef.current;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().bottom + window.scrollY - 64, behavior: still() ? "auto" : "smooth" });
  };

  // chips draw at half the headline's scale (rounded down) so they sit inside a line of text
  const artPx = Math.max(1, Math.floor(scale / 2));
  const titleStyle: React.CSSProperties = {
    textShadow: shadow ? "var(--osrs-px) var(--osrs-px) 0 #000" : "none",
    // a colour effect steps its colours, as the game does, rather than easing between them
    transition: colourEffect ? "none" : undefined,
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger
        ref={heroRef}
        render={<section />}
        className={cx(
          "osrs relative isolate flex flex-col items-center justify-center gap-7 overflow-clip text-center select-text min-[1100px]:gap-9",
          // edge to edge of the main column, padding included, and a viewport tall
          "-mt-7 mb-0 min-h-[calc(100svh-12px)] w-[calc(100cqw+2*var(--main-pad))] mx-[calc(50%-50cqw-var(--main-pad))] px-(--main-pad) pt-16 pb-[72px] min-[1100px]:pt-[72px]",
          // a big, soft warm glow behind the headline
          "before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:bg-[radial-gradient(ellipse_60%_52%_at_50%_50%,rgb(255_196_120/.11),rgb(255_170_80/.04)_45%,transparent_72%)] before:content-[''] motion-safe:before:animate-[osrs-home-fade_1.2s_both]",
          hero === "dialogue" && "items-stretch text-start",
        )}
        style={
          {
            ["--hero-px"]: `${scale}px`,
            ["--art-px"]: `${artPx}px`,
            ["--hero-colour"]: COLOURS[colour].value,
            ["--hero-font"]: FONTS[font].value,
          } as React.CSSProperties
        }
      >
        {/* full colour, about 1.39x native size, 80px from the top; nudged 3px left because the mark
            reads a little right of centre. Scrolling away, it fades and drifts up with the headline. */}
        {hero !== "dialogue" ? (
          <LogoMark
            scale={null}
            className="absolute top-14 left-1/2 block h-[69px] w-[136px] min-[560px]:h-[96px] min-[560px]:w-[189px] translate-x-[calc(-50%-3px)] opacity-[calc(1-var(--out,0))] motion-safe:translate-y-[calc(var(--out,0)*-48px)] motion-safe:animate-[osrs-home-rise_.8s_cubic-bezier(.2,.8,.2,1)_both] min-[1100px]:top-20"
          />
        ) : null}

        {/* the heading's name is the plain sentence, not its controls' labels */}
        <span id="osrs-home-title-text" hidden>
          Old School RuneScape&apos;s interface, traced pixel for pixel, framed at any size, and ready for React, videos and RuneLite.
        </span>
        <div className="relative flex w-full justify-center opacity-[calc(1-var(--out,0))] motion-safe:translate-y-[calc(var(--out,0)*-72px)]">
          {hero === "overhead" ? (
            <OverheadHeadline titleRef={titleRef} />
          ) : hero === "dialogue" ? (
            <DialogueHeadline titleRef={titleRef} onInstall={scrollPast} />
          ) : (
            <ChatEffectClock hero={heroRef} colour={colourEffect} motion={textEffect} restColour={COLOURS[colour].value}>
              <SentenceHeadline titleRef={titleRef} ready={ready} style={titleStyle} />
            </ChatEffectClock>
          )}
        </div>

        <div className="absolute top-3 right-3 z-5 motion-safe:animate-[osrs-home-fade_.6s_1.2s_both]" onContextMenu={(e) => e.stopPropagation()}>
          <Popover onOpenChange={(open) => play(open ? "open" : "close")}>
            <PopoverTrigger
              data-silent=""
              render={<SpriteButton sprite={buttonSprites.wrench} activeSprite={buttonSprites.wrenchHovered} aria-label="Controls" className="[--osrs-px:1px] min-[560px]:[--osrs-px:2px]" />}
            />
            <PopoverContent title="Controls" scale={1}>
          <Row label="Scale">
            <Slider
              min={2}
              max={6}
              step={1}
              value={scale}
              onValueChange={(v) => {
                touched.current = true;
                setScale(Array.isArray(v) ? v[0] : (v as number));
              }}
              // the caret sprites carry 8 transparent pixels each side: hang them out so the bar lines up
              style={{ width: px(148), marginInline: px(-8) }}
              aria-label="Scale"
            />
          </Row>
          {hero === "sentence" ? (
            <>
              <Row label="Colour">
                <ToggleGroup value={[colour]} onValueChange={(v) => v[0] && setColour(v[0] as Colour)} style={{ width: px(132) }} className="*:flex-1" aria-label="Text colour">
                  {(Object.keys(COLOURS) as Colour[]).map((c) => (
                    <ToggleGroupItem key={c} value={c} size="icon-sm" aria-label={COLOURS[c].label}>
                      <span style={{ color: COLOURS[c].value }}>Aa</span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Row>
              <Row label="Colour effect">
                <EffectSelect
                  label="Colour effect"
                  value={colourEffect}
                  onChange={(v) => setColourEffect(v as ColourEffect | null)}
                  options={COLOUR_EFFECTS.filter((e) => /\d$/.test(e))}
                />
              </Row>
              <Row label="Text effect">
                <EffectSelect label="Text effect" value={textEffect} onChange={(v) => setTextEffect(v as MotionEffect)} options={MOTION_EFFECTS} />
              </Row>
              <Row label="Font">
                <ToggleGroup value={[font]} onValueChange={(v) => v[0] && setFont(v[0] as Font)} style={{ width: px(132) }} className="*:flex-1" aria-label="Font">
                  {(Object.keys(FONTS) as Font[]).map((f) => (
                    <ToggleGroupItem key={f} value={f} size="sm">
                      {FONTS[f].label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Row>
              <Row label="Shadow">
                <Checkbox checked={shadow} onCheckedChange={(c) => setShadow(Boolean(c))} aria-label="Shadow" />
              </Row>
            </>
          ) : null}
            </PopoverContent>
          </Popover>
        </div>

        {/* Scroll cue: two yellow chevrons stepping down. Hidden, it's faded, dropped and shrunk, and
            springs back up into place. */}
        <button
          type="button"
          aria-label="Scroll to the docs"
          onClick={scrollPast}
          data-hidden={cue ? undefined : ""}
          tabIndex={cue ? 0 : -1}
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center border-0 bg-transparent p-1 leading-none transition-[opacity,translate,scale] duration-[350ms,450ms,450ms] ease-[cubic-bezier(.3,1.4,.5,1)] [--osrs-px:1px] min-[560px]:[--osrs-px:2px] *:motion-safe:animate-[osrs-home-cue_1.6s_steps(4)_infinite] hover:*:brightness-125 data-hidden:pointer-events-none data-hidden:translate-y-3.5 data-hidden:scale-70 data-hidden:opacity-0 data-hidden:duration-[200ms,250ms,250ms] data-hidden:ease-in"
        >
          <chevronSprites.yellowDownSingle />
          <chevronSprites.yellowDownSingle className="-mt-[calc(8*var(--osrs-px))] [animation-delay:.2s]" />
        </button>

        <p
          role="status"
          data-show={toast ? "" : undefined}
          className="pointer-events-none absolute bottom-[72px] left-1/2 m-0 max-w-[calc(100%-32px)] -translate-x-1/2 translate-y-2 whitespace-nowrap text-rs-yellow opacity-0 transition-[opacity,translate] duration-200 data-show:translate-y-0 data-show:opacity-100"
        >
          {toast}
        </p>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem target="OSRS UI" onClick={() => (window.location.hash = "installation")}>
          Get started
        </ContextMenuItem>
        <ContextMenuItem target="Components" onClick={() => (window.location.href = "/components")}>
          Browse
        </ContextMenuItem>
        <ContextMenuItem target="Install command" onClick={copy}>
          Copy
        </ContextMenuItem>
        <ContextMenuItem target="OSRS UI" onClick={() => setToast("Every sprite traced from the game, one SVG rectangle per run of pixels.")}>
          Examine
        </ContextMenuItem>
        <ContextMenuItem>Cancel</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
