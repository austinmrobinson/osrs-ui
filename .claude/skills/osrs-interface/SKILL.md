---
name: osrs-interface
description: Design and build a new Old School RuneScape style interface (a window, side-panel tab, chatbox prompt or overlay) from this repo's components, following the game's own conventions. Use when asked to make an OSRS screen, recipe, example or mock-up, or to judge whether one looks like the game.
---

# Designing an OSRS interface

Distilled from a review of about 60 current in-game interfaces (`research/interface-audit.md`), and refined by the ratings in `research/ratings.md`. Read both before starting; the ratings record what has and hasn't worked.

## 1. Pick the archetype first

| The player is… | Use | Container |
| --- | --- | --- |
| Using a system (shop, bank, log, settings, tracker, picker) | **Window** | `Window frame="rivets"` for modern systems (2024+ redesigns: bank, logs, settings); `Window frame="tan"` for the classic ones (stores, GE, most minigames) |
| Checking something always-on (prayers, friends, quests, a minigame tab) | **Side-panel tab** | content 190 x 261 inside `SidePanel` |
| Answering a prompt, choosing a quantity, talking | **Chatbox** | `Chatbox` (519 x 142) |
| Reading lore, a letter, a teleport list | **Paper** (scroll, book) | not built yet: say so, don't fake it with a window |
| Looking at a world object (puzzle, map, board) | **Bespoke art** | out of scope |

One interface, one archetype. Don't put a side-panel layout in a window or a window in the chatbox.

## 2. Size it like the game

- Windows: 480–512 wide, 300–335 tall (the bank is 488 x 335; stores 480 x 314). Small modal windows 300–350 x 200–280. Never full screen.
- Side panel content: 190 x 261. Chatbox: 519 x 142.
- Spacing is whole game pixels: 2 between tiles, 4 between rows, 6 inside boxes, 8 between groups. Use `px(n)` = `calc(n * var(--osrs-px))`.
- Item slots 36 x 32; icon buttons 26 / 36 / 44; text rows 15–18.

## 3. Lay it out

Fill the window top to bottom with these, in this order:

1. **Header** (`WindowHeader`): centred title naming the thing, or "Thing - View". Left slot: hamburger (`WindowMenu`) for views, or one small metal button / checkbox / wrench. Right slot: `WindowClose`.
2. **Instruction line** (optional): one orange centred sentence telling the player what to do.
3. **Body**, one of:
   - **Master / detail**: list or card grid on the left (about 60%), explanation panel on the right (a `FieldSet` group box or a well). Stores, paths, customisation.
   - **Card grid**: equal cards (`Card`, `selected` / `disabled`) with an icon and a 1–2 line label. Pickers.
   - **Grouped controls**: `FieldSet` group boxes side by side or stacked, each with an orange `FieldLegend`. Settings-like screens.
   - **Striped list** (`List`) with icons, hotkeys ("1:", "A:") or `ListItemDescription` lines. Teleports, logs, tasks.
   - **Key / value** (`DescriptionList`) beside art or a model. Summaries, stats.
4. **Footer**: totals (`Stat`), a quantity row (`ToggleGroup` of tiles: 1 / 5 / 10 / X / All), then the primary action on the right (`Button`, metal, "Confirm").

Fill leftover space with art (a large faded sprite, an item, a model panel), not padding. If a list is shorter than its box, spread its rows over the height (or shrink the window) rather than leaving a gap below.

**Current, not classic.** Newer interfaces put choices in cards, not bare icon-and-text rows: a points shop or reward list is a grid of `Card`s (icon, name, cost), and a Make-X prompt shows each product as a card. Use the older bare-list look only when recreating an old screen. Special event interfaces (Leagues) are richer: named cards, a progress bar for points toward the next tier, and they fill the window.

## 4. Colour and text

- **Orange** is the default for labels, titles and body text. **White** is for values, numbers and the active item. **Yellow** for quantities and highlights. **Green** for done/on, **red** for locked/off/offline. **Grey** for disabled. **Cyan** only for "you are here" in a sequence.
- Two sizes only: Plain 12 for body, Bold 12 for titles and headings. Never scale text up for emphasis; use colour, a frame or a section title.
- Numbers use the game's formats (`formatQuantity`: 100K, 10M; commas in values: 1,250 points).
- Write like the game: short, plain, title case for buttons ("Confirm", "Collect", "Show path reward"), sentence case for instructions, and name real in-game things.

## 5. Components to reach for

Components follow shadcn/ui's names and APIs wherever the game has the same thing (`Field`, `DropdownMenu`, `Toggle`, `ToggleGroup`, list parts named like shadcn's `Item`). Reach for the shadcn name first.

| Need | Component |
| --- | --- |
| Primary / secondary action | `Button` metal (orange label; `tone="white"` in logs and headers) |
| Confirm / cancel pair | two `Button`s of the **same variant and width**: `tone="positive"` (green) and `tone="destructive"` (red). A lone destructive action ("Yes, destroy", "Delete your PIN") is `tone="destructive"` |
| Quantity row, one choice pressed | `ToggleGroup` of tiles (red when pressed) |
| A single on/off tile | `Toggle` |
| Choosing a skill, a spell, a mode | a `ToggleGroup` grid of icon tiles (icon only, even gaps both ways), not labelled tiles |
| Fill / empty, deposit, sort | icon tiles (`size="icon"`, an `aria-label`) with the bank's sprites, not text buttons |
| Old-style action in a side panel | `Button variant="stone"` |
| Group of controls | `FieldSet` + `FieldLegend` (the group box) |
| Done / not done | `StatusIcon status="done" \| "failed"` (a matched pair of round boxes; never mix in a bare tick) |
| Points, totals, counts | `Stat` (boxed in a footer, inline in a line) |
| Label / value rows | `DescriptionList` |
| Selectable options | `Card selected / disabled` (the selected outline follows the notched corners), or `RadioGroup` for 2–4 choices |
| A list | `List` + `ListItem` (+ `ListItemMedia/Title/Detail` for rich rows) |
| Views inside a window | `Tabs variant="panel"` (Collection Log tabs: abutting, flared pillars, one rule under the strip) or `WindowMenu` (a `DropdownMenu`) |
| A choice in the chatbox | `OptionDialogue` (numbered options, number keys pick) |
| NPC speech | `NpcDialogue` with a chathead about twice an item's size |
| Categories down the side | `NavList` (`attached` when it opens into a panel) |
| Progress | `Progress` (`color` gives the shaded bar with a lit top and sunken well; `segments` for tiers; `flat` only for the GE and thin bars of a few pixels) |
| Items | `ItemSlot` with `quantity` |
| Scrolling content | `ScrollArea` (the game's scrollbar, always on the right) |
| Settings rows | `FieldSet variant="section"` + `Field` (`orientation="vertical"` for sliders) |
| Icons the game lacks | the `osrs-pixel-icon` skill |

If a need isn't covered, note it in `research/interface-audit.md` (section 4) before inventing chrome.

## 6. Check before calling it done

- [ ] One archetype, sized like the game, nothing full-bleed.
- [ ] Header has a real title and a close button.
- [ ] Every region sits in a frame, well or group box; no bare floating text blocks.
- [ ] Orange by default, white for values, the right semantic colour for states.
- [ ] One primary action, bottom right; destructive or rare actions not beside it.
- [ ] Paired buttons share a variant and width; green / red tones say which is which.
- [ ] Nothing overflows: size the window to its contents after laying it out, at 1x and 2x.
- [ ] Rows of cards are an equal grid, not flex items sized by their labels.
- [ ] Tiles are for toggles, quantities and icons; text actions ("Reset to default") are metal buttons.
- [ ] Status marks are the matched round pair, the same size, aligned in a column.
- [ ] Text on the parchment chatbox has no drop shadow; text on stone does.
- [ ] Two text sizes only; no centred paragraphs longer than three lines (left-align longer text in a panel).
- [ ] Copy uses real OSRS names and numbers in the game's formats.
- [ ] Looks right at 1x and 2x (`--osrs-px`).

## 7. The docs site follows it too

The site is one window (`site/site.css`, section "The osrs-interface skill, applied to the site itself"): page titles stay large (the one exception to two text sizes, by choice), sections are Settings bands, Preview / Code are Collection Log panel tabs over one darkened-stone panel (demos sit straight on it, never in a box of their own), code is a sunken well (dark fill, black inner edge top-left, light rim bottom-right), tables are striped lists in the thin tan-border frame with a band header and column rules, link cards are notched cards with an item, and callouts are group boxes. Component pages open with a playground, not a grid of every variant: one instance and a props panel whose controls are generated from the component's TypeScript props (`scripts/build-props.ts` → `site/playground/props.generated.json`; each page's render is in `site/playground/configs.tsx`). Blume's own chrome is overridden with library components wherever it shows: examples (`components/blume/Component.astro` → `site/ExampleTabs.tsx`, the library panel `Tabs`) and search (`site/Search.tsx`: a riveted Dialog, our Input and List, and a page-style preview of the highlighted result; index from `scripts/build-search.ts`). Keep new site chrome inside these rules. `site.css` is concatenated into `theme.css` by `npx tsx scripts/build-css.ts`; rebuild after editing it.

## 8. Feedback loop

Contrived examples live in `gallery/` and are rated on the published Gallery Ratings page. After a round of ratings, read them back (`ArtifactData list ratings`), record the patterns in `research/ratings.md` (what scored well, what didn't, and why), then update this skill and the components. Re-rate the changed examples next round.

- Overview cards and search previews are PNGs from `pnpm previews` (scripts/build-previews.ts, needs `pnpm dev` running). Re-run it after changing a component's playground defaults or a recipe.
