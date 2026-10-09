// A page's pre-rendered preview (scripts/build-previews.ts): a 2x PNG of its example, shown at its
// CSS size and shrunk to fit its box. Used by the overview cards and the search window.
import PREVIEWS from "./previews.generated.json";
import { cx } from "./styles";

type Preview = { src: string; width: number; height: number };
const ALL = PREVIEWS as Record<string, Preview>;

/** `key` is the page's route without the leading slash, e.g. "components/button". */
export function hasPreview(key: string) {
  return key in ALL;
}

/** `scale` draws it at a fixed fraction of its own size (one scale for a whole grid). `fit` (default)
 *  shrinks it to its box; without it, it keeps its size and may overflow. */
export function PreviewImage({
  page,
  className,
  scale = 1,
  eager = false,
  fit = true,
}: {
  page: string;
  className?: string;
  scale?: number;
  eager?: boolean;
  fit?: boolean;
}) {
  const p = ALL[page];
  if (!p) return null;
  return (
    <img
      src={p.src}
      width={p.width}
      height={p.height}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      // never larger than its own size (the PNG is 2x); `aspect-ratio` keeps it in shape when shrunk
      style={{ width: Math.round(p.width * scale), aspectRatio: `${p.width} / ${p.height}` }}
      className={cx("block h-auto object-contain", fit && "max-h-full max-w-full", className)}
    />
  );
}
