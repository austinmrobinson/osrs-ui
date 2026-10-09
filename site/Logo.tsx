// The OSRS UI mark: "OSRS" on four rune stones with a sword through them and a red ribbon reading
// "UI". Pixel art in the game's colours, built from the artwork by scripts/build-logo.ts
// (136 x 69 game pixels).
import logoSvg from "@/registry/osrs/assets/logo/logo-136.svg?raw";
import { cx } from "./styles";

/** The mark at `scale` (whole multiples of 136 x 69 stay crisp), or, with `scale={null}`, at the
 *  size its classes give it. */
export function LogoMark({ scale = 1, className, style }: { scale?: number | null; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      role="img"
      aria-label="OSRS UI"
      className={cx("inline-block flex-none [&>svg]:block [&>svg]:size-full [&>svg]:[image-rendering:pixelated]", className)}
      style={scale === null ? style : { width: 136 * scale, height: 69 * scale, ...style }}
      dangerouslySetInnerHTML={{ __html: logoSvg }}
    />
  );
}

/** Header logo: on wide screens the mark at full size, hanging over the bottom of the header into
 *  the room left at the top of the sidebar; below that, half size inside the header. */
export default function Logo() {
  return (
    <a
      href="/"
      aria-label="OSRS UI home"
      className="group relative z-60 inline-flex items-center no-underline lg:mt-1 lg:h-10 lg:w-[136px] lg:self-start"
    >
      <LogoMark
        scale={null}
        className="h-[34.5px] w-[68px] group-hover:brightness-112 lg:absolute lg:top-0 lg:left-0 lg:h-[69px] lg:w-[136px] lg:drop-shadow-[0_2px_0_rgb(0_0_0/0.35)]"
      />
    </a>
  );
}
