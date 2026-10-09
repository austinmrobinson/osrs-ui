# OSRS interface icon audit

Source: [Category:Icons](https://oldschool.runescape.wiki/w/Category:Icons) on the OSRS Wiki and its 11 subcategories, listed in full through the API (about 1,380 files). A sample of up to 40 per category (newest 20 plus 20 at random, 359 in total) was downloaded to `reference/wiki/icons/` (gitignored) and measured with `scripts/icon-audit.ts`, which reports outline colour, palette size, shadows and padding per category and writes a 3x contact sheet of each.

## 1. Measured conventions

| Family | Wiki category | Size | Colours | Outline | Notes |
| --- | --- | --- | --- | --- | --- |
| **Spells** | Spell icons (485) | about 24 x 24 (7–30) | ~6 | `#000001` | Saturated symbol on a disc, ring or triangle (teleports: concentric rings in the book's colour; standard: elemental shapes); monster heads; letters for destinations. Every spell has a greyed, darkened **disabled** twin |
| **Prayers** | Prayer icons (122) | 24–30 | ~12 | `#000001`, often a **coloured glow** (purple, blue, gold) | Objects (eye, shield, wings, heart, fist); offensive prayers sit on a tan disc; the active state adds a soft disc behind |
| **Skills** | Skill icons (48) | 16–25 | ~10 | `#000001` | One object per skill (axe, fish, anvil, fist, heart); full colour; no shadow |
| **Tab icons** | (in our sprites) | 33 x 36 canvas, ~22 art | ~12 | `#0e0e0e` | Plus a `#1c1c1c` drop shadow down-right |
| **Map icons** | Map icons (247) | 15 x 15 (some 6–12) | ~7 | `#000001` rim | A light grey disc with a black rim and one tiny symbol (shop, bank, altar, anvil); terrain marks (trees, rocks, flowers) have no disc or outline |
| **Clan ranks** | Clan rank icons (270) | 11–13 | ~5 | `#000000` / `#000001` | One tiny object: gem, key, crown, hat, boot, heart; must read at 1x |
| **Minigame badges** | Minigame icons (21) | 54–60 | ~11 | `#000001` | Greyscale emblem on a wooden heater shield with a silver rim |
| **Clan motifs** | Clan motif symbols (27) | ~50 x 56 | ~4 | `#000001` | Monochrome greyscale emblems, made to be tinted |
| **Equipment slots** | Equipment slot icons (11) | 36 x 36 | ~11 | `#2d2b24` line art | Empty-slot silhouettes in dark line on the grey stone tile |
| **Emotes** | Emote icon images (68) | ~24 x 46 | ~27 | `#000001` | A full figure doing the emote; a **locked** variant |
| **Flags** | Server flag icons (28) | 30 x 15 | ~10 | none | Country flags |

Across every family: **no anti-aliasing and no semi-transparent pixels**, the art is cropped tight (the wiki files have 0 padding; the game centres them on fixed canvases), and light comes from the top left.

## 2. Coverage

| Family | Library |
| --- | --- |
| Skills, tab icons, prayers, equipment slots, combat styles, bank, orbs, stats | had them (pixel-exact sprites) |
| **Spellbooks** (standard, Ancient, Lunar, Arceuus: 372 incl. disabled) | **added** (`spell-*-sprites`) |
| **Emotes** (102 incl. locked) | **added** (`emote-sprites`) |
| **Minigame teleports** (25) | **added** (`minigame-sprites`) |
| **Sailing** (62) | **added** (`sailing-sprites`) |
| Map icons, clan ranks, clan motifs, minigame shields, flags | not in the resource pack; original ones can be drawn with the `osrs-pixel-icon` skill (`map`, `rank` kinds) |

The asset pipeline now converts 1,124 sprites, all verified pixel-identical (`pnpm verify:pixels`).

## 3. What makes an icon look like OSRS

1. **One object, drawn as itself**, not an abstract glyph: a quill, not a pen nib; a chest, not a box outline.
2. **A 1px near-black outline** around the silhouette, touching only orthogonally (diagonal corners stay open, so curves step). Prayers may swap it for a coloured glow.
3. **Small palettes**: 4–6 colours for tiny icons (ranks, spells), 10–12 for larger ones. Each material is a 3–5 step ramp, lighter at the top left.
4. **High saturation** against the brown stone: pure-ish reds, greens, blues and golds; browns only with strong highlights.
5. **Family templates** carry meaning: a disc for map locations and teleports, a triangle for some spells, a shield for minigames, a tan disc for offensive prayers.
6. **States are recolours**, not new drawings: disabled spells are grey and dark, locked emotes are dimmed, active prayers gain a backing.
