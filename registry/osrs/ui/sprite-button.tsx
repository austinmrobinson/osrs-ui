"use client";

import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";

import { cn } from "@/lib/utils";

type Sprite = React.ComponentType<{ className?: string }>;

/**
 * A button drawn by one of the game's own button sprites (the wrench, the hamburger menu, the
 * volume speaker), which swaps to its lit sprite on hover, while pressed (`aria-pressed`) and while
 * the menu or window it opens is open. Give it an `aria-label`: it has no text.
 *
 * <SpriteButton sprite={buttonSprites.wrench} activeSprite={buttonSprites.wrenchHovered} aria-label="Controls" />
 */
function SpriteButton({
  sprite: Rest,
  activeSprite: Active,
  className,
  ...props
}: ButtonPrimitive.Props & { sprite: Sprite; activeSprite?: Sprite }) {
  return (
    <ButtonPrimitive data-slot="sprite-button" className={cn("osrs-sprite-button", className)} {...props}>
      <Rest className="osrs-sprite-button-rest" />
      {Active ? <Active className="osrs-sprite-button-active" /> : null}
    </ButtonPrimitive>
  );
}

export { SpriteButton };
