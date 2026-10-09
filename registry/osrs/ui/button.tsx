"use client";

import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * OSRS buttons.
 *
 * Variants (by where the game uses them):
 * - `stone`  — default text button on interface stone (bank "Item / Note", dialog "Yes / No").
 * - `metal`  — metal-cornered button of modern windows (header "History", "Show more information", page actions).
 * - `square` — grey metal tile; red when pressed (bank quantity "1 / 5 / All", toggles).
 * - `flat`   — notched flat button (Settings categories, list actions).
 *
 * Sizes: `sm`, `default`, `lg` for text; `icon-sm` (20), `icon` (26), `icon-lg` (36) for square
 * icon-only buttons (game pixels). Icon buttons need an `aria-label`.
 * Toggle state: set `aria-pressed` and the button shows its pressed sprite.
 * `tooltip`: the game's dark hover label (e.g. "Close", "Select Audio"); handy for icon buttons.
 */
const buttonVariants = cva("osrs-button osrs-framed osrs-frame-stone-button osrs-text", {
  variants: {
    variant: {
      stone: "",
      metal: "osrs-button-metal",
      square: "osrs-button-square",
      flat: "osrs-button-flat",
    },
    size: {
      sm: "osrs-button-sm",
      default: "",
      lg: "osrs-button-lg",
      "icon-sm": "osrs-button-icon osrs-button-icon-sm",
      icon: "osrs-button-icon",
      "icon-lg": "osrs-button-icon osrs-button-icon-lg",
    },
  },
  defaultVariants: { variant: "stone", size: "default" },
});

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    tooltip?: React.ReactNode;
    tooltipSide?: "top" | "right" | "bottom" | "left";
  };

function Button({ className, variant, size, tooltip, tooltipSide = "bottom", ...props }: ButtonProps) {
  const button = (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant ?? "stone"}
      data-size={size ?? "default"}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
  if (!tooltip) return button;
  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent variant="interface" side={tooltipSide} align="start" sideOffset={2}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
