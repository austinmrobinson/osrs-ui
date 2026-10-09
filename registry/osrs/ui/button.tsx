"use client";

import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * OSRS buttons, matched to the game's interfaces.
 *
 * Variants:
 * - `metal` (default): equipment-style metal corners. Orange label that turns white on hover
 *   ("View DPS"); hover and pressed look the same.
 * - `tile`: grey stone tile, orange label. Bank quantity buttons and toggles, World Switcher.
 *   White label on hover; red tile when pressed or selected (`aria-pressed`).
 * - `stone`: the classic stone_small button of older interfaces.
 *
 * `tone="white"` swaps the orange label for a white one:
 * - on `metal`: white at rest too (Collection Log, Combat Achievements, Settings header).
 * - on `tile`: white label that dims on hover, with no red state (Account panel).
 * `tone="positive"` / `tone="destructive"`: green / red label for a confirm-or-cancel pair
 * (trade Accept / Decline, "Yes, drop it"). Keep both buttons of a pair the same variant.
 *
 * Sizes (game pixels): `sm` 26, `default` 36, `lg` 44 for text; `icon-sm`, `icon`, `icon-lg` are
 * square icon-only buttons of the same heights. Icon buttons need an `aria-label`.
 * Toggles: set `aria-pressed` and the button keeps its pressed look.
 * `tooltip`: the game's dark hover label (e.g. "Close", "Bond Pouch").
 */
const buttonVariants = cva("osrs-button osrs-framed osrs-text", {
  variants: {
    variant: {
      metal: "osrs-button-metal",
      tile: "osrs-button-tile",
      stone: "",
    },
    tone: {
      default: "",
      white: "",
      positive: "osrs-button-positive",
      destructive: "osrs-button-destructive",
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
  compoundVariants: [
    { variant: "metal", tone: "white", className: "osrs-button-metal-white" },
    { variant: "tile", tone: "white", className: "osrs-button-tile-white" },
  ],
  defaultVariants: { variant: "metal", tone: "default", size: "default" },
});

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    tooltip?: React.ReactNode;
    tooltipSide?: "top" | "right" | "bottom" | "left";
  };

function Button({ className, variant, tone, size, tooltip, tooltipSide = "bottom", ...props }: ButtonProps) {
  const button = (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant ?? "metal"}
      data-size={size ?? "default"}
      data-tone={tone ?? undefined}
      className={cn(buttonVariants({ variant, tone, size }), className)}
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
