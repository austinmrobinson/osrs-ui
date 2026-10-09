// Maps reference sprites (reference/vanilla, gitignored) to the vector assets we ship.
// Paths are relative to reference/vanilla.

export type Piece = string | { src: string; trim?: boolean };

export type FrameSpec = {
  /** Corner/edge/middle sprites. Edges are trimmed to their visible strip when `trim` is set. */
  tl: Piece; t: Piece; tr: Piece;
  l: Piece; m?: Piece; r: Piece;
  bl: Piece; b: Piece; br: Piece;
};

export type AssetGroup = "skill" | "frame" | "texture" | "control";

export type SpriteEntry =
  | { kind: "single"; group: AssetGroup; name: string; src: string; label?: string }
  | { kind: "frame"; group: "frame"; name: string; frame: FrameSpec; label?: string }
  /** Horizontal 3-slice: `cap` columns [0, capWidth) on the left, mirrored on the right, `middle` between. */
  | { kind: "hcap"; group: "frame"; name: string; cap: string; capWidth: number; middle: string; label?: string };

const SKILLS = [
  "attack", "hitpoints", "mining", "strength", "agility", "smithing", "defence", "herblore",
  "fishing", "ranged", "thieving", "cooking", "prayer", "crafting", "firemaking", "magic",
  "fletching", "woodcutting", "runecraft", "slayer", "farming", "construction", "hunter",
  "sailing", "total",
];

const trimmed = (src: string): Piece => ({ src, trim: true });

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
  { kind: "single", group: "texture", name: "side-panel", label: "Side panel stone", src: "fixed_mode/side_panel_background.png" },
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
];
