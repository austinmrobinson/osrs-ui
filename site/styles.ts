// Shared Tailwind class sets for the site's recurring OSRS surfaces, so each look is written once.
// Colours and fonts are the theme tokens declared in site/site.css (`@theme`), which point at the
// library's own variables (registry/osrs/theme/base.css): `text-rs-orange`, `bg-rs-well`, `font-rs-bold`.

/** Join class names, skipping falsy ones. */
export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

/** The game's 1px black drop shadow under text on the stone. */
export const textShadow = "text-shadow-[1px_1px_0_#000]";

/** The page's stone: the interface tile at 2x under the nav list's darker tint, fixed to the viewport
 *  so every stone surface lines up as the page scrolls. */
export const stone =
  "bg-rs-stone bg-[image:linear-gradient(rgb(0_0_0/0.14),rgb(0_0_0/0.14)),var(--osrs-texture-stone)] bg-[size:auto,176px_120px] bg-fixed";

/** A darker stage on the stone (the playground and preview panels, code blocks, the search panes). */
export const stage =
  "bg-rs-stone-dark bg-[image:linear-gradient(rgb(0_0_0/0.32),rgb(0_0_0/0.32)),var(--osrs-texture-stone)] bg-[size:auto,176px_120px]";

/** A panel's edge: the light inner line inside the dark outer line. */
export const edge = "shadow-[inset_0_0_0_1px_var(--color-rs-separator),0_0_0_1px_var(--color-rs-line)]";

/** A sunken well (inputs and search fields): bevelled in, black outline. */
export const well =
  "bg-rs-well shadow-[inset_1px_1px_0_var(--color-rs-outer),inset_-1px_-1px_0_var(--color-rs-inner),0_0_0_1px_#000]";

/** The bevelled divider under a bar (header, sidebar sections): dark line over light. */
export const dividerBelow = "shadow-[0_1px_0_var(--color-rs-line),0_2px_0_var(--color-rs-separator)]";

/** The same divider above a bar (the footer). */
export const dividerAbove = "shadow-[0_-1px_0_var(--color-rs-line),inset_0_1px_0_var(--color-rs-separator)]";

/** Keyboard focus, everywhere on the site: the game's yellow, only for keyboard focus. */
export const focusRing = "focus-visible:outline-1 focus-visible:outline-solid focus-visible:outline-rs-yellow focus-visible:outline-offset-2";

/** Text links in running copy: yellow, white on hover. */
export const link = "text-rs-yellow no-underline hover:text-rs-white";

/** The Settings-style section band: white bold title on a darker strip. */
export const band = "bg-black/14 px-2.5 py-1.5 font-rs-bold text-base leading-5 text-rs-white";

/** Striped rows (tables, the "On this page" list, search outlines). */
export const stripes = "[&>*:nth-child(odd)]:bg-black/10 [&>*:nth-child(even)]:bg-white/5";

/** A whole-card link (the overview grids): no underline, its frame lighter on hover and darker
 *  while pressed. */
export const cardLink =
  "no-underline [--osrs-px:1px] before:transition-[filter] before:duration-80 hover:before:brightness-122 active:before:brightness-85";

/** A card's name under its preview. */
export const cardTitle = "font-rs-bold text-rs text-rs-white";

/** The overview pages' card grid, its cards and their preview box. */
export const cardGrid = "my-4 grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3";
export const gridCard = "flex flex-col items-center justify-between gap-2 min-h-40 px-3 pt-3.5 pb-2.5";
export const gridPreview = "pointer-events-none flex h-[140px] w-full max-w-full flex-none items-center justify-center overflow-hidden p-1 text-rs text-rs-orange";
