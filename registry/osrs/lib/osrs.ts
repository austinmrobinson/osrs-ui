import * as React from "react";

/** n game pixels, as a CSS length that follows --osrs-px. */
export const px = (n: number) => `calc(${n} * var(--osrs-px))`;

/** In-game stack quantity: yellow under 100K, white "K" under 10M, green "M" above. */
export function formatQuantity(n: number): { text: string; color: string } {
  if (n < 100_000) return { text: String(n), color: "var(--osrs-yellow)" };
  if (n < 10_000_000) return { text: `${Math.floor(n / 1000)}K`, color: "var(--osrs-white)" };
  return { text: `${Math.floor(n / 1_000_000)}M`, color: "var(--osrs-green)" };
}

/** The green → yellow → red gradient the game uses for orb numbers and HP bars. */
export function statusColor(fraction: number) {
  const f = Math.max(0, Math.min(1, fraction));
  const r = f < 0.5 ? 255 : Math.round(255 * (1 - f) * 2);
  const g = f > 0.5 ? 255 : Math.round(255 * f * 2);
  return `rgb(${r} ${g} 0)`;
}

/**
 * Popups (selects, menus, tooltips) render in a portal at the end of the page, outside whatever set
 * their trigger's `--osrs-px`. Pass this as the popup's `ref` and it copies the trigger's scale onto
 * the popup when it opens, so a dropdown in a 1x sidebar stays 1x on a 2x page. With `scale` (in CSS
 * px per game pixel), the popup is drawn at that scale instead, whatever its trigger's.
 */
export function useAnchorScale<T extends HTMLElement>(scale?: number) {
  return React.useCallback((el: T | null) => {
    if (!el || typeof document === "undefined") return;
    if (scale) return void el.style.setProperty("--osrs-px", `${scale}px`);
    const anchor =
      (el.id && document.querySelector<HTMLElement>(`[aria-controls~="${CSS.escape(el.id)}"]`)) ||
      document.querySelector<HTMLElement>("[data-popup-open]") ||
      (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    if (!anchor) return;
    const own = getComputedStyle(anchor).getPropertyValue("--osrs-px").trim();
    if (own) el.style.setProperty("--osrs-px", own);
  }, [scale]);
}
