"use client";

// Two other takes on the home hero's headline (site/HomeHero.tsx, ?hero=overhead|dialogue), each
// built from something only this game has, rather than a sentence with chips:
//   overhead  the headline is overhead chat: yellow Bold 12 over the scene, moved by the game's own
//             chat effects (wave:, shake:, slide:, glow1: …). The chatbox under it is live: type a
//             line, add effects the way players do ("glow1:wave:hello"), press Enter.
//   dialogue  left-aligned: the headline, then an NPC dialogue that talks you through the kit and
//             ends on a "Select an Option" menu that takes you to the docs.
import * as React from "react";

import { Chatbox, ChatMessage, NpcDialogue, OptionDialogue } from "@/registry/osrs/ui/chatbox";
import { LogoMark } from "./Logo";

const reduced = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.hasAttribute("data-still"));

/** The game's client clock: one tick every 20ms, counted from when `key` last changed. Holds at 0
 *  while motion is off. */
export function useTicks(key: unknown, enabled = true) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    setT(0);
    if (!enabled || reduced()) return;
    const start = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      // the first frame can be stamped a moment before `start`
      setT(Math.max(0, Math.floor((now - start) / 20)));
      frame = requestAnimationFrame(step);
    });
    // Motion turned off in the header stops the clock where it is
    const prefs = () => reduced() && cancelAnimationFrame(frame);
    window.addEventListener("osrs-ui:prefs", prefs);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("osrs-ui:prefs", prefs);
    };
  }, [key, enabled]);
  return t;
}

/* ---------- Overhead chat ---------- */

export const COLOUR_EFFECTS = ["yellow", "red", "green", "cyan", "purple", "white", "flash1", "flash2", "flash3", "glow1", "glow2", "glow3"] as const;
export const MOTION_EFFECTS = ["wave", "wave2", "shake", "scroll", "slide"] as const;
export type ColourEffect = (typeof COLOUR_EFFECTS)[number];
export type MotionEffect = (typeof MOTION_EFFECTS)[number] | null;

const FIXED: Partial<Record<ColourEffect, string>> = {
  yellow: "#ffff00",
  red: "#ff0000",
  green: "#00ff00",
  cyan: "#00ffff",
  purple: "#ff00ff",
  white: "#ffffff",
};

const mix = (a: number[], b: number[], f: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * f)).join(" ")})`;
const ramp = (stops: number[][], t: number) => {
  const p = (t % (stops.length * 50)) / 50;
  const i = Math.floor(p);
  return mix(stops[i], stops[(i + 1) % stops.length], p - i);
};

/** The colour of the whole line at tick t, as the client draws each effect. */
export function colourAt(effect: ColourEffect, t: number) {
  if (FIXED[effect]) return FIXED[effect];
  const on = Math.floor(t / 20) % 2 === 0;
  switch (effect) {
    case "flash1":
      return on ? "#ff0000" : "#ffff00";
    case "flash2":
      return on ? "#0000ff" : "#00ffff";
    case "flash3":
      return on ? "#00b000" : "#80ff80";
    case "glow1":
      return ramp([[255, 0, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255]], t);
    case "glow2":
      return ramp([[255, 0, 0], [255, 0, 255], [0, 0, 255]], t);
    default:
      return ramp([[255, 255, 255], [0, 255, 0], [0, 255, 255]], t);
  }
}

/** One character's offset in game pixels at tick t (i: its index, n: the line's length). */
export function offsetAt(effect: MotionEffect, i: number, n: number, t: number): [number, number] {
  switch (effect) {
    case "wave":
      return [0, Math.round(Math.sin(i / 2 + t / 5) * 2)];
    case "wave2":
      return [Math.round(Math.sin(i / 5 + t / 5) * 4), Math.round(Math.sin(i / 3 + t / 5) * 3)];
    case "shake": {
      // a hard shake that settles over the first second and a half, then again every five
      const k = t % 250;
      const amp = Math.max(0, 1 - k / 75) * 5;
      return [0, Math.round(Math.sin(i / 1.5 + k) * amp)];
    }
    case "slide": {
      // drops into place, holds, and lifts away
      const k = t % 300;
      const y = k < 25 ? -(25 - k) : k > 270 ? -(k - 270) : 0;
      return [0, y];
    }
    case "scroll": {
      // the line scrolls in from the right, holds, and goes on to the left
      const k = t % 300;
      const x = k < 40 ? (40 - k) * 8 : k > 260 ? -(k - 260) * 8 : 0;
      return [x, 0];
    }
    default:
      return [0, 0];
  }
}

/** Reads the game's chat effect prefixes off the front of a line: "glow1:wave:hello". */
function parse(line: string): { colour: ColourEffect; motion: MotionEffect; text: string } {
  let colour: ColourEffect = "yellow";
  let motion: MotionEffect = null;
  let text = line;
  for (;;) {
    const m = text.match(/^([a-z0-9]+):/i);
    const name = m?.[1].toLowerCase();
    if (name && (COLOUR_EFFECTS as readonly string[]).includes(name)) colour = name as ColourEffect;
    else if (name && (MOTION_EFFECTS as readonly string[]).includes(name)) motion = name as MotionEffect;
    else break;
    text = text.slice(m![0].length);
  }
  return { colour, motion, text: text.trim() };
}

const DEFAULT_LINE = "wave:Old School RuneScape's interface, traced pixel for pixel.";

/** The effect pickers in the chatbox: chat-coloured words that set that part of the prefix. */
function EffectLinks({ label, items, current, onPick }: { label: string; items: readonly string[]; current: string | null; onPick: (v: string) => void }) {
  return (
    <ChatMessage name={label} className="flex flex-wrap gap-x-[calc(4*var(--osrs-px))]">
      {items.map((e) => (
        <button
          key={e}
          type="button"
          onClick={() => onPick(e)}
          aria-pressed={e === current}
          className="cursor-pointer border-0 bg-transparent p-0 text-[#0000ff] hover:text-white aria-pressed:text-[#800000]"
        >
          {e}
        </button>
      ))}
    </ChatMessage>
  );
}

export function OverheadHeadline({ titleRef }: { titleRef: React.Ref<HTMLHeadingElement> }) {
  const [line, setLine] = React.useState(DEFAULT_LINE);
  const [draft, setDraft] = React.useState("");
  const { colour, motion, text } = parse(line);
  const t = useTicks(line);
  const fill = colourAt(colour, t);

  const setPart = (kind: "colour" | "motion", value: string) => {
    const next = kind === "colour" ? { colour: value as ColourEffect, motion } : { colour, motion: value as MotionEffect };
    const prefix = `${next.colour === "yellow" ? "" : `${next.colour}:`}${next.motion ? `${next.motion}:` : ""}`;
    setLine(prefix + text);
  };

  // characters keep their words together so the line wraps between words, like the game's own
  // (each space counts as a character, so the wave runs on across it)
  let index = 0;
  const words = text.split(" ").map((w) => {
    const chars = [...w].map((c) => ({ c, i: index++ }));
    index++;
    return chars;
  });

  return (
    <div className="flex w-full flex-col items-center gap-10 min-[1100px]:gap-14">
      <h1
        ref={titleRef}
        aria-labelledby="osrs-home-title-text"
        className="m-0 max-w-[1180px] p-0 font-rs-bold text-[length:calc(16*var(--osrs-px))] leading-[1.25] font-normal text-balance [--osrs-px:var(--hero-px)]"
        style={{ color: fill, textShadow: "var(--osrs-px) var(--osrs-px) 0 #000" }}
      >
        {words.map((chars, w) => (
          <React.Fragment key={w}>
            <span className="inline-block whitespace-nowrap">
              {chars.map(({ c, i }) => {
                const [x, y] = offsetAt(motion, i, index, t);
                return (
                  <span key={i} className="inline-block" style={x || y ? { translate: `calc(${x} * var(--osrs-px)) calc(${y} * var(--osrs-px))` } : undefined}>
                    {c}
                  </span>
                );
              })}
            </span>{" "}
          </React.Fragment>
        ))}
      </h1>

      <Chatbox
        size="fit"
        className="flex max-w-[calc(519*var(--osrs-px))] flex-col justify-end gap-[calc(1*var(--osrs-px))] p-[calc(9*var(--osrs-px))_calc(12*var(--osrs-px))] text-start [--osrs-px:1px] min-[1100px]:[--osrs-px:2px]"
      >
        <ChatMessage>Welcome to OSRS UI. Type a message and press Enter.</ChatMessage>
        <EffectLinks label="Colour" items={COLOUR_EFFECTS} current={colour} onPick={(v) => setPart("colour", v)} />
        <EffectLinks label="Effect" items={MOTION_EFFECTS} current={motion} onPick={(v) => setPart("motion", v)} />
        <ChatMessage color="#7f0000">Or type them yourself, like the game: glow1:wave:Buying gf</ChatMessage>
        <form
          className="osrs-text osrs-text-plain flex items-baseline gap-[calc(4*var(--osrs-px))] border-t border-black/20 pt-[calc(2*var(--osrs-px))]"
          onSubmit={(e) => {
            e.preventDefault();
            if (parse(draft).text) setLine(draft);
            setDraft("");
          }}
        >
          <label htmlFor="osrs-home-chat" className="text-black">
            You:
          </label>
          <input
            id="osrs-home-chat"
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, 80))}
            placeholder="Press Enter to Chat..."
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[#0000ff] caret-[#0000ff] placeholder:text-[#0000ff]/70"
          />
        </form>
      </Chatbox>
    </div>
  );
}

/* ---------- NPC dialogue ---------- */

const LINES = [
  "Welcome, adventurer. Every sprite in this kit is traced from the game, pixel for pixel.",
  "The frames tile to any size, and all of it installs with shadcn: React, Base UI and Tailwind.",
];

export function DialogueHeadline({ titleRef, onInstall }: { titleRef: React.Ref<HTMLHeadingElement>; onInstall: () => void }) {
  const [step, setStep] = React.useState(0);
  const options = [
    { label: "Show me the components.", go: () => (window.location.href = "/components") },
    { label: "How do I install it?", go: () => (setStep(0), onInstall()) },
    { label: "Can I download the assets?", go: () => (window.location.href = "/assets") },
    { label: "Never mind.", go: () => setStep(0) },
  ];
  return (
    <div className="mx-auto flex w-full max-w-[1038px] flex-col gap-10 min-[1100px]:gap-12">
      <div className="flex flex-col items-start gap-6">
        <LogoMark scale={1} className="motion-safe:animate-[osrs-home-rise_.8s_cubic-bezier(.2,.8,.2,1)_both]" />
        <h1
          ref={titleRef}
          className="m-0 max-w-[16em] p-0 font-rs text-[length:calc(16*var(--osrs-px))] leading-[1.1] font-normal text-pretty text-rs-white [--osrs-px:min(var(--hero-px),4px)] motion-safe:animate-[osrs-home-rise_.8s_.1s_cubic-bezier(.2,.8,.2,1)_both]"
          style={{ textShadow: "var(--osrs-px) var(--osrs-px) 0 #000" }}
        >
          Old School RuneScape&apos;s interface, <span className="text-rs-orange">for the web.</span>
        </h1>
      </div>

      {/* the dialogue at 2x on wide screens, as wide as the column allows */}
      <div className="[--osrs-px:1px] motion-safe:animate-[osrs-home-rise_.8s_.35s_cubic-bezier(.2,.8,.2,1)_both] min-[1100px]:[--osrs-px:2px]" aria-live="polite">
        {step < LINES.length ? (
          <NpcDialogue
            name="OSRS UI"
            head={<LogoMark scale={null} className="h-[calc(46*var(--osrs-px))] w-[calc(90*var(--osrs-px))]" />}
            onContinue={() => setStep((s) => s + 1)}
            size="fit"
            className="min-h-[calc(142*var(--osrs-px))]"
          >
            {LINES[step]}
          </NpcDialogue>
        ) : (
          <OptionDialogue options={options.map((o) => o.label)} onSelect={(i) => options[i].go()} size="fit" className="min-h-[calc(142*var(--osrs-px))]" />
        )}
      </div>
    </div>
  );
}

