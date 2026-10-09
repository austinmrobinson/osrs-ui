// The site's mouse cursors: our own pixel arrow (OSRS has no cursor of its own; it uses the
// system's), drawn in the game's palette at 2x with a black outline and a soft shadow, like the
// interface's text. At rest the arrow is the interface's white; over anything you can press it
// turns the gold of a highlighted option. Text fields keep the system's text cursor.
//
// Two takes while we choose, picked with ?cursor= (components/shell/Layout.astro):
//   (default)  white arrow, gold over controls
//   gold       gold arrow everywhere, brighter over controls
//   system     the system's own cursors

// O outline, L light edge, F fill, D shaded edge
const ARROW = [
  "O..........",
  "OO.........",
  "OLO........",
  "OLFO.......",
  "OLFFO......",
  "OLFFFO.....",
  "OLFFFFO....",
  "OLFFFFFO...",
  "OLFFFFFFO..",
  "OLFFFFFFDO.",
  "OLFFFFOOOOO",
  "OLFOFFO....",
  "OLO.OFDO...",
  "OO..OFDO...",
  "O....OFDO..",
  ".....OFDO..",
  "......OO...",
]

type Palette = { L: string; F: string; D: string };
export const PALETTES = {
  white: { L: "#ffffff", F: "#e8e2d2", D: "#a89f8c" },
  gold: { L: "#fff6b0", F: "#ffcc33", D: "#b87d0a" },
  brightGold: { L: "#ffffff", F: "#ffe066", D: "#d49a12" },
} satisfies Record<string, Palette>;

const S = 2; // CSS px per pixel of the drawing

function svg(p: Palette) {
  const rects: string[] = [];
  ARROW.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (c === ".") return;
      // the shadow: every pixel again, one down and right, under the drawing
      rects.unshift(`<rect x="${x + 1}" y="${y + 1}" width="1" height="1" fill="rgb(0 0 0 / .35)"/>`);
      rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${c === "O" ? "#000" : p[c as keyof Palette]}"/>`);
    }),
  );
  const w = ARROW[0].length + 1;
  const h = ARROW.length + 1;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w * S}" height="${h * S}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${rects.join("")}</svg>`;
}

/** A CSS cursor value for the arrow in a palette; the hotspot is its tip, with a system fallback. */
export const cursor = (p: Palette, fallback: "default" | "pointer") =>
  `url("data:image/svg+xml,${encodeURIComponent(svg(p))}") 0 0, ${fallback}`;

/** The cursor custom properties for <html> (read by the body's cursor classes in the page shell). */
export const CURSOR_VARS = [
  `--cursor-white:${cursor(PALETTES.white, "default")}`,
  `--cursor-gold:${cursor(PALETTES.gold, "pointer")}`,
  `--cursor-gold-rest:${cursor(PALETTES.gold, "default")}`,
  `--cursor-bright:${cursor(PALETTES.brightGold, "pointer")}`,
].join(";");

/** Reads ?cursor= once and keeps it for the visit (data-cursor on <html>). */
export const CURSOR_INIT_SCRIPT = `(()=>{try{const q=new URLSearchParams(location.search).get("cursor");if(q)sessionStorage.setItem("osrs-ui:cursor",q);const v=q||sessionStorage.getItem("osrs-ui:cursor");if(v)document.documentElement.dataset.cursor=v;}catch{}})();`;
