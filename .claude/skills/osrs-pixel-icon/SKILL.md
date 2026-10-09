---
name: osrs-pixel-icon
description: Draw a new, original pixel icon in Old School RuneScape's style (tab, item, skill, spell, prayer, map or clan-rank icon) for this repo, build it into a pixel-exact SVG React sprite, and review it. Use when a page, nav item, list row or component needs an icon the game doesn't have, or when asked to "make an icon".
---

# OSRS pixel icon

Original icons drawn to the game's sprite conventions, so they sit next to real sprites without looking out of place. Never copy or trace a Jagex sprite here; real sprites come from the asset pipeline (`sprites.config.ts`), which already covers skills, tab icons, prayers, all four spellbooks, emotes, minigames, sailing and more. Check `public/assets/manifest.json` before drawing something the game already has.

The conventions below come from `research/icon-audit.md` (about 1,380 wiki icons, 359 measured) and the ratings in `research/icon-ratings.md`. Read both first.

## Files

- `pixel-icons/<name>.txt`: the site's icons, built into `site/pixel-icons.tsx` (`pixelIcons.<camelName>`, `<Pascal>PixelIcon`).
- `pixel-icons/gallery/<name>.txt`: icons made for rating, built into `gallery/icons.generated.tsx` and shown on the Icon Ratings page.
- `scripts/build-pixel-icons.ts` builds both and writes 8x previews to `pixel-icons/.preview/` (gitignored), plus `_sheet.png` with all icons at 4x.
- Run: `npx tsx scripts/build-pixel-icons.ts`

## Source format

```
name: Recipes (a cooking pot)     # what it shows; becomes the component's doc comment
kind: tab                         # tab | item | skill | spell | prayer | rank | map | raw
outline: #7a2cc0                  # optional: override the kind's outline colour, or "none"
shadow: none                      # optional: override the kind's shadow colour, or "none"
s #f2f2ee                         # palette: one character, one colour
m #53534e
---
....s......s...
..mmmmmmmmmmm..
```

- Draw **fill and shading only**. The build adds the outline (and shadow for `tab`), centres the grid on the canvas, and fails if a character isn't in the palette.
- `.` is transparent. Keep grids rectangular-ish; trailing dots are optional.

## Icon families (measured from the real sprites)

| kind | canvas | art | outline | shadow | used for | look |
| --- | --- | --- | --- | --- | --- | --- |
| `tab` | 33 x 36 | ~20 x 20 | `#0e0e0e` | `#1c1c1c` down-right | side-panel tab stones, the site's section icons | an object, full colour, in perspective (see below) |
| `item` | 36 x 32 | up to 30 x 26 | `#000001` | none | item slots, list rows, achievements | an object, full colour, **always in the item camera's perspective** (see below) |
| `skill` | 25 x 25 | ~20 | `#000001` | none | skills | one object per skill (axe, fish, anvil) |
| `spell` | 24 x 24 | ~20 | `#000001` | none | spellbooks | a saturated symbol on a disc, ring or triangle, or a creature's head; ~6 colours. A greyed disabled twin is generated (`<name>Disabled`) |
| `prayer` | 30 x 30 | ~26 | coloured glow (set `outline:`) | none | prayer book | an object with a purple, blue or gold glow edge instead of black |
| `rank` | 13 x 13 | up to 10 x 10 | `#000001` | none | clan ranks, tiny markers | one tiny object (gem, key, crown, star); 4–5 colours; must read at 1x |
| `map` | 15 x 15 | up to 9 x 9 | disc rim | none | world map and minimap | a grey disc with a black rim (drawn for you) and one tiny symbol |
| `raw` | the grid | the grid | none | none | anything else | |

## Perspective: objects are 3D, symbols are flat

Item sprites are renders of 3D models, and every one is seen through the same camera. An icon drawn front-on, like a sticker, is the most obvious sign of a fake.

- **Item camera:** looking down about 30–40°, the object turned about 30–45° around its vertical axis. You see a top face and two sides.
  - Boxes, bars, books, chests: the top is a slanted parallelogram, the long axis runs bottom-left to top-right, and the thickness shows as a darker strip along the near edge.
  - Cups, pots, pouches, jars: the opening is an ellipse (about a third as tall as it is wide) with a darker inside; the base is a curved arc, not a flat line.
  - Long things (keys, tools, weapons): lie on the diagonal, handle or bow at the top right, at about 45°.
  - Sheets (scrolls, maps, letters): seen from above at an angle, with curled edges.
- **Shading follows the form, never a diagonal split.** The most common fake is lighting everything from the top left so every shape is light on one diagonal half and dark on the other. Real sprites don't:
  - cylinders (cups, bottles, bells): vertical bands, a highlight stripe and darker toward both edges;
  - badges (shields, stars, hearts, wings): a mostly flat face with a **bevel**, a lighter rim along the top and a darker one along the bottom;
  - gems and crystals: one tone per facet;
  - round things: a highlight spot and a darker rim all round;
  - boxes: one tone per face (top mid-light, one side dark).
  Curved surfaces can take 10–30 tones per material.
- **Tab icons** are objects in a milder perspective (top visible, turned a little).
- **Standard UI icons** (search, mail, calendar, bell, camera, briefcase, map pin) are objects too: render them in the item camera (`pixel-icons/gallery/u-*.txt`).
- **Skill, spell, prayer, map and rank icons stay flat and front-on.** They're symbols, not objects; giving them depth makes them look like items.

Don't hand-draw the perspective or the bevels. Block them out with the 3D generator. Its default "form" shading lights from the front, so surfaces darken toward every edge; the old top-left "directional" light is opt-in. For flat symbols, extrude the 2D shape with `sdBadge` (rounded edges give the bevel), view it head-on (`pitch: 0, yaw: 0`) and set `exposure` (about 0.7) so the face sits mid-ramp. Give inner surfaces (a cup's inside, a pouch's mouth) their own dark material.
- `scripts/pixel-3d.ts` ray-marches simple shapes (boxes, cylinders, lathes, tori, capsules) with the item camera.
- Scenes live in `scripts/pixel-3d-scenes.ts`.
- `npx tsx scripts/pixel-3d.ts <scene> --out pixel-icons/gallery/<file>.txt --png <preview.png>` writes a normal grid. Refine it by hand from there.

## Drawing rules

- **Outline** is 4-connected: transparent pixels directly above, below, left or right of the art. Diagonal corners stay open, which is what gives game sprites their stepped silhouette. Don't draw it yourself.
- **Light comes from above and in front**, not purely from the top left (see Perspective: shading follows the form). Each material is a ramp of 3 to 6 tones: highlight, light, mid (most of the area), dark. Shift hue slightly warmer in highlights and cooler in shadows rather than only changing brightness.
- **Palette size scales with the icon**: 4–6 colours for ranks, map symbols and spells; 10–12 for tab and skill icons; items as many as their curved surfaces need (see Perspective).
- **Saturated colours** read on the brown stone (`#3e3529`). Gold `#f2cc4a`/`#c8981e`, wood `#b67e40`→`#4c2f13`, parchment `#f6e7bd`→`#957443`, metal grey-blue, spell elements pure red / blue / green.
- **One object, drawn as itself.** A quill, not a pen nib; a chest, not a box outline. Prefer things from the game world over UI symbols.
- **Family templates carry meaning**: a disc for map locations and teleports, rings in the spellbook's colour for teleport spells, a coloured glow for prayers.
- **States are recolours**, not redrawings: disabled spells are grey and dark (generated), locked things are dimmed.
- No anti-aliasing and no semi-transparent pixels; every pixel is a palette colour.
- Separate stacked parts with a transparent gap: the outline fills it with black (see `components.txt`).

## Workflow

1. Pick the kind and the object. Decide: object (3D, item camera) or symbol (flat)? Write the palette first (3 to 6 tones per material).
2. For an object, model it as a scene in `scripts/pixel-3d-scenes.ts` and render it to a grid; for a symbol, draw the grid directly (a short script is fine for curves and diagonals). Either way, save the result as the `.txt` grid and refine it by hand; the grid is the source of truth.
3. Build, then **look at the preview**: read `pixel-icons/.preview/<name>.png` (8x) and `_sheet.png` (all icons together, to check they match in weight and size).
4. Check: readable silhouette, shading that follows the form (no diagonal light/dark split), no stray single pixels, similar visual weight to its neighbours, centred on the canvas (the build centres the drawn pixels). Fix the grid and rebuild until it reads clearly.
5. Check it in place at 1x in the browser (on a tab stone or in a list row), not only in the preview.
6. For icons made to explore a style, put them in `pixel-icons/gallery/`, rebuild the Icon Ratings page (`npx tsx scripts/build-gallery-page.ts icons`) and republish it. Read the ratings back (`ArtifactData list ratings`), record the patterns in `research/icon-ratings.md`, and fold them into this file.

## Using the icons

```tsx
import { pixelIcons } from "./pixel-icons";              // from site/*.tsx
<pixelIcons.recipes />                                   // native size x --osrs-px
<pixelIcons.recipes scale={2} />                         // or a fixed scale
```

- Section icons: `site/Sidebar.tsx` (`CONCEPTS`), drawn over the tab stone sprite.
- List rows: `<IconList>` / `<IconListItem icon="vector" title="…" label="…">…</IconListItem>` in MDX (`site/IconList.tsx`), built from the library's `List`, `ListItemMedia`, `ListItemTitle` and `ListItemDescription`.
