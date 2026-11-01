"use client";

// The pictures in the homepage's contents bento (HomeBelow), drawn with the library itself. One tile
// leads with motion (the Bank, a short Stageshow scene); the Accept button presses once as it scrolls
// in; the rest hold still. Each picture fills its tile's art slot and the tile clips it.
import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { prayerSprites } from "@/registry/osrs/ui/prayer-sprites";
import { skillIcons } from "@/registry/osrs/ui/skill-icons";
import { BankStage } from "./BankStage";
import { Stage } from "./stageshow/stage";
import type { Act } from "./stageshow/act";
import { cx } from "./styles";

/** The size of the element, once it has been measured on the client (0 x 0 before). */
function useSize<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setSize({ width: Math.round(e.contentRect.width), height: Math.round(e.contentRect.height) }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

/** Recipes, the hero: the Bank at the tile's own size, 2x once the tile is wide enough for it. */
export function BankArt() {
  const [ref, { width, height }] = useSize<HTMLSpanElement>();
  const scale = width >= 560 ? 2 : 1;
  return (
    <span ref={ref} className="absolute inset-0">
      {/* keyed by size, so a resize starts the scene fresh at the new layout */}
      {width ? <BankStage key={`${width}x${height}`} width={width} height={height} scale={scale} /> : null}
    </span>
  );
}

/** Components: one number at display size in the game's font, its unit right under it. */
export function StatArt({ value, unit }: { value: string; unit: string }) {
  return (
    <span className="flex h-full w-full flex-col justify-center gap-3 px-4">
      <span className="font-rs text-[length:128px] leading-[0.8] whitespace-nowrap text-rs-yellow [text-shadow:4px_4px_0_#000]">
        {value}
      </span>
      <span className="font-rs text-[length:32px] leading-none whitespace-nowrap text-rs-orange [text-shadow:2px_2px_0_#000]">
        {unit}
      </span>
    </span>
  );
}

/** Buttons: a trade screen's Accept and Decline at 2x; Accept settles into its pressed look once. */
type Pressed = { on: boolean };
async function press(a: Act<Pressed>) {
  await a.wait(900);
  a.set({ on: true });
  await a.wait(1200);
}
export function ButtonArt() {
  const [ref, { width, height }] = useSize<HTMLSpanElement>();
  return (
    <span ref={ref} className="absolute inset-0">
      {width ? (
        <Stage key={`${width}x${height}`} width={width} height={height} initial={{ on: false }} poster={{ on: true }} script={press} play="once">
          {(s) => (
            <div className="osrs absolute inset-0 flex items-center justify-center [--osrs-px:2px]" style={{ gap: 12 }}>
              <Button variant="tile" tabIndex={-1} aria-pressed={s.on}>
                Accept
              </Button>
              <Button variant="tile" tabIndex={-1}>
                Decline
              </Button>
            </div>
          )}
        </Stage>
      ) : null}
    </span>
  );
}

/** Assets: many small marks at 2x, running off the tile's right and bottom edges. */
const SKILLS = Object.values(skillIcons);
const PRAYERS = Object.entries(prayerSprites)
  .filter(([name]) => !/disabled|background|activated/i.test(name))
  .map(([, Sprite]) => Sprite);
export function CollectionArt() {
  // skills and prayers interleaved, so neighbours differ
  const marks = Array.from({ length: 40 }, (_, i) => (i % 2 ? PRAYERS[i % PRAYERS.length] : SKILLS[i % SKILLS.length]));
  return (
    <span className="absolute top-5 left-5 grid grid-cols-8 gap-x-3 gap-y-2.5" style={{ width: 8 * 64 }}>
      {marks.map((Sprite, i) => (
        <span key={i} className="flex h-13 w-13 items-center justify-center">
          <Sprite scale={2} />
        </span>
      ))}
    </span>
  );
}

/** Any size: one sprite at 1x, 2x, 3x and 4x, standing on one line, each still crisp. */
export function ScaleArt() {
  return (
    <span className="flex h-full w-full items-end gap-5 px-5 pb-6">
      {[1, 2, 3, 4].map((n) => (
        <span key={n} className="flex flex-col items-center gap-2">
          <skillIcons.attack scale={n} />
          <span className={cx("font-rs-small text-rs-orange [text-shadow:1px_1px_0_#000]")}>{n}x</span>
        </span>
      ))}
    </span>
  );
}
