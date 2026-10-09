// Every contrived gallery example (gallery/), stacked, for a quick visual check in the docs dev server.
// `?only=<id>` shows one example and `&px=<n>` renders it at that game-pixel scale.
import * as React from "react";

import { gallery } from "@/gallery";

export default function GalleryDemo() {
  const [query, setQuery] = React.useState<{ only?: string; px?: string }>({});
  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setQuery({ only: q.get("only") ?? undefined, px: q.get("px") ?? undefined });
  }, []);
  const shown = query.only ? gallery.filter((g) => g.id === query.only) : gallery;
  return (
    <div
      className="osrs osrs-texture-stone flex flex-col items-center"
      style={{ gap: 32, padding: 24, ...(query.px ? ({ "--osrs-px": `${query.px}px` } as React.CSSProperties) : {}) }}
    >
      {shown.map(({ id, title, Component }) => (
        <section key={id} id={id} className="flex flex-col items-center" style={{ gap: 8 }}>
          <p className="osrs-text m-0" style={{ color: "var(--osrs-white)" }}>
            {title}
          </p>
          <Component />
        </section>
      ))}
    </div>
  );
}
