// Home page intro, styled on the game's login screen (rendered by components/blume/Header.astro on "/").
// The scene, the marble login panel and the brazier fire are vector SVGs (scripts/build-landing.ts). The section is three
// screens tall; while it scrolls past, a sticky stage zooms into the archway, the login box fades, and
// the page background fades in, so the docs below follow on seamlessly.
import { chevronSprites } from "@/registry/osrs/ui/chevron-sprites";

/** The home page intro is hidden for now; set to true to show it again. */
export const SHOW_HERO = false;

// Scroll progress (0 → 1) through the section, written to --p on the section; CSS does the rest.
const SCRIPT = `(() => {
  const el = document.currentScript.closest(".osrs-hero");
  if (!el) return;
  let raf = 0;
  const update = () => {
    raf = 0;
    const r = el.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    el.style.setProperty("--p", p.toFixed(4));
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  update();
})();`;

export default function Hero() {
  return (
    <section className="osrs-hero osrs-text" aria-label="OSRS UI">
      <div className="osrs-hero-stage">
        {/* everything inside the scene is placed in the background's own 765 x 503 coordinates */}
        <div className="osrs-hero-scene">
          <img className="osrs-hero-bg" src="/landing/login-scene.svg" alt="" width={765} height={503} draggable={false} />
          <span className="osrs-hero-fire" data-side="left" aria-hidden="true">
            <img src="/landing/brazier-fire.svg" alt="" draggable={false} />
          </span>
          <span className="osrs-hero-fire" data-side="right" aria-hidden="true">
            <img src="/landing/brazier-fire.svg" alt="" draggable={false} />
          </span>
          <div className="osrs-hero-box">
            <h1 className="osrs-hero-title">Welcome to OSRS UI</h1>
            <a href="/installation" className="osrs-hero-button" data-slot="left">Get started</a>
            <a href="/components/window" className="osrs-hero-button" data-slot="right">Components</a>
            <p className="osrs-hero-lead">Pixel-exact vector components, icons and screens.</p>
          </div>
        </div>
        <div className="osrs-hero-fade" aria-hidden="true" />
        <a href="#blume-content" className="osrs-hero-scroll">
          Scroll to enter
          <chevronSprites.yellowDownDouble />
        </a>
      </div>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
    </section>
  );
}
