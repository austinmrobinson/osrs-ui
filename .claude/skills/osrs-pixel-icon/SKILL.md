---
name: osrs-pixel-icon
description: Draw a new, original pixel icon in Old School RuneScape's style (side-panel tab icon or item icon) for this repo, build it into a pixel-exact SVG React sprite, and review it. Use when a page, nav item, list row or component needs an icon the game doesn't have, or when asked to "make an icon".
---

# OSRS pixel icon

Original icons drawn to the game's sprite conventions, so they sit next to real sprites without looking out of place. Never copy or trace a Jagex sprite here; real sprites come from the asset pipeline (`sprites.config.ts`).

## Files

- `pixel-icons/<name>.txt`: the source, one icon per file (format below). This is what you edit.
- `scripts/build-pixel-icons.ts`: builds every source into `site/pixel-icons.tsx` (`pixelIcons.<camelName>`, `<Pascal>PixelIcon`) and writes 8x previews to `pixel-icons/.preview/` (gitignored), plus `_sheet.png` with all icons at 4x.
- Run: `npx tsx scripts/build-pixel-icons.ts`

## Source format

```
name: Recipes (a cooking pot)     # what it shows; becomes the component's doc comment
kind: tab                         # tab | item | raw
s #f2f2ee                         # palette: one character, one colour
m #53534e
---
....s......s...
..mmmmmmmmmmm..
```

- Draw **fill and shading only**. The build adds the outline (and shadow for `tab`), centres the grid on the canvas, and fails if a character isn't in the palette.
- `.` is transparent. Keep grids rectangular-ish; trailing dots are optional.

## Game conventions (measured from the real sprites)

| kind | canvas | art size | outline | shadow | used for |
| --- | --- | --- | --- | --- | --- |
| `tab` | 33 x 36 | about 20 x 20, at most 22 x 24 | `#0e0e0e`, 1px | `#1c1c1c`, 1px down-right | side-panel tab stones, the site's section icons |
| `item` | 36 x 32 | at most 30 x 26 | `#000001`, 1px | none | inventory / list / Skill Guide rows |
| `raw` | the grid | the grid | none | none | glyphs that bring their own edges |

- **Outline** is 4-connected: transparent pixels directly above, below, left or right of the art. Diagonal corners stay open, which is what gives game sprites their stepped silhouette. Don't draw it yourself.
- **Light comes from the top-left.** Each material is a ramp of 3 to 5 tones: highlight (top/left edges, catch-lights), light, mid (most of the area), dark (bottom/right edges, under overhangs). Shift hue slightly warmer in highlights and cooler in shadows rather than only changing brightness.
- **Saturated, readable colours** against the brown interface stone (`#3e3529`): avoid mid-browns for the main shape unless it has a strong highlight; metal is grey-blue, gold is `#f2cc4a`/`#b48e1c`, wood `#b67e40`→`#4c2f13`, parchment `#f6e7bd`→`#957443`, green arrows `#6af07a`/`#26a834`.
- **One idea per icon**, recognisable at 1x. Prefer an object from the game world (scroll, chest, pot, quill, pouch) over abstract UI symbols.
- No anti-aliasing and no semi-transparent pixels; every pixel is a palette colour.
- Separate stacked parts with a transparent gap: the outline fills it with black (see `components.txt`).

## Workflow

1. Pick the kind and the object. Write the palette first (3 to 5 tones per material).
2. Draw the grid. For curves and diagonals (glass rims, quills), it's fine to generate a first pass with a short script, but save the result as the `.txt` grid and refine it by hand; the grid is the source of truth.
3. Build, then **look at the preview**: read `pixel-icons/.preview/<name>.png` (8x) and `_sheet.png` (all icons together, to check they match in weight and size).
4. Check: readable silhouette, light top-left, no stray single pixels, similar visual weight to its neighbours, centred on the canvas. Fix the grid and rebuild until it reads clearly.
5. Check it in place at 1x in the browser (on a tab stone or in a list row), not only in the preview.

## Using the icons

```tsx
import { pixelIcons } from "./pixel-icons";              // from site/*.tsx
<pixelIcons.recipes />                                   // native size x --osrs-px
<pixelIcons.recipes scale={2} />                         // or a fixed scale
```

- Section icons: `site/Sidebar.tsx` (`CONCEPTS`), drawn over the tab stone sprite.
- List rows: `<IconList>` / `<IconListItem icon="vector" title="…" label="…">…</IconListItem>` in MDX (`site/IconList.tsx`), built from the library's `List`, `ListItemIcon`, `ListItemTitle` and `ListItemDetail`.
