import * as React from "react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

/** Numbered steps down a rail: each step's number in a notched frame, joined to the next by a separator. */
function Steps({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol data-slot="steps" className={cn("osrs-steps osrs-text", className)} {...props} />;
}

/** One step: its number (`n`, or pass `number` for something else), a white bold `title`, then the body. */
function Step({
  n,
  number,
  title,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"li">, "title"> & { n?: number; number?: React.ReactNode; title?: React.ReactNode }) {
  return (
    <li data-slot="step" className={cn("osrs-step", className)} {...props}>
      <span className="osrs-step-rail" aria-hidden="true">
        <StepNumber>{number ?? n}</StepNumber>
        <Separator orientation="vertical" />
      </span>
      <div className="osrs-step-body">
        {title ? <h3 className="osrs-step-title">{title}</h3> : null}
        {children}
      </div>
    </li>
  );
}

/** A step's number in yellow on the flat notched frame; also usable on its own as a numbered badge. */
function StepNumber({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="step-number" className={cn("osrs-step-number osrs-framed osrs-text", className)} {...props} />;
}

export { Steps, Step, StepNumber };
