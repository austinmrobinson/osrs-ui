// Keyboard key glyphs drawn as game pixels (like the section links' chevron): ⌘ command, ⌥ option,
// ⌃ control, ⇧ shift and the Windows key, in white for the shortcut chips (site/Search.tsx).
import * as React from "react";

const GLYPHS = {
  command: [
    ".##...##.",
    "#..#.#..#",
    "#..#.#..#",
    ".#######.",
    "...#.#...",
    ".#######.",
    "#..#.#..#",
    "#..#.#..#",
    ".##...##.",
  ],
  option: [
    "###..####",
    "...#.....",
    "....#....",
    ".....#...",
    "......###",
  ],
  control: [
    "...#...",
    "..#.#..",
    ".#...#.",
    "#.....#",
  ],
  shift: [
    "...#...",
    "..#.#..",
    ".#...#.",
    "##...##",
    ".#...#.",
    ".#...#.",
    ".#####.",
  ],
  windows: [
    "###.###",
    "###.###",
    "###.###",
    ".......",
    "###.###",
    "###.###",
    "###.###",
  ],
} as const;
export type KeyGlyph = keyof typeof GLYPHS;

/** One key glyph at 1 CSS px per game pixel, in the current text colour. */
export function KeyIcon({ glyph, label }: { glyph: KeyGlyph; label: string }) {
  const rows = GLYPHS[glyph];
  const w = rows[0].length, h = rows.length;
  const d = rows.flatMap((r, y) => [...r].map((c, x) => (c === "#" ? `M${x} ${y}h1v1h-1z` : ""))).join("");
  return (
    <svg role="img" aria-label={label} width={w} height={h} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" className="block">
      <path fill="currentColor" d={d} />
    </svg>
  );
}
