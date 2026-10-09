import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva("osrs-button osrs-framed osrs-frame-stone-button osrs-text", {
  variants: {
    variant: {
      stone: "",
      square: "osrs-button-square",
    },
    size: {
      default: "",
      sm: "osrs-button-sm",
      icon: "osrs-button-icon",
    },
  },
  defaultVariants: { variant: "stone", size: "default" },
});

function Button({ className, variant, size, ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
