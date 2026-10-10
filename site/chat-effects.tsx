"use client";

// The game's overhead chat effects (glow1:, wave:, shake: …): the client clock, each colour effect's
// colour at a tick and each motion effect's per-letter offset. Used by the home hero's Controls and
// the share cards (site/og/OgImages.tsx).
import * as React from "react";


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
