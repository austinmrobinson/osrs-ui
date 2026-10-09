"use client";

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";

import { cn } from "@/lib/utils";
import { geSprites } from "@/components/ui/ge-sprites";


/**
 * The inset variant's − / + buttons (16×16): the scroll-arrow button's stone with the arrows taken off,
 * and a 2px minus or plus inked like the arrows (near-black at the top left, a step lighter per diagonal).
 */
const stepIconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 16 16",
  shapeRendering: "crispEdges",
  "aria-hidden": true,
  className: "osrs-icon",
  style: { width: "calc(16 * var(--osrs-px, 1px))", height: "calc(16 * var(--osrs-px, 1px))" },
} as const;
function MinusIcon() {
  return <svg {...stepIconProps}><path fill="#000001" d="M0 0h1v1h-1zM1 0h1v1h-1zM2 0h1v1h-1zM3 0h1v1h-1zM4 0h1v1h-1zM5 0h1v1h-1zM6 0h1v1h-1zM7 0h1v1h-1zM8 0h1v1h-1zM9 0h1v1h-1zM10 0h1v1h-1zM11 0h1v1h-1zM12 0h1v1h-1zM13 0h1v1h-1zM14 0h1v1h-1zM15 0h1v1h-1zM0 1h1v1h-1zM15 1h1v1h-1zM0 2h1v1h-1zM15 2h1v1h-1zM0 3h1v1h-1zM15 3h1v1h-1zM0 4h1v1h-1zM15 4h1v1h-1zM0 5h1v1h-1zM15 5h1v1h-1zM0 6h1v1h-1zM15 6h1v1h-1zM0 7h1v1h-1zM3 7h1v1h-1zM15 7h1v1h-1zM0 8h1v1h-1zM15 8h1v1h-1zM0 9h1v1h-1zM15 9h1v1h-1zM0 10h1v1h-1zM15 10h1v1h-1zM0 11h1v1h-1zM15 11h1v1h-1zM0 12h1v1h-1zM15 12h1v1h-1zM0 13h1v1h-1zM15 13h1v1h-1zM0 14h1v1h-1zM15 14h1v1h-1zM0 15h1v1h-1zM1 15h1v1h-1zM2 15h1v1h-1zM3 15h1v1h-1zM4 15h1v1h-1zM5 15h1v1h-1zM6 15h1v1h-1zM7 15h1v1h-1zM8 15h1v1h-1zM9 15h1v1h-1zM10 15h1v1h-1zM11 15h1v1h-1zM12 15h1v1h-1zM13 15h1v1h-1zM14 15h1v1h-1zM15 15h1v1h-1z" /><path fill="#ad956d" d="M1 1h1v1h-1z" /><path fill="#9b8562" d="M2 1h1v1h-1zM1 2h1v1h-1z" /><path fill="#927d5c" d="M3 1h1v1h-1zM1 3h1v1h-1z" /><path fill="#8c7959" d="M4 1h1v1h-1zM5 1h1v1h-1zM6 1h1v1h-1zM1 4h1v1h-1zM1 5h1v1h-1zM1 6h1v1h-1zM1 7h1v1h-1z" /><path fill="#897657" d="M7 1h1v1h-1zM8 1h1v1h-1zM9 1h1v1h-1zM1 8h1v1h-1zM1 9h1v1h-1z" /><path fill="#847254" d="M10 1h1v1h-1zM11 1h1v1h-1zM12 1h1v1h-1zM1 10h1v1h-1zM1 11h1v1h-1zM1 12h1v1h-1z" /><path fill="#806e52" d="M13 1h1v1h-1zM2 2h1v1h-1z" /><path fill="#736349" d="M14 1h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM6 2h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM9 2h1v1h-1zM3 3h1v1h-1zM2 4h1v1h-1zM2 5h1v1h-1zM3 5h1v1h-1zM2 6h1v1h-1zM2 7h1v1h-1zM2 8h1v1h-1zM2 9h1v1h-1z" /><path fill="#78674c" d="M3 2h1v1h-1zM2 3h1v1h-1zM1 13h1v1h-1z" /><path fill="#6f6046" d="M10 2h1v1h-1zM4 3h1v1h-1zM5 3h1v1h-1zM6 3h1v1h-1zM3 4h1v1h-1zM4 4h1v1h-1zM5 4h1v1h-1zM3 6h1v1h-1zM2 10h1v1h-1z" /><path fill="#6b5c44" d="M11 2h1v1h-1zM12 2h1v1h-1zM13 2h1v1h-1zM9 3h1v1h-1zM10 3h1v1h-1zM11 3h1v1h-1zM6 4h1v1h-1zM8 4h1v1h-1zM10 4h1v1h-1zM4 5h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM7 5h1v1h-1zM8 5h1v1h-1zM4 6h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM7 6h1v1h-1zM8 6h1v1h-1zM3 9h1v1h-1zM4 9h1v1h-1zM5 9h1v1h-1zM3 10h1v1h-1zM4 10h1v1h-1zM2 11h1v1h-1zM3 11h1v1h-1zM2 12h1v1h-1z" /><path fill="#594d3a" d="M14 2h1v1h-1zM13 7h1v1h-1zM13 8h1v1h-1zM13 9h1v1h-1zM12 10h1v1h-1zM12 11h1v1h-1zM10 12h1v1h-1zM11 12h1v1h-1zM12 12h1v1h-1zM7 13h1v1h-1zM8 13h1v1h-1zM9 13h1v1h-1z" /><path fill="#716248" d="M7 3h1v1h-1z" /><path fill="#706047" d="M8 3h1v1h-1z" /><path fill="#655741" d="M12 3h1v1h-1zM9 4h1v1h-1zM11 4h1v1h-1zM12 4h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM11 5h1v1h-1zM12 5h1v1h-1zM9 6h1v1h-1zM10 6h1v1h-1zM11 6h1v1h-1zM6 9h1v1h-1zM7 9h1v1h-1zM8 9h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM7 10h1v1h-1zM4 11h1v1h-1zM5 11h1v1h-1zM6 11h1v1h-1zM7 11h1v1h-1zM3 12h1v1h-1zM4 12h1v1h-1zM5 12h1v1h-1zM2 13h1v1h-1z" /><path fill="#60533e" d="M13 3h1v1h-1zM13 4h1v1h-1zM12 6h1v1h-1zM9 9h1v1h-1zM10 9h1v1h-1zM8 10h1v1h-1zM9 10h1v1h-1zM6 12h1v1h-1zM3 13h1v1h-1zM4 13h1v1h-1z" /><path fill="#4c4231" d="M14 3h1v1h-1zM14 4h1v1h-1zM14 5h1v1h-1zM14 6h1v1h-1zM13 13h1v1h-1zM3 14h1v1h-1zM4 14h1v1h-1zM5 14h1v1h-1zM6 14h1v1h-1zM7 14h1v1h-1zM8 14h1v1h-1z" /><path fill="#6d5e45" d="M7 4h1v1h-1z" /><path fill="#5c513c" d="M13 5h1v1h-1zM13 6h1v1h-1zM11 9h1v1h-1zM12 9h1v1h-1zM10 10h1v1h-1zM11 10h1v1h-1zM9 11h1v1h-1zM10 11h1v1h-1zM11 11h1v1h-1zM9 12h1v1h-1zM5 13h1v1h-1zM6 13h1v1h-1zM1 14h1v1h-1z" /><path fill="#0a0806" d="M4 7h1v1h-1zM3 8h1v1h-1z" /><path fill="#0d0b08" d="M5 7h1v1h-1zM4 8h1v1h-1z" /><path fill="#110e0a" d="M6 7h1v1h-1zM5 8h1v1h-1z" /><path fill="#15120c" d="M7 7h1v1h-1zM6 8h1v1h-1z" /><path fill="#1b1711" d="M8 7h1v1h-1zM7 8h1v1h-1z" /><path fill="#221d15" d="M9 7h1v1h-1zM10 7h1v1h-1zM8 8h1v1h-1zM9 8h1v1h-1z" /><path fill="#2a241b" d="M11 7h1v1h-1zM10 8h1v1h-1z" /><path fill="#2f281d" d="M12 7h1v1h-1zM11 8h1v1h-1z" /><path fill="#493f30" d="M14 7h1v1h-1zM9 14h1v1h-1z" /><path fill="#332c20" d="M12 8h1v1h-1z" /><path fill="#483f2f" d="M14 8h1v1h-1z" /><path fill="#443c2d" d="M14 9h1v1h-1zM14 10h1v1h-1zM14 11h1v1h-1zM10 14h1v1h-1zM11 14h1v1h-1zM12 14h1v1h-1z" /><path fill="#544937" d="M13 10h1v1h-1zM13 11h1v1h-1zM13 12h1v1h-1zM10 13h1v1h-1zM11 13h1v1h-1zM12 13h1v1h-1zM2 14h1v1h-1z" /><path fill="#60543e" d="M8 11h1v1h-1z" /><path fill="#5f523e" d="M7 12h1v1h-1z" /><path fill="#5d513c" d="M8 12h1v1h-1z" /><path fill="#3f382a" d="M14 12h1v1h-1z" /><path fill="#2e291f" d="M14 13h1v1h-1z" /><path fill="#302a20" d="M13 14h1v1h-1z" /><path fill="#181510" d="M14 14h1v1h-1z" /></svg>;
}
function PlusIcon() {
  return <svg {...stepIconProps}><path fill="#000001" d="M0 0h1v1h-1zM1 0h1v1h-1zM2 0h1v1h-1zM3 0h1v1h-1zM4 0h1v1h-1zM5 0h1v1h-1zM6 0h1v1h-1zM7 0h1v1h-1zM8 0h1v1h-1zM9 0h1v1h-1zM10 0h1v1h-1zM11 0h1v1h-1zM12 0h1v1h-1zM13 0h1v1h-1zM14 0h1v1h-1zM15 0h1v1h-1zM0 1h1v1h-1zM15 1h1v1h-1zM0 2h1v1h-1zM15 2h1v1h-1zM0 3h1v1h-1zM7 3h1v1h-1zM15 3h1v1h-1zM0 4h1v1h-1zM15 4h1v1h-1zM0 5h1v1h-1zM15 5h1v1h-1zM0 6h1v1h-1zM15 6h1v1h-1zM0 7h1v1h-1zM3 7h1v1h-1zM15 7h1v1h-1zM0 8h1v1h-1zM15 8h1v1h-1zM0 9h1v1h-1zM15 9h1v1h-1zM0 10h1v1h-1zM15 10h1v1h-1zM0 11h1v1h-1zM15 11h1v1h-1zM0 12h1v1h-1zM15 12h1v1h-1zM0 13h1v1h-1zM15 13h1v1h-1zM0 14h1v1h-1zM15 14h1v1h-1zM0 15h1v1h-1zM1 15h1v1h-1zM2 15h1v1h-1zM3 15h1v1h-1zM4 15h1v1h-1zM5 15h1v1h-1zM6 15h1v1h-1zM7 15h1v1h-1zM8 15h1v1h-1zM9 15h1v1h-1zM10 15h1v1h-1zM11 15h1v1h-1zM12 15h1v1h-1zM13 15h1v1h-1zM14 15h1v1h-1zM15 15h1v1h-1z" /><path fill="#ad956d" d="M1 1h1v1h-1z" /><path fill="#9b8562" d="M2 1h1v1h-1zM1 2h1v1h-1z" /><path fill="#927d5c" d="M3 1h1v1h-1zM1 3h1v1h-1z" /><path fill="#8c7959" d="M4 1h1v1h-1zM5 1h1v1h-1zM6 1h1v1h-1zM1 4h1v1h-1zM1 5h1v1h-1zM1 6h1v1h-1zM1 7h1v1h-1z" /><path fill="#897657" d="M7 1h1v1h-1zM8 1h1v1h-1zM9 1h1v1h-1zM1 8h1v1h-1zM1 9h1v1h-1z" /><path fill="#847254" d="M10 1h1v1h-1zM11 1h1v1h-1zM12 1h1v1h-1zM1 10h1v1h-1zM1 11h1v1h-1zM1 12h1v1h-1z" /><path fill="#806e52" d="M13 1h1v1h-1zM2 2h1v1h-1z" /><path fill="#736349" d="M14 1h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM6 2h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM9 2h1v1h-1zM3 3h1v1h-1zM2 4h1v1h-1zM2 5h1v1h-1zM3 5h1v1h-1zM2 6h1v1h-1zM2 7h1v1h-1zM2 8h1v1h-1zM2 9h1v1h-1z" /><path fill="#78674c" d="M3 2h1v1h-1zM2 3h1v1h-1zM1 13h1v1h-1z" /><path fill="#6f6046" d="M10 2h1v1h-1zM4 3h1v1h-1zM5 3h1v1h-1zM6 3h1v1h-1zM3 4h1v1h-1zM4 4h1v1h-1zM5 4h1v1h-1zM3 6h1v1h-1zM2 10h1v1h-1z" /><path fill="#6b5c44" d="M11 2h1v1h-1zM12 2h1v1h-1zM13 2h1v1h-1zM9 3h1v1h-1zM10 3h1v1h-1zM11 3h1v1h-1zM6 4h1v1h-1zM10 4h1v1h-1zM4 5h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM4 6h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM3 9h1v1h-1zM4 9h1v1h-1zM5 9h1v1h-1zM3 10h1v1h-1zM4 10h1v1h-1zM2 11h1v1h-1zM3 11h1v1h-1zM2 12h1v1h-1z" /><path fill="#594d3a" d="M14 2h1v1h-1zM13 7h1v1h-1zM13 8h1v1h-1zM13 9h1v1h-1zM12 10h1v1h-1zM12 11h1v1h-1zM10 12h1v1h-1zM11 12h1v1h-1zM12 12h1v1h-1zM7 13h1v1h-1zM8 13h1v1h-1zM9 13h1v1h-1z" /><path fill="#0a0806" d="M8 3h1v1h-1zM7 4h1v1h-1zM4 7h1v1h-1zM3 8h1v1h-1z" /><path fill="#655741" d="M12 3h1v1h-1zM9 4h1v1h-1zM11 4h1v1h-1zM12 4h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM11 5h1v1h-1zM12 5h1v1h-1zM9 6h1v1h-1zM10 6h1v1h-1zM11 6h1v1h-1zM6 9h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM4 11h1v1h-1zM5 11h1v1h-1zM6 11h1v1h-1zM3 12h1v1h-1zM4 12h1v1h-1zM5 12h1v1h-1zM2 13h1v1h-1z" /><path fill="#60533e" d="M13 3h1v1h-1zM13 4h1v1h-1zM12 6h1v1h-1zM9 9h1v1h-1zM10 9h1v1h-1zM9 10h1v1h-1zM6 12h1v1h-1zM3 13h1v1h-1zM4 13h1v1h-1z" /><path fill="#4c4231" d="M14 3h1v1h-1zM14 4h1v1h-1zM14 5h1v1h-1zM14 6h1v1h-1zM13 13h1v1h-1zM3 14h1v1h-1zM4 14h1v1h-1zM5 14h1v1h-1zM6 14h1v1h-1zM7 14h1v1h-1zM8 14h1v1h-1z" /><path fill="#0d0b08" d="M8 4h1v1h-1zM7 5h1v1h-1zM5 7h1v1h-1zM4 8h1v1h-1z" /><path fill="#110e0a" d="M8 5h1v1h-1zM7 6h1v1h-1zM6 7h1v1h-1zM5 8h1v1h-1z" /><path fill="#5c513c" d="M13 5h1v1h-1zM13 6h1v1h-1zM11 9h1v1h-1zM12 9h1v1h-1zM10 10h1v1h-1zM11 10h1v1h-1zM9 11h1v1h-1zM10 11h1v1h-1zM11 11h1v1h-1zM9 12h1v1h-1zM5 13h1v1h-1zM6 13h1v1h-1zM1 14h1v1h-1z" /><path fill="#15120c" d="M8 6h1v1h-1zM7 7h1v1h-1zM6 8h1v1h-1z" /><path fill="#1b1711" d="M8 7h1v1h-1zM7 8h1v1h-1z" /><path fill="#221d15" d="M9 7h1v1h-1zM10 7h1v1h-1zM8 8h1v1h-1zM9 8h1v1h-1zM7 9h1v1h-1zM8 9h1v1h-1zM7 10h1v1h-1z" /><path fill="#2a241b" d="M11 7h1v1h-1zM10 8h1v1h-1zM8 10h1v1h-1zM7 11h1v1h-1z" /><path fill="#2f281d" d="M12 7h1v1h-1zM11 8h1v1h-1zM8 11h1v1h-1zM7 12h1v1h-1z" /><path fill="#493f30" d="M14 7h1v1h-1zM9 14h1v1h-1z" /><path fill="#332c20" d="M12 8h1v1h-1zM8 12h1v1h-1z" /><path fill="#483f2f" d="M14 8h1v1h-1z" /><path fill="#443c2d" d="M14 9h1v1h-1zM14 10h1v1h-1zM14 11h1v1h-1zM10 14h1v1h-1zM11 14h1v1h-1zM12 14h1v1h-1z" /><path fill="#544937" d="M13 10h1v1h-1zM13 11h1v1h-1zM13 12h1v1h-1zM10 13h1v1h-1zM11 13h1v1h-1zM12 13h1v1h-1zM2 14h1v1h-1z" /><path fill="#3f382a" d="M14 12h1v1h-1z" /><path fill="#2e291f" d="M14 13h1v1h-1z" /><path fill="#302a20" d="M13 14h1v1h-1z" /><path fill="#181510" d="M14 14h1v1h-1z" /></svg>;
}

/**
 * A number field. `variant="ge"` (default) is the Grand Exchange quantity field with − / + buttons
 * either side; `variant="inset"` puts − / + buttons inside the field, drawn like a Select's arrow button: − on the left, + on the right.
 * `aria-label` names the text input itself (and its − / + buttons), for fields without a visible label.
 */
function NumberField({
  className,
  variant = "ge",
  "aria-label": label,
  ...props
}: NumberFieldPrimitive.Root.Props & { variant?: "ge" | "inset"; "aria-label"?: string }) {
  const less = label ? `Decrease ${label}` : "Decrease";
  const more = label ? `Increase ${label}` : "Increase";
  if (variant === "inset")
    return (
      <NumberFieldPrimitive.Root data-slot="number-field" data-variant="inset" className={cn("osrs-number-field-inset osrs-well osrs-text", className)} {...props}>
        <NumberFieldPrimitive.Group className="contents">
          <NumberFieldPrimitive.Decrement className="osrs-number-arrow" aria-label={less}>
            <MinusIcon />
          </NumberFieldPrimitive.Decrement>
          <NumberFieldPrimitive.Input aria-label={label} className="osrs-number-input" />
          <NumberFieldPrimitive.Increment className="osrs-number-arrow" aria-label={more}>
            <PlusIcon />
          </NumberFieldPrimitive.Increment>
        </NumberFieldPrimitive.Group>
      </NumberFieldPrimitive.Root>
    );
  return (
    <NumberFieldPrimitive.Root data-slot="number-field" className={cn("osrs-number-field", className)} {...props}>
      <NumberFieldPrimitive.Group className="contents">
        <NumberFieldPrimitive.Decrement className="osrs-number-step" aria-label={less}>
          <geSprites.decrementButton />
        </NumberFieldPrimitive.Decrement>
        <NumberFieldPrimitive.Input aria-label={label} className="osrs-number-input osrs-well osrs-text w-[calc(70*var(--osrs-px))]" />
        <NumberFieldPrimitive.Increment className="osrs-number-step" aria-label={more}>
          <geSprites.incrementButton />
        </NumberFieldPrimitive.Increment>
      </NumberFieldPrimitive.Group>
    </NumberFieldPrimitive.Root>
  );
}

export { NumberField };
