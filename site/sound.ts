// The game's interface sounds on the site's controls: a click when a button or link is pressed, a
// softer tick when a toggle, tab or option is chosen. Off when the visitor mutes sound in the header
// Settings (html[data-muted]) or has not yet interacted with the page (browsers block audio until
// then anyway). Sound files live in public/sounds/ (see public/sounds/README.md for their source).
export type SoundName = "click" | "select" | "open" | "close";

// The game plays one sound for interface buttons (interface_select1, sound 2266), so every press
// uses it; options and closing are quieter, as a lighter touch than a button.
const FILES: Record<SoundName, { src: string; volume: number }> = {
  click: { src: "/sounds/interface-select.wav", volume: 0.5 },
  select: { src: "/sounds/interface-select.wav", volume: 0.3 },
  open: { src: "/sounds/interface-select.wav", volume: 0.5 },
  close: { src: "/sounds/interface-select.wav", volume: 0.3 },
};

const cache = new Map<SoundName, HTMLAudioElement>();
// a sound whose file failed to load isn't fetched again (until the files are added, every press would 404)
const missing = new Set<SoundName>();

export function play(name: SoundName) {
  if (typeof window === "undefined" || missing.has(name) || document.documentElement.hasAttribute("data-muted")) return;
  let audio = cache.get(name);
  if (!audio) {
    audio = new Audio(FILES[name].src);
    audio.addEventListener("error", () => missing.add(name), { once: true });
    audio.volume = FILES[name].volume;
    cache.set(name, audio);
  }
  // restart for rapid repeats; a missing file or a blocked play is silent
  audio.currentTime = 0;
  void audio.play().catch(() => {});
}

/** Which sound a pressed element makes: options, tabs and toggles tick; everything else clicks. */
function soundFor(el: Element): SoundName | null {
  const control = el.closest(
    'a[href], button, [role="tab"], [role="option"], [role="menuitem"], [role="menuitemradio"], [role="checkbox"], [role="radio"], [role="switch"], summary, label',
  );
  if (!control || control.closest("[data-silent]") || control.matches(":disabled, [aria-disabled='true']")) return null;
  const role = control.getAttribute("role");
  if (role === "tab" || role === "option" || role === "checkbox" || role === "radio" || role === "switch" || role?.startsWith("menuitem")) return "select";
  return "click";
}

/** One delegated listener for the whole page (installed once, survives client-side navigation). */
export function installInterfaceSounds() {
  const w = window as Window & { __osrsSounds?: boolean };
  if (w.__osrsSounds) return;
  w.__osrsSounds = true;
  document.addEventListener(
    "pointerdown",
    (e) => {
      if (e.button !== 0 || !(e.target instanceof Element)) return;
      const name = soundFor(e.target);
      if (name) play(name);
    },
    { capture: true, passive: true },
  );
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target instanceof Element) {
      const name = soundFor(e.target);
      if (name) play(name);
    }
  });
}
