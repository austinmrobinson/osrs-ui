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
