// Pixel icons for the places the library is used, drawn as character maps (one character per game
// pixel, "." is empty) and rendered as merged SVG runs like the generated sprites. The home hero's
// "ready for …" badge cycles through them: React (site/react-icon.tsx), video edits, and RuneLite
// plugins (on the roadmap).
import * as React from "react";

type Palette = Record<string, string>;

function PixelArt({ rows, palette, className, label }: { rows: string[]; palette: Palette; className?: string; label?: string }) {
  const w = Math.max(...rows.map((r) => r.length));
  const h = rows.length;
  const paths: Record<string, string> = {};
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (!palette[c]) {
        x++;
        continue;
      }
      const s = x;
      while (x < row.length && row[x] === c) x++;
      paths[c] = (paths[c] ?? "") + `M${s} ${y}h${x - s}v1h-${x - s}z`;
    }
  });
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      className={["osrs-icon", className].filter(Boolean).join(" ")}
      style={{ width: `calc(${w} * var(--osrs-px, 1px))`, height: `calc(${h} * var(--osrs-px, 1px))` }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {Object.entries(paths).map(([c, d]) => (
        <path key={c} fill={palette[c]} d={d} />
      ))}
    </svg>
  );
}

/** A clapperboard: striped clapper on a slate, with the game icons' black outline and drop shadow. */
const CLAPPER = [
  "..........................",
  ".KKKKKKKKKKKKKKKKKKKKKKKK.",
  ".KWWWWKKKKWWWWKKKKWWWWKKKs",
  ".KKWWWWKKKKWWWWKKKKWWWWKKs",
  ".KKKKKKKKKKKKKKKKKKKKKKKKs",
  "..sssssssssssssssssssssssss",
  ".KKKKKKKKKKKKKKKKKKKKKKKK.",
  ".KWWWWKKKKWWWWKKKKWWWWKKKs",
  ".KKKKKKKKKKKKKKKKKKKKKKKKs",
  ".KDDDDDDDDDDDDDDDDDDDDDDKs",
  ".KDLLLLLLLLLLLLLLLLLLLDDKs",
  ".KDDDDDDDDDDDDDDDDDDDDDDKs",
  ".KDLLLLLLLLLLDDDLLLLLDDDKs",
  ".KDDDDDDDDDDDDDDDDDDDDDDKs",
  ".KDLLLLLLDDDDDDDDDDDDDDDKs",
  ".KDDDDDDDDDDDDDDDDDDDDDDKs",
  ".KDDDDDDDDDDDDDDDDDDDDDDKs",
  ".KKKKKKKKKKKKKKKKKKKKKKKKs",
  "..sssssssssssssssssssssssss",
];
const CLAPPER_COLOURS: Palette = { K: "#000001", W: "#e8e4d8", D: "#3b3833", L: "#9a958a", s: "rgb(0 0 0 / .45)" };

/** A plugin piece (RuneLite plugins): a puzzle tile in the interface's stone and orange. */
const PLUGIN = [
  "........KKKK..........",
  ".......KOOOOK.........",
  ".......KOOOOKs........",
  ".KKKKKKKOOOOKKKKKKK...",
  ".KYYYYYYOOOOYYYYYYKs..",
  ".KYOOOOOOOOOOOOOODKs..",
  ".KYOOOOOOOOOOOOOODKKKK",
  ".KYOOOOOOOOOOOOOOOOOOK",
  ".KYOOOOOOOOOOOOOOOOOOKs",
  ".KYOOOOOOOOOOOOOOOOOOKs",
  ".KYOOOOOOOOOOOOOODKKKKs",
  ".KYOOOOOOOOOOOOOODKsss",
  ".KYOOOOOOOOOOOOOODKs..",
  ".KYOOOOOOOOOOOOOODKs..",
  ".KYOOOOOOOOOOOOOODKs..",
  ".KDDDDDDDDDDDDDDDDKs..",
  ".KKKKKKKKKKKKKKKKKKs..",
  "..ssssssssssssssssss..",
];
const PLUGIN_COLOURS: Palette = { K: "#000001", O: "#ff981f", Y: "#ffc56b", D: "#b5650d", s: "rgb(0 0 0 / .45)" };

export function ClapperIcon(props: { className?: string; label?: string }) {
  return <PixelArt rows={CLAPPER} palette={CLAPPER_COLOURS} {...props} />;
}

export function PluginIcon(props: { className?: string; label?: string }) {
  return <PixelArt rows={PLUGIN} palette={PLUGIN_COLOURS} {...props} />;
}
