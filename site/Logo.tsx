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

/** Header logo: the mark hanging over the bottom of the header, at full size on wide screens (into
 *  the room left at the top of the sidebar), and three-quarters size and centred below that. */
export default function Logo() {
  return (
    <a
      href="/"
      aria-label="OSRS UI home"
      className="group absolute top-1 left-1/2 z-60 inline-flex h-10 w-[102px] -translate-x-1/2 items-center no-underline lg:relative lg:top-auto lg:left-auto lg:mt-1 lg:w-[136px] lg:translate-x-0 lg:self-start"
    >
      <LogoMark
        scale={null}
        className="absolute top-0 left-0 h-[51.75px] w-[102px] drop-shadow-[0_2px_0_rgb(0_0_0/0.35)] group-hover:brightness-112 lg:h-[69px] lg:w-[136px]"
      />
    </a>
  );
}
