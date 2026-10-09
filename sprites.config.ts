// Maps reference sprites (reference/vanilla, gitignored) to the vector assets we ship.
// Paths are relative to reference/vanilla.

export type Piece = string | { src: string; trim?: boolean };

export type FrameSpec = {
  /** Corner/edge/middle sprites. Edges are trimmed to their visible strip when `trim` is set. */
  tl: Piece; t: Piece; tr: Piece;
  l: Piece; m?: Piece; r: Piece;
  bl: Piece; b: Piece; br: Piece;
};

export type AssetGroup =
  | "skill" | "frame" | "texture" | "control"
  | "prayer" | "panel" | "ge" | "chevron" | "glyph" | "button" | "orb" | "equipment" | "stats" | "combat" | "bank" | "tab" | "icon" | "chatbox" | "option"
  | "spell-normal" | "spell-ancient" | "spell-lunar" | "spell-arceuus" | "emote" | "minigame" | "sailing";

export type SpriteEntry =
  | { kind: "single"; group: AssetGroup; name: string; src: string; label?: string }
  | { kind: "frame"; group: "frame"; name: string; frame: FrameSpec; label?: string }
  /** Horizontal 3-slice: `cap` columns [0, capWidth) on the left, mirrored on the right, `middle` between. */
  | { kind: "hcap"; group: "frame"; name: string; cap: string; capWidth: number; middle: string; label?: string }
  /** Every PNG in `dir` matching `include` (and not `exclude`) becomes a single asset named after its file. */
  | { kind: "folder"; group: AssetGroup; dir: string; include?: RegExp; exclude?: RegExp; strip?: RegExp }
  /** 9-slice cut from one big sprite: corners of size `slice`, edges cropped to `edge` px, middle left transparent. */
  | { kind: "crop9"; group: "frame"; name: string; src: string; slice: number; edge: number; label?: string };

const SKILLS = [
  "attack", "hitpoints", "mining", "strength", "agility", "smithing", "defence", "herblore",
  "fishing", "ranged", "thieving", "cooking", "prayer", "crafting", "firemaking", "magic",
  "fletching", "woodcutting", "runecraft", "slayer", "farming", "construction", "hunter",
  "sailing", "total",
];

const trimmed = (src: string): Piece => ({ src, trim: true });

type NineNames = Partial<Record<keyof FrameSpec, string>> & Omit<Record<keyof FrameSpec, string>, "m">;
/** Build a FrameSpec from a filename prefix, per-piece names and an optional state suffix. */
const nine = (prefix: string, names: NineNames, suffix = "", trim = false): FrameSpec =>
  Object.fromEntries(
    Object.entries(names).map(([k, v]) => [k, trim ? { src: `${prefix}${v}${suffix}.png`, trim: true } : `${prefix}${v}${suffix}.png`]),
  ) as FrameSpec;
const EDGES: NineNames = { tl: "corner_top_left", t: "edge_top", tr: "corner_top_right", l: "edge_left", r: "edge_right", bl: "corner_bottom_left", b: "edge_bottom", br: "corner_bottom_right" };
const METAL: NineNames = { tl: "corner_top_left", t: "edge_top", tr: "corner_top_right", l: "edge_left", r: "edge_right", bl: "corner_bottom_left", b: "edge_bottom", br: "corner_bottom_right" };

const stoneSmall = (suffix = ""): FrameSpec => ({
  tl: `button/stone_small_top_left${suffix}.png`,
  t: `button/stone_small_top${suffix}.png`,
  tr: `button/stone_small_top_right${suffix}.png`,
  l: `button/stone_small_left${suffix}.png`,
  r: `button/stone_small_right${suffix}.png`,
  bl: `button/stone_small_bottom_left${suffix}.png`,
  b: `button/stone_small_bottom${suffix}.png`,
  br: `button/stone_small_bottom_right${suffix}.png`,
});

const square = (suffix = ""): FrameSpec => ({
  tl: `button/corner_top_left${suffix}.png`,
  t: `button/edge_top${suffix}.png`,
  tr: `button/corner_top_right${suffix}.png`,
  l: `button/edge_left${suffix}.png`,
  m: `button/middle${suffix}.png`,
  r: `button/edge_right${suffix}.png`,
  bl: `button/corner_bottom_left${suffix}.png`,
  b: `button/edge_bottom${suffix}.png`,
  br: `button/corner_bottom_right${suffix}.png`,
});

const tan = (thick: boolean): FrameSpec => {
  const p = `dialog/tan_border${thick ? "_thick" : ""}`;
  return {
    tl: `${p}_corner_top_left.png`, t: `${p}_top.png`, tr: `${p}_corner_top_right.png`,
    l: `${p}_left.png`, r: `${p}_right.png`,
    bl: `${p}_corner_bottom_left.png`, b: `${p}_bottom.png`, br: `${p}_corner_bottom_right.png`,
  };
};

export const sprites: SpriteEntry[] = [
  ...SKILLS.map((s) => ({ kind: "single" as const, group: "skill" as const, name: s, src: `skill/${s}.png` })),

  // Interface chrome
  {
    kind: "frame", group: "frame", name: "iron-rivets", label: "Interface frame (iron rivets)",
    frame: {
      tl: "dialog/iron_rivets_corner_top_left.png",
      t: trimmed("dialog/iron_rivets_edge_top.png"),
      tr: "dialog/iron_rivets_corner_top_right.png",
      l: trimmed("dialog/iron_rivets_vertical.png"),
      r: trimmed("dialog/iron_rivets_edge_right.png"),
      bl: "dialog/iron_rivets_corner_bottom_left.png",
      b: trimmed("dialog/iron_rivets_bottom.png"),
      br: "dialog/iron_rivets_corner_bottom_right.png",
    },
  },
  { kind: "frame", group: "frame", name: "stone-button", label: "Stone button", frame: stoneSmall() },
  { kind: "frame", group: "frame", name: "stone-button-hover", label: "Stone button (hover)", frame: stoneSmall("_hovered") },
  { kind: "frame", group: "frame", name: "stone-button-disabled", label: "Stone button (disabled)", frame: stoneSmall("_disabled") },
  { kind: "frame", group: "frame", name: "square-button", label: "Square button", frame: square() },
  { kind: "frame", group: "frame", name: "square-button-selected", label: "Square button (selected)", frame: square("_selected") },
  { kind: "frame", group: "frame", name: "tan-border", label: "Tan border", frame: tan(false) },
  { kind: "frame", group: "frame", name: "tan-border-thick", label: "Tan border (thick)", frame: tan(true) },

  // Tabs: 4px slanted caps + repeatable middle
  ...(["small", "medium", "large"] as const).flatMap((size) =>
    (["", "_hovered", "_selected"] as const).map((st) => ({
      kind: "hcap" as const, group: "frame" as const,
      name: `tab-${size}${st.replace("_hovered", "-hover").replace("_", "-")}`,
      cap: `tab/${size}_left_right${st}.png`, capWidth: 4, middle: `tab/${size}_middle${st}.png`,
    })),
  ),

  { kind: "single", group: "texture", name: "stone", label: "Interface stone", src: "dialog/background.png" },
  { kind: "single", group: "texture", name: "stone-bright", label: "Interface stone (bright)", src: "dialog/background_brighter.png" },
  { kind: "single", group: "texture", name: "side-panel", label: "Side panel stone", src: "resizeable_mode/side_panel_background.png" },
  { kind: "crop9", group: "frame", name: "chatbox", label: "Chatbox frame", src: "chatbox/background.png", slice: 9, edge: 48 },
  { kind: "single", group: "texture", name: "progress-green", label: "Progress bar (green)", src: "dialog/progress_bar_green.png" },
  { kind: "single", group: "texture", name: "progress-grey", label: "Progress bar (grey)", src: "dialog/progress_bar_grey.png" },
  { kind: "single", group: "texture", name: "progress-notch", label: "Progress bar notch", src: "dialog/progress_bar_notch.png" },
  { kind: "single", group: "texture", name: "rivets-horizontal", label: "Rivet divider (horizontal)", src: "dialog/iron_rivets_horizontal.png" },
  { kind: "single", group: "texture", name: "rivets-vertical", label: "Rivet divider (vertical)", src: "dialog/iron_rivets_vertical_middle.png" },

  // Controls
  { kind: "single", group: "control", name: "close", src: "other/window_close_button.png" },
  { kind: "single", group: "control", name: "close-hover", src: "other/window_close_button_hovered.png" },
  { kind: "single", group: "control", name: "checkbox", src: "options/square_check_box.png" },
  { kind: "single", group: "control", name: "checkbox-hover", src: "options/square_check_box_hovered.png" },
  { kind: "single", group: "control", name: "checkbox-checked", src: "options/square_check_box_checked.png" },
  { kind: "single", group: "control", name: "checkbox-checked-hover", src: "options/square_check_box_checked_hovered.png" },
  { kind: "single", group: "control", name: "checkbox-crossed", src: "options/square_check_box_crossed.png" },
  { kind: "single", group: "control", name: "scroll-up", src: "scrollbar/arrow_up.png" },
  { kind: "single", group: "control", name: "scroll-down", src: "scrollbar/arrow_down.png" },
  { kind: "single", group: "control", name: "scroll-left", src: "scrollbar/arrow_left.png" },
  { kind: "single", group: "control", name: "scroll-right", src: "scrollbar/arrow_right.png" },
  { kind: "single", group: "control", name: "scroll-thumb-top", src: "scrollbar/thumb_top.png" },
  { kind: "single", group: "control", name: "scroll-thumb-middle", src: "scrollbar/thumb_middle.png" },
  { kind: "single", group: "control", name: "scroll-thumb-bottom", src: "scrollbar/thumb_bottom.png" },
  { kind: "single", group: "control", name: "tab-stone-tl", src: "tab/stone_top_left_selected.png" },
  { kind: "single", group: "control", name: "tab-stone-tr", src: "tab/stone_top_right_selected.png" },
  { kind: "single", group: "control", name: "tab-stone-mid", src: "tab/stone_middle_selected.png" },
  { kind: "single", group: "control", name: "tab-stone-bl", src: "tab/stone_bottom_left_selected.png" },
  { kind: "single", group: "control", name: "tab-stone-br", src: "tab/stone_bottom_right_selected.png" },
  { kind: "single", group: "control", name: "separator", src: "dialog/horizontal_separator_line.png" },
  { kind: "single", group: "control", name: "drag-corner", src: "dialog/drag_corner_dots.png" },

  // Whole folders: these also become generated React sprite modules (scripts/build-sprites.ts)
  { kind: "folder", group: "prayer", dir: "prayer" },
  { kind: "folder", group: "orb", dir: "other", include: /^minimap_orb_/, strip: /^minimap_orb_/ },
  { kind: "folder", group: "equipment", dir: "equipment" },
  { kind: "folder", group: "stats", dir: "stats" },
  { kind: "folder", group: "combat", dir: "combat" },
  { kind: "folder", group: "bank", dir: "bank", exclude: /^pin_marble/ },
  { kind: "folder", group: "tab", dir: "tab", exclude: /^(small|medium|large|side_border|stone|transparent|stash|logout_small)/ },
  { kind: "folder", group: "tab", dir: "resizeable_mode", include: /^tab_stone_middle/ },
  { kind: "folder", group: "panel", dir: "resizeable_mode", include: /^(tabs_|side_panel_edge)/ },
  { kind: "folder", group: "icon", dir: "icon" },
  { kind: "folder", group: "icon", dir: "other", include: /^(plus_icon|minus_icon|orange_.*_arrow|spell_requirement_lock|wilderness_danger_icon|stash_units_green_check_mark|selector_arrow|refresh_icon)/ },
  { kind: "folder", group: "chatbox", dir: "chatbox", include: /^(button|report_button|sword_pointed)/ },
  { kind: "folder", group: "option", dir: "options", include: /^(round_check_box|square_bordered_checkbox|slider_new|zoom_slider_thumb|master_volume|sound_effect_volume|music_volume)/ },

  // Modern-interface frames
  { kind: "frame", group: "frame", name: "flat", label: "Flat button", frame: nine("button/flat_5x5_", { tl: "top_left", t: "top", tr: "top_right", l: "left", m: "middle", r: "right", bl: "bottom_left", b: "bottom", br: "bottom_right" }) },
  { kind: "frame", group: "frame", name: "metal-button", label: "Metal-corner button", frame: nine("chatbox/make_all_button_metal_", METAL) },
  { kind: "frame", group: "frame", name: "metal-button-hover", label: "Metal-corner button (hover)", frame: nine("chatbox/make_all_button_metal_", METAL, "_hovered") },
  { kind: "frame", group: "frame", name: "skill-guide", label: "Skill guide button", frame: nine("button/skill_guide_unselected_", EDGES) },
  { kind: "frame", group: "frame", name: "skill-guide-hover", label: "Skill guide button (hover)", frame: nine("button/skill_guide_hovered_", EDGES) },
  { kind: "frame", group: "frame", name: "equipment-metal", label: "Equipment metal button", frame: nine("button/equipment_", { tl: "metal_corner_top_left", t: "edge_top", tr: "metal_corner_top_right", l: "edge_left", r: "edge_right", bl: "metal_corner_bottom_left", b: "edge_bottom", br: "metal_corner_bottom_right" }) },
  { kind: "frame", group: "frame", name: "equipment-metal-hover", label: "Equipment metal button (hover)", frame: nine("button/equipment_", { tl: "metal_corner_top_left", t: "edge_top", tr: "metal_corner_top_right", l: "edge_left", r: "edge_right", bl: "metal_corner_bottom_left", b: "edge_bottom", br: "metal_corner_bottom_right" }, "_hovered") },
  { kind: "frame", group: "frame", name: "ge-offer", label: "Grand Exchange offer card", frame: nine("ge/border_offer_", { tl: "corner_top_left", t: "top", tr: "corner_top_right", l: "left", r: "right", bl: "corner_bottom_left", b: "bottom", br: "corner_bottom_right" }, "", true) },
  { kind: "folder", group: "ge", dir: "ge", exclude: /^border_offer/ },
  { kind: "folder", group: "ge", dir: "ge", include: /^border_offer_(intersection|horizontal)/ },
  { kind: "folder", group: "chevron", dir: "chevron" },
  // Spellbooks: each spell and its disabled state (the "_resized" copies are the same art for resizable mode)
  { kind: "folder", group: "spell-normal", dir: "normal_spell", exclude: /_resized\.png$/ },
  { kind: "folder", group: "spell-ancient", dir: "ancient_spell", exclude: /_resized\.png$/ },
  { kind: "folder", group: "spell-lunar", dir: "lunar_spell", exclude: /_resized\.png$/ },
  { kind: "folder", group: "spell-arceuus", dir: "arceuus_spell", exclude: /_resized\.png$/ },
  { kind: "folder", group: "emote", dir: "emote" },
  { kind: "folder", group: "minigame", dir: "minigame_teleport" },
  { kind: "folder", group: "sailing", dir: "sailing" },
  { kind: "folder", group: "button", dir: "button", include: /^(menu|wrench|options_square|back_arrow|forward_arrow|left_arrow|enter_arrow|tutorial|friends|ignores|large_with_red_x|equipment_stats_icon|equipment_guide_prices|equipment_items_lost_on_death|equipment_call_follower)/ },
  { kind: "folder", group: "glyph", dir: "account_management" },
  { kind: "folder", group: "glyph", dir: "clans_tab" },
  { kind: "folder", group: "glyph", dir: "quests_tab" },
  { kind: "folder", group: "glyph", dir: "combat_achievements" },
  { kind: "folder", group: "glyph", dir: "advanced_options" },
  { kind: "folder", group: "glyph", dir: "bonds_pouch", exclude: /^banner/ },
];
