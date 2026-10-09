// Shiki theme for the docs' code blocks, using only the game's own text colours:
// white text, grey comments, orange keywords, green strings, yellow names, cyan attributes,
// tooltip yellow for numbers and constants, and the chat red for invalid / deleted.
const OSRS = {
  white: "#ffffff",
  grey: "#9f9f9f",
  orange: "#ff981f",
  yellow: "#ffff00",
  green: "#0dc10d",
  cyan: "#00ffff",
  tooltip: "#ffffa0",
  red: "#ff3030",
};

export const osrsCodeTheme = {
  name: "osrs",
  type: "dark" as const,
  colors: { "editor.background": "#00000000", "editor.foreground": OSRS.white },
  settings: [
    { settings: { foreground: OSRS.white, background: "#00000000" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: OSRS.grey } },
    { scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.operator.new", "keyword.control"], settings: { foreground: OSRS.orange } },
    { scope: ["string", "string.quoted", "string.template", "punctuation.definition.string"], settings: { foreground: OSRS.green } },
    {
      scope: ["entity.name.function", "support.function", "entity.name.type", "entity.name.class", "support.class", "entity.name.tag", "support.class.component"],
      settings: { foreground: OSRS.yellow },
    },
    { scope: ["entity.other.attribute-name", "variable.other.property", "support.type.property-name", "meta.object-literal.key"], settings: { foreground: OSRS.cyan } },
    { scope: ["constant.numeric", "constant.language", "constant.character", "support.constant", "variable.other.constant"], settings: { foreground: OSRS.tooltip } },
    { scope: ["keyword.operator", "punctuation", "meta.brace", "meta.tag"], settings: { foreground: OSRS.white } },
    { scope: ["invalid", "markup.deleted"], settings: { foreground: OSRS.red } },
    { scope: ["markup.inserted"], settings: { foreground: OSRS.green } },
  ],
};
