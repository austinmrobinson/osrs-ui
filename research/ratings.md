# Gallery ratings

Ratings of the contrived examples in `gallery/`, made on the published Gallery Ratings page and read back after each round. Each round records the scores, the patterns behind them, and what changed in the `osrs-interface` skill and the components as a result.

## Round 1 (2026-10-09)

36 examples rated: average **3.8 / 5**. Ten scored 5 (boss tracker, crafting unlocks, gravestone, group finder, loot filter, poll booth, teleport nexus, XP tracker, clan roster, skilling log: "Flawless"). Lowest: bank PIN 1, Make-X 1, clue log 2, minigame lobby 2.

### What worked
- Striped key/value lists, rich list rows (Skill Guide style), group boxes, tan and rivet windows, dropdown filters, hotkey lists. Everything that used existing, reference-checked components scored 4–5.

### What didn't, and why
| Pattern (examples) | Cause | Fix |
| --- | --- | --- |
| Check and cross don't match (bank PIN, minigame lobby, slayer task, task detail) | `StatusIcon` paired a bare green tick with a round crossed box: different shapes and sizes | `StatusIcon` now uses the matched round pair (`round_check_box_checked_green` / `round_check_box_crossed`), both 17 x 17 |
| Progress bars look flat (Barbarian Assault, diary overview, pet log, slayer task, relic picker) | coloured bars were the GE's flat fill | coloured `Progress` is now shaded (lit top rows, dark bottom row, sunken well); `flat` keeps the GE look |
| Tabs look wrong (clue log, costume room) | panel tabs were separate rounded boxes | rebuilt from the Collection Log: abutting tabs, 3px flared pillars, chamfered corners, #28251e idle / #3e3529 active, one #585040 rule under the strip |
| Selected card outline cuts across the notched corners (Slayer Rewards, title picker) | a rectangular inset outline | on the flat (notched) card the frame's own light ring turns orange |
| Mismatched or uncoloured buttons (bank PIN, minigame lobby, trade, destroy) | mixed variants in a pair; no colour for consequence | new `tone="positive"` / `"destructive"`; pairs share a variant and width |
| Weird shadow on chatbox text (Enter amount, Make-X) | `.osrs-text` drop shadow applied on parchment | no shadow on parchment text (buttons and cards placed on it keep theirs) |
| Option dialogue cramped, unnumbered (Choose an option) | | `OptionDialogue` numbers options (number keys pick) and spaces the title from them |
| Old-looking layouts (Trawler rewards, relic picker, Make-X) | bare icon-and-text rows | current interfaces use cards; Leagues screens are richer and show progress to the next tier |
| Spacing (account summary, XP lamp, deposit box) | short list floating in a tall box; labelled skill tiles with uneven gaps; inventory centred in a wide window | spread rows over the height (and `DescriptionList` rows are now 20 tall with 6 padding, vertically centred); skill choice is an icon-tile grid with equal gaps; deposit box shrunk with the inventory top-left |
| Text buttons for container actions (herb sack) | | icon tiles with the bank's sprites |
| NPC head too small | an item stood in for a chathead | chatheads are about twice an item's size |
| Farming patches wants icons | text-only status rows | crop icon on each row |

### Changes
- Components: `StatusIcon`, `Progress` (`flat`), `Tabs` panel variant, `Card` selected outline, `Button` tones, `OptionDialogue` (`numbered`), `DescriptionList` row metrics, chatbox text shadow.
- Skill (`osrs-interface`): cards over bare rows, confirm/cancel pairs, icon-tile choices, matched status marks, chatbox text, list height, chatheads.
- Gallery: all flagged examples revised; herb items added to the demo data.

## Round 2 (2026-10-09)

36 rated: average **4.3 / 5** (up from 3.8); 20 scored 5. The component fixes landed: bank PIN 1 → 5, minigame lobby 2 → 5, choose option 3 → 5, trawler rewards 3 → 5, XP lamp 3 → 5, clue log 2 → 4, slayer task, title picker, slayer rewards, trade and destroy all 5.

| Problem (examples) | Cause | Fix |
| --- | --- | --- |
| Deposit box broken (4 → 1) | the column of tiles beside the inventory overflowed the window | inventory laid out 7 x 4, quantity and deposit tiles in one row below, window sized to fit |
| Relic picker (3 → 2): bar too small, metal cards, unequal sizes | metal cards in flex rows sized by their labels | notched flat cards in an equal grid; 24px progress bar |
| Shadow still on chatbox text (Enter amount 3, Make-X 1) | the round 1 rule excluded descendants of `.osrs-framed`, and the chatbox is itself framed, so it removed nothing | no shadow on chatbox text; buttons and cards placed on it keep theirs |
| Green progress too dark (Barbarian Assault, diaries, pet log) | the shaded bar reused the GE's dark green | shaded bars use a brighter green (#1fa71f) and red; `flat` keeps the GE colours |
| Loot filter: "Reset to default should use the other style button" (5 → 3) | a tile button used as a text action | metal button |
| XP tracker: scrollbar border looks wrong on some | not yet investigated | open |

Lessons for the skill: size a window to its contents after laying it out (nothing may overflow); use equal grids for card rows; tiles are for toggles and icons, metal buttons for text actions.
