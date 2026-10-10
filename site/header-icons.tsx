// The header's pixel icons as single SVGs in currentColor (orange at rest, white on hover via the
// text colour), each with the text's 1px black shadow. Drawn at 2x.

export const GITHUB_URL = "https://github.com/austinmrobinson/osrs-ui";

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" width={24} height={24} shapeRendering="crispEdges" className={className}>
      <path fill="#000001" d="M4 1h1v1h-1zM5 1h1v1h-1zM6 1h1v1h-1zM7 1h1v1h-1zM8 1h1v1h-1zM3 2h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM6 2h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM9 2h1v1h-1zM2 3h1v1h-1zM3 3h1v1h-1zM5 3h1v1h-1zM6 3h1v1h-1zM7 3h1v1h-1zM8 3h1v1h-1zM9 3h1v1h-1zM10 3h1v1h-1zM1 4h1v1h-1zM2 4h1v1h-1zM10 4h1v1h-1zM11 4h1v1h-1zM1 5h1v1h-1zM2 5h1v1h-1zM10 5h1v1h-1zM11 5h1v1h-1zM1 6h1v1h-1zM2 6h1v1h-1zM10 6h1v1h-1zM11 6h1v1h-1zM1 7h1v1h-1zM2 7h1v1h-1zM10 7h1v1h-1zM11 7h1v1h-1zM1 8h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM9 8h1v1h-1zM10 8h1v1h-1zM11 8h1v1h-1zM2 9h1v1h-1zM4 9h1v1h-1zM8 9h1v1h-1zM9 9h1v1h-1zM10 9h1v1h-1zM3 10h1v1h-1zM4 10h1v1h-1zM8 10h1v1h-1zM9 10h1v1h-1zM4 11h1v1h-1zM8 11h1v1h-1z" />
      <path fill="currentColor" d="M3 0h1v1h-1zM4 0h1v1h-1zM5 0h1v1h-1zM6 0h1v1h-1zM7 0h1v1h-1zM2 1h1v1h-1zM3 1h1v1h-1zM4 1h1v1h-1zM5 1h1v1h-1zM6 1h1v1h-1zM7 1h1v1h-1zM8 1h1v1h-1zM1 2h1v1h-1zM2 2h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM6 2h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM9 2h1v1h-1zM0 3h1v1h-1zM1 3h1v1h-1zM9 3h1v1h-1zM10 3h1v1h-1zM0 4h1v1h-1zM1 4h1v1h-1zM9 4h1v1h-1zM10 4h1v1h-1zM0 5h1v1h-1zM1 5h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM0 6h1v1h-1zM1 6h1v1h-1zM9 6h1v1h-1zM10 6h1v1h-1zM0 7h1v1h-1zM1 7h1v1h-1zM2 7h1v1h-1zM8 7h1v1h-1zM9 7h1v1h-1zM10 7h1v1h-1zM1 8h1v1h-1zM3 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM9 8h1v1h-1zM2 9h1v1h-1zM3 9h1v1h-1zM7 9h1v1h-1zM8 9h1v1h-1zM3 10h1v1h-1zM7 10h1v1h-1z" />
    </svg>
  );
}

/** A 12 x 12 pixel glyph drawn like the GitHub mark: the shape in currentColor over its own 1px black
 *  shadow, at 2x. Rows are strings, "#" for a pixel. */
function Glyph({ rows, className, offset = 0 }: { rows: string[]; className?: string; offset?: number }) {
  const cells = rows.flatMap((r, y) => [...r].flatMap((c, x) => (c === "#" ? [[x, y]] : [])));
  const path = (dx: number) => cells.map(([x, y]) => `M${x + dx} ${y + dx}h1v1h-1z`).join("");
  return (
    // `offset` moves the drawing right and down by whole pixels within its box (it may run past the
    // box's edge, which stays visible)
    <svg aria-hidden="true" viewBox={`${-offset} ${-offset} 12 12`} overflow="visible" width={24} height={24} shapeRendering="crispEdges" className={className}>
      <path fill="#000001" d={path(1)} />
      <path fill="currentColor" d={path(0)} />
    </svg>
  );
}

// drawn two pixels in from the top and left (one here, one by `offset`), so it sits centred in its box like the other icons
const SEARCH = [
  "...........",
  "...####....",
  "..#....#...",
  ".#......#..",
  ".#......#..",
  ".#......#..",
  ".#......#..",
  "..#....#...",
  "...######..",
  "........##.",
  ".........##",
];

/** The magnifier: a thin ring and handle. */
export function SearchIcon({ className }: { className?: string }) {
  return <Glyph rows={SEARCH} offset={1} className={className} />;
}

const SLIDERS = [
  "..##.......",
  "..##.......",
  "###########",
  "..##.......",
  "..##.......",
  "...........",
  ".......##..",
  ".......##..",
  "###########",
  ".......##..",
  ".......##..",
];

/** Two sliders, for the site's settings (sound, motion). */
export function SettingsIcon({ className }: { className?: string }) {
  return <Glyph rows={SLIDERS} className={className} />;
}
