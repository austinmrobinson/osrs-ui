"use client";

import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";

import { cn } from "@/lib/utils";
import type { SpriteComponent } from "@/lib/sprite";

const SIZES = { sm: 26, md: 36, lg: 44 } as const;

/**
 * The sprite redrawn at `size` game pixels square without scaling its art (a 9-slice of the sprite
 * itself): its corners (`slice` px) as they are, its edges and background stretched to fill, and its
 * art (the sprite minus `inset` px on each side) centred at its own size, over its background colour
 * (the pixel at `fill`).
 */
function SlicedSprite({
  sprite,
  size,
  slice,
  inset,
  fill,
  className,
}: {
  sprite: SpriteComponent;
  size: number;
  slice: number;
  inset: number;
  fill: [number, number];
  className?: string;
}) {
  const sw = sprite.spriteWidth;
  const sh = sprite.spriteHeight;
  const c = slice;
  const w = size;
  const h = size;
  // one region of the sprite, drawn into a box (stretched when the box is a different size)
  const part = (key: string, sx: number, sy: number, swid: number, shei: number, x: number, y: number, wid: number, hei: number) => (
    <svg key={key} x={x} y={y} width={wid} height={hei} viewBox={`${sx} ${sy} ${swid} ${shei}`} preserveAspectRatio="none" overflow="hidden">
      {sprite.content}
    </svg>
  );
  const aw = sw - 2 * inset;
  const ah = sh - 2 * inset;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      className={cn("osrs-icon", className)}
      style={{ width: `calc(${w} * var(--osrs-px, 1px))`, height: `calc(${h} * var(--osrs-px, 1px))` }}
    >
      {/* the background: one pixel of the sprite's own fill (`fill`, a plain background pixel) */}
      {part("fill", fill[0], fill[1], 1, 1, c, c, w - 2 * c, h - 2 * c)}
      {/* the frame: edges stretched, corners as they are */}
      {part("top", c, 0, sw - 2 * c, c, c, 0, w - 2 * c, c)}
      {part("bottom", c, sh - c, sw - 2 * c, c, c, h - c, w - 2 * c, c)}
      {part("left", 0, c, c, sh - 2 * c, 0, c, c, h - 2 * c)}
      {part("right", sw - c, c, c, sh - 2 * c, w - c, c, c, h - 2 * c)}
      {part("tl", 0, 0, c, c, 0, 0, c, c)}
      {part("tr", sw - c, 0, c, c, w - c, 0, c, c)}
      {part("bl", 0, sh - c, c, c, 0, h - c, c, c)}
      {part("br", sw - c, sh - c, c, c, w - c, h - c, c, c)}
      {/* the art, at its own size, in the middle */}
      {part("art", inset, inset, aw, ah, Math.round((w - aw) / 2), Math.round((h - ah) / 2), aw, ah)}
    </svg>
  );
}

/**
 * A button drawn by one of the game's own button sprites (the wrench, the hamburger menu, the
 * volume speaker), which swaps to its lit sprite on hover, while pressed (`aria-pressed`) and while
 * the menu or window it opens is open. Give it an `aria-label`: it has no text.
 *
 * `size` (`sm` 26, `md` 36, `lg` 44 game px) makes a bigger button without scaling the art: the
 * sprite's own frame and background stretch to that size (its corners, `slice` px, kept as they are),
 * with its art (the sprite less `inset` px on each side) centred at its own size over the sprite's
 * background colour (the pixel at `fill`). The rest and lit sprites are both redrawn this way.
 *
 * <SpriteButton sprite={buttonSprites.wrench} activeSprite={buttonSprites.wrenchHovered} aria-label="Controls" />
 * <SpriteButton sprite={buttonSprites.menu} activeSprite={buttonSprites.menuSelected} size="md" slice={4} inset={4} fill={[17, 13]} aria-label="Menu" />
 */
function SpriteButton({
  sprite: Rest,
  activeSprite: Active,
  size,
  slice = 4,
  inset = slice,
  fill = [slice, slice],
  className,
  ...props
}: ButtonPrimitive.Props & {
  sprite: SpriteComponent;
  activeSprite?: SpriteComponent;
  size?: keyof typeof SIZES;
  slice?: number;
  inset?: number;
  /** A pixel of the sprite's plain background, stretched behind the art. */
  fill?: [number, number];
}) {
  if (size) {
    const n = SIZES[size];
    return (
      <ButtonPrimitive data-slot="sprite-button" data-size={size} className={cn("osrs-sprite-button", className)} {...props}>
        <SlicedSprite sprite={Rest} size={n} slice={slice} inset={inset} fill={fill} className="osrs-sprite-button-rest" />
        {Active ? <SlicedSprite sprite={Active} size={n} slice={slice} inset={inset} fill={fill} className="osrs-sprite-button-active" /> : null}
      </ButtonPrimitive>
    );
  }
  return (
    <ButtonPrimitive data-slot="sprite-button" className={cn("osrs-sprite-button", className)} {...props}>
      <Rest className="osrs-sprite-button-rest" />
      {Active ? <Active className="osrs-sprite-button-active" /> : null}
    </ButtonPrimitive>
  );
}

export { SpriteButton };
