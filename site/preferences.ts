// Site preferences (header Settings, site/Settings.tsx): sound on or muted, motion on or reduced.
// Each is remembered in localStorage and mirrored on <html> so plain CSS classes and any script can
// read it: `data-muted` stops every sound; `data-still` holds every looping animation (as the
// operating system's reduce-motion setting does). An inline script in the page shell applies the
// saved values before first paint.
export type Prefs = { sound: boolean; motion: boolean };

const KEY = "osrs-ui:prefs";
export const DEFAULT_PREFS: Prefs = { sound: true, motion: true };

export function readPrefs(): Prefs {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function applyPrefs(p: Prefs) {
  const root = document.documentElement;
  root.toggleAttribute("data-muted", !p.sound);
  root.toggleAttribute("data-still", !p.motion);
}

export function savePrefs(p: Prefs) {
  applyPrefs(p);
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // storage blocked: the choice applies to this page only
  }
  window.dispatchEvent(new CustomEvent("osrs-ui:prefs", { detail: p }));
}

/** Inline, before first paint: the saved preferences on <html>, so nothing flashes or plays. */
export const PREFS_INIT_SCRIPT = `(()=>{const a=()=>{let p={};try{p=JSON.parse(localStorage.getItem("${KEY}")||"{}");}catch{}const r=document.documentElement;r.toggleAttribute("data-muted",p.sound===false);r.toggleAttribute("data-still",p.motion===false);};a();document.addEventListener("astro:after-swap",a);})();`;
