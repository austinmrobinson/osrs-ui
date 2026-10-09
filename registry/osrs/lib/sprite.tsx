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
  return Sprite;
}
