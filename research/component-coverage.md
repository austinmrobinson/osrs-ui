# Component coverage

Checks the screens reviewed in the interface audit (`research/interface-audit.md`, about 60 current interfaces) and the 36 gallery examples against the library. Where the game's element matches a shadcn/ui component, the library uses shadcn's name and API.

## Consolidated with shadcn/ui (2026-10-09)

| Game element | Was | Now (shadcn API) |
| --- | --- | --- |
| Group box (titled inset: Pouch, Bank Fillers, Relics) | `GroupBox` | `FieldSet` + `FieldLegend` |
| Settings section and rows (All Settings) | `SettingsSection`, `SettingRow` | `FieldSet variant="section"`, `Field` (`orientation`), `FieldContent`, `FieldLabel`, `FieldTitle`, `FieldDescription` |
| Hamburger view menu (Bank, Collection Log, Combat Achievements) | inline in `WindowMenu` | `DropdownMenu` (`WindowMenu` is now a thin wrapper) |
| Single on/off tile (bank Placeholders, Search, Note) | `Button aria-pressed` | `Toggle` |
| Quantity row | `ToggleGroup` (already shadcn) | unchanged |
| Skill Guide rich rows | `ListItemIcon`, `ListItemDetail` | `ListItemMedia`, `ListItemDescription` (shadcn Item naming) |

Already shadcn-aligned: Button, Card, Checkbox, Context Menu, Dialog, Input, Progress, Radio Group, Scroll Area, Select, Separator, Slider, Tabs, Toggle Group, Tooltip.

## OSRS-only components (no shadcn equivalent)

Window, Interface, Side Panel, Chatbox (with NPC and option dialogues), Nav List, Number Field (GE), Stat, Status Icon, Description List, Item Slot, Equipment Slot, Skill Tile, Prayer Button, Orb, XP Drop, Skill Icons, Sprites.

## Still missing

| Game element | Seen in | Notes |
| --- | --- | --- |
| **Parchment scroll** | Max cape and spirit tree teleports, reward scrolls, letters, Construction menu, signposts | The biggest gap: a whole archetype. The resource pack has no scroll chrome (only a parchment close button), so the frame would need original art drawn to the game's style. |
| **Book** | Journals, diaries, quest books | Same: open-book art, Quill text, page numbers and a next-page tile (which would match shadcn's Pagination). |
| Swatch picker | Makeover | Rare; a `ToggleGroup` of colour tiles covers it. |

shadcn components with no counterpart in the audited screens, so not added: Accordion, Alert, Avatar, Badge, Breadcrumb, Calendar, Carousel, Chart, Command, Drawer, Hover Card, Input OTP, Menubar, Navigation Menu, Popover, Resizable, Sheet, Skeleton, Sonner, Spinner, Switch, Table, Textarea. Table and Sonner are the likeliest next ones (hiscores; the game's pop-up notifications) once screens that use them are reviewed.
