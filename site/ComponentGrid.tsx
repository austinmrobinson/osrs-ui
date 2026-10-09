// MDX <ComponentGrid>: the Components overview. Every component, grouped by the sidebar's usage
// sections (site/component-sections.ts), each a notched card with its pre-rendered preview
// (scripts/build-previews.ts) over its name.
import { cardVariants } from "@/registry/osrs/ui/card";
import { COMPONENT_SECTIONS } from "./component-sections";
import { PreviewImage } from "./PreviewImage";
import { cardGrid, cardLink, cardTitle, cx, gridCard, gridPreview } from "./styles";

const title = (page: string) => page.replace(/(^|-)(\w)/g, (_, s, c: string) => (s ? " " : "") + c.toUpperCase());

export default function ComponentGrid() {
  return (
    <div className="flex flex-col gap-6 [--osrs-px:1px]">
      {COMPONENT_SECTIONS.map((s) => (
        <section key={s.title}>
          <div className="osrs-section-title mb-3">{s.title}</div>
          <div className={cardGrid}>
            {s.pages.map((page) => (
              <a key={page} href={`/components/${page}`} className={cx(cardVariants({ variant: "flat" }), gridCard, cardLink)}>
                <span className={cx("osrs", gridPreview)} aria-hidden="true" inert>
                  <PreviewImage page={`components/${page}`} />
                </span>
                <span className={cardTitle}>{title(page)}</span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
