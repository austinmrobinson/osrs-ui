# Icon ratings

Ratings of the original icons in `pixel-icons/gallery/`, made on the published Icon Ratings page and read back after each round. Each round records the scores, the patterns behind them, and what changed in the `osrs-pixel-icon` skill and the build as a result.

## Round 1 (2026-10-09)

Not rated on the page yet. Direct feedback instead: **"we're not doing perspective correctly"**. The coin pouch was the example: the real sprite conveys 3D, ours doesn't. Some icons call for depth and others don't.

### Finding
Comparing 24 real item sprites (`reference/items`):
- Items are renders of 3D models through one camera: from above at 30–40°, turned 30–45°.
- Faces are flat-shaded; curves are smoothly shaded (the gold bar uses 6 colours, the tankard 54, the looting bag 52).
- Outline is `#000001` and there's no drop shadow.
- Our item icons were front-on stickers with 3-tone ramps.

### Changes
- **3D generator:** a small ray-marching renderer (`scripts/lib/pixel-3d.ts`, scenes in `scripts/pixel-3d-scenes.ts`, CLI `scripts/pixel-3d.ts`) blocks out objects in that camera and writes ordinary `.txt` grids.
- **Re-rendered:** the five gallery items (coin pouch, hourglass, key, padlock, trophy) and the quest-journal tab icon.
- **Skill (`osrs-pixel-icon`):** new Perspective section, covering objects in 3D vs symbols kept flat, the per-shape rules, shading and palette size.

## Round 1 ratings (2026-10-09)

32 of 36 scored: average **2.9 / 5**. Item icons rendered in 3D scored best (key 5, the other four 4; trophy "so cool"); tab icons did well (trading scales 5, pets and sailing 4). Map icons, spells and the hand-drawn prayers and skills scored worst.

| Pattern | Examples | Fix |
| --- | --- | --- |
| **"Doing this 45 degree shading too often"** | mystic ward ("would think this would have a bevel"), steady hand, warding, the diagonal-split icons generally | Real icons shade by form, not by a diagonal split: cylinders in vertical bands, badges (shields, stars, hearts) flat with a bevelled rim, gems by facet, round things with a highlight spot and dark rim. The renderer's default is now "form" shading (frontal light, edges darken all round, a small highlight), and a new `sdBadge` extrudes 2D shapes with rounded edges so flat symbols get a real bevel. Mystic ward, iron skin and warding were redone this way |
| Not centred | all six map icons, warding, teleport, scales | build bug: centring measured the grid including blank `.` columns. It now centres the drawn pixels |
| Interiors / openings | coin pouch ("expect a darker semicircle opening"), trophy ("inside should be more consistently dark") | the renderer gives inner surfaces their own dark material |
| Proportions | hourglass too tall, padlock shackle too short, trophy handle disconnected | fixed in the scenes |
| Weak subjects | bank (didn't make sense), general store (a sack), rapid harvest, steady hand, shamanism, flame lance, gust ("awful") | not redrawn yet; map symbols need a clearer subject (a coin stack for a bank, a shop sign), and prayers that are objects (a hand) want perspective |
| Small details | quest marker dot too small, crown should be gold for a clearer point, rank star squished, sword blade misaligned and handle short, paw toes need separation, ship's wheel spokes | not yet fixed |
| Tab book lacked dimension | quest journal | thicker book, steeper view, raised emblem |

New this round: seven standard UI icons (map pin, search, mail, calendar, bell, camera, briefcase), all as objects in the item camera with form shading.
