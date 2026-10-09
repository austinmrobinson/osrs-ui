# OSRS interface audit

Source: [Category:Interface images](https://oldschool.runescape.wiki/w/Category:Interface_images) on the OSRS Wiki, listed in full through the API (5,760 files; 3,083 uploaded in 2025–26). An 80-image sample was downloaded to `reference/wiki/interfaces/` (gitignored; `sample.json` has titles, sizes and dates), and about 60 were reviewed one by one, including the seven requested:

- Bounty Hunter Store, Agility Arena Store, Deadman Reward Store, Events Reward Shop (stores)
- Barracuda trial (The Tempor Tantrum), Arena tourney build picker, Bank, Advanced Options, Adventure Paths

Upload dates matter: the wiki keeps old captures, so anything from before 2024 may show retired chrome (for example the 2020 Advanced Options).

## 1. Container styles

| Style | What it looks like | Seen in | Library |
| --- | --- | --- | --- |
| **Tan window** | Thin dark border with a tan inner line, stone fill, centred Bold 12 orange title, close tile top right, optional actions top left (small metal button, wrench, checkbox, icon) | Stores, Grand Exchange, guide prices, Advanced Options, Ironman setup, equipment stats, rune pouch, Portal Nexus, Greenman mask, League summary, Boat customisation, Adventure Paths, Tempor Tantrum, Arena build | `Window frame="tan"` |
| **Rivet window** | Iron-rivet frame, hamburger menu top left, close top right, rivet divider under the title | Bank, bank settings, Collection Log, Captain's Log, makeover, direction puzzle, Combat Achievements, Settings | `Window` (default) |
| **Side-panel tab** | 190 x 261 content area inside the side panel, under tab stones; lists, small stone buttons, footer text | Friends, Quest list, Prayer, Spellbook, Audio, House options | `SidePanel` + content |
| **Chatbox** | 519 x 142 parchment box | Dialogue, Make-X, egg launcher | `Chatbox` |
| **Parchment scroll** | Torn scroll sprite, Quill or Plain text in dark brown, knot close icon top right, numbered options ("1: …", "A: …") | Max cape / spirit tree teleports, reward scrolls, contract terms, letters (tinted variants), Construction menu, signposts | missing (needs scroll sprites) |
| **Book** | Open book sprite, Quill 8 black text, page numbers, orange X, next-page arrow tile | Journals, diaries, quest books | missing (needs book sprites) |
| **Bespoke art** | Full illustration (puzzle, map, notice board, display case, slab) with a floating orange X | Puzzles, maps, notice boards, museum displays | out of scope: art, not chrome |
| **Floating menus** | Right-click menu, tooltips, orbs, XP drops, message of the week | — | `ContextMenu`, `Tooltip`, `Orb`, `XpDrop` |

Rule of thumb: **interactive systems** (stores, settings, logs, banks) use a window; **reading** (books, letters, lore) uses paper; **world objects** use their own art.

## 2. Layout patterns

1. **Title bar**: centred title; left = navigation or mode (hamburger, "History", "Detailed descriptions" checkbox, wrench); right = close. Titles name the thing, sometimes "Thing - View" ("Captain's Log - Port Tasks", "Collection Log - Overview").
2. **Instruction line** under the title: one orange centred sentence ("Select an offer slot to set up or view an offer.", "Choose a rune to make your payment.").
3. **Master / detail**: a list or grid on the left, an info panel on the right that explains the selection (every store; Adventure Paths; Boat customisation).
4. **Card grids**: equal cards with an icon and a 1–2 line orange label (store stock); selected card gets an orange outline, unavailable cards go grey (Greenman mask).
5. **Group boxes**: a bevelled inset box with an orange centred title ("Pouch", "Inventory", "Bank Fillers", "Areas", "Relics", "Masteries"). The main way the game groups controls.
6. **Striped lists** with an icon, a hotkey prefix ("1:", "A:") and an orange label (Portal Nexus, teleports).
7. **Key / value lists**: label left in orange, value right in white (League summary, equipment bonuses "Stab: +0").
8. **Footers**: a currency box (black inset, orange label, white value: "BH Points 0"), a quantity row (1 / 5 / 10 / X / All), or a summary line ("Completed: 998", "Total guide price: 301,856,410"), plus the primary action at the right ("Confirm", "Collect").
9. **Decoration**: large faded sprites or the subject's model in a dark inset panel (Arena build, makeover, equipment stats).

## 3. Colour roles

| Colour | Role |
| --- | --- |
| Orange `#ff981f` | Default label and title colour; most body text in windows |
| White | Values, numbers, selected/active item, button labels on metal |
| Yellow `#ffff00` | Item quantities, highlighted names, current world |
| Green | Done / on / positive (checks, completed quests, gains) |
| Red | Locked / off / negative / offline, and "selected" for tile buttons |
| Cyan | The current step in a sequence (Adventure Paths) |
| Grey | Disabled, unavailable, "Empty" |
| Dark brown/black | Text on paper (scrolls, books, chatbox) |

## 4. Components seen, and coverage

| Component | Seen in | Status |
| --- | --- | --- |
| Metal button (orange or white label) | Back / Show path reward, Confirm, Apply, Repeat Offer, Collect, Reset | have (`Button`) |
| Tile buttons, quantity row with selected red | Bank, bank fillers, stores (1/5/10/50), rune pouch | have; **added `ToggleGroup`** for the single-choice row |
| Stone button | Friends (Add/Del), Ironman modes, House options, Set Bonus | have (`variant="stone"`) |
| Icon tile button (equipment-metal square) | Rune selection, direction puzzle arrows, Advanced Options | have (`size="icon*"`) |
| Group box (titled inset) | Rune pouch, bank fillers, League summary, Portal Nexus | **added** as `FieldSet` + `FieldLegend` (shadcn Field API) |
| Status icon (green check / red cross) | Bank settings, Ironman notes, House options | **added `StatusIcon`** |
| Currency / value box | Store points, guide price total | **added `Stat`** |
| Key / value list | League summary, equipment bonuses | **added `DescriptionList`** |
| Selectable card (selected / disabled) | Store stock, Greenman mask, Ironman modes | **added to `Card`** (`selected`, `disabled`) |
| Dropdown | Store filters, "Tab display:" | have (`Select`) |
| Radio (grey circle / green check) | Arena build, makeover pronouns, Portal Nexus mode | have (`RadioGroup`) |
| Checkbox | Boat customisation "Detailed descriptions" | have |
| Scrollbar | everywhere | have (`ScrollArea`) |
| Progress (solid, segmented) | GE offers, Collection Log categories | have |
| Item slot with quantity | Bank, stores, rune pouch | have |
| Vertical tabs / attached nav | Boat customisation, Skill Guide | have (`NavList variant="attached"`) |
| Panel tabs | Quest list, Collection Log | have |
| Swatch picker | Makeover | missing (rare) |
| Parchment scroll, book | Teleports, letters, books | missing (needs sprites) |

## 5. What makes it look like OSRS

- **Everything is a frame on stone.** Flat colour boxes never appear; insets, bevels and sprite frames carry the structure.
- **Few, fixed sizes.** Windows are about 488 x 300 to 512 x 334; side panels 190 x 261; text rows 15–16px; item slots 36 x 32. Spacing is in whole game pixels (2, 4, 6, 8).
- **Orange is the default.** White means "value" or "active", not body text.
- **Hierarchy comes from frames and colour, not type size.** There are only two text sizes (Plain 11/12 and Bold 12); the game never scales text up for a heading.
- **Every interactive thing has a sprite state** (hover, pressed, selected, disabled), and hover rarely changes more than the label colour.
- **Density is high** and empty space is filled with art (models, faded icons), not padding.
