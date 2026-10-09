import * as React from "react";

export type SpriteProps = Omit<React.SVGProps<SVGSVGElement>, "width" | "height"> & {
  /** Integer multiple of the native sprite size. Defaults to the theme's --osrs-px scale. */
  scale?: number;
  /** Explicit pixel width (height follows aspect ratio). Overrides `scale`. */
  size?: number;
  title?: string;
};

export type SpriteComponent = React.ForwardRefExoticComponent<SpriteProps & React.RefAttributes<SVGSVGElement>> & {
  spriteWidth: number;
  spriteHeight: number;
  /** The sprite's raw SVG content (one unit per game pixel), for tiling and slicing. */
  content: React.ReactNode;
};

/** Wrap pixel-exact SVG paths (one unit per game pixel) as a scalable React component. */
export function createSprite(displayName: string, w: number, h: number, children: React.ReactNode): SpriteComponent {
  const Sprite = React.forwardRef<SVGSVGElement, SpriteProps>(({ scale, size, title, style, className, ...props }, ref) => {
    const width = size ?? (scale ? w * scale : undefined);
    const height = size ? (size * h) / w : scale ? h * scale : undefined;
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${w} ${h}`}
        width={width}
        height={height}
        shapeRendering="crispEdges"
        role={title ? "img" : undefined}
        aria-hidden={title ? undefined : true}
        className={["osrs-icon", className].filter(Boolean).join(" ")}
        style={
          width === undefined
            ? { width: `calc(${w} * var(--osrs-px, 1px))`, height: `calc(${h} * var(--osrs-px, 1px))`, ...style }
            : style
        }
        {...props}
      >
        {title ? <title>{title}</title> : null}
        {children}
      </svg>
    );
  }) as SpriteComponent;
  Sprite.displayName = displayName;
  Sprite.spriteWidth = w;
  Sprite.spriteHeight = h;
  Sprite.content = children;
  return Sprite;
}

/**
 * Stretch a sprite along one axis to `length` game pixels without distorting it:
 * the `start` and `end` caps stay fixed and the middle repeats, tiled from the start
 * like the game does. Use it to make fixed-size art (pillars, tab rows) any size.
 */
export function SlicedSprite({
  sprite,
  axis,
  length,
  start,
  end,
  className,
  style,
}: {
  sprite: SpriteComponent;
  axis: "x" | "y";
  /** Target length along `axis`, in game pixels. */
  length: number;
  /** Fixed cap size at the start, in game pixels. */
  start: number;
  /** Fixed cap size at the end, in game pixels. */
  end: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const id = React.useId().replace(/:/g, "");
  const W = sprite.spriteWidth;
  const H = sprite.spriteHeight;
  const full = axis === "x" ? W : H;
  const cross = axis === "x" ? H : W;
  const L = Math.max(Math.round(length), start + end);
  const mid = full - start - end;
  // [source offset, dest offset, size] along the axis
  const pieces: [number, number, number][] = [[0, 0, start]];
  for (let d = start; d < L - end; d += mid) pieces.push([start, d, Math.min(mid, L - end - d)]);
  pieces.push([full - end, L - end, end]);
  const box = (o: number, size: number) => (axis === "x" ? `${o} 0 ${size} ${cross}` : `0 ${o} ${cross} ${size}`);
  const w = axis === "x" ? L : W;
  const h = axis === "x" ? H : L;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      aria-hidden
      className={className}
      style={{ width: `calc(${w} * var(--osrs-px, 1px))`, height: `calc(${h} * var(--osrs-px, 1px))`, display: "block", ...style }}
    >
      <defs>
        <g id={id}>{sprite.content}</g>
      </defs>
      {pieces.map(([src, dst, size], i) =>
        size > 0 ? (
          <svg
            key={i}
            x={axis === "x" ? dst : 0}
            y={axis === "y" ? dst : 0}
            width={axis === "x" ? size : W}
            height={axis === "y" ? size : H}
            viewBox={box(src, size)}
            preserveAspectRatio="none"
            overflow="hidden"
          >
            <use href={`#${id}`} />
          </svg>
        ) : null,
      )}
    </svg>
  );
}
