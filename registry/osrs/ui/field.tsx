"use client";

import * as React from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Fields, with shadcn/ui's Field API, drawn the way the game groups controls.
 *
 * `FieldSet` + `FieldLegend`:
 * - `variant="box"` (default): the game's group box, a bevelled inset with an orange title centred on
 *   top ("Pouch", "Bank Fillers", "Relics").
 * - `variant="section"`: a settings section, a white bold title band over striped rows (All Settings).
 *
 * `Field` is one labelled control. `orientation="horizontal"` (default): label (and description)
 * left, control right, for checkboxes, inputs and dropdowns. `"vertical"`: centred bold title,
 * description, then the control, for sliders. Its `FieldLabel` names the control inside it
 * (inputs, selects, checkboxes, number fields, sliders) with no ids to wire up.
 * `density`: `"default"` is the game's own row; `"relaxed"` and `"spacious"` give the label and
 * control more room inside each stripe (a sidebar's export options, a settings popover).
 */
const fieldSetVariants = cva("", {
  variants: {
    variant: {
      box: "osrs-group-box osrs-text",
      section: "osrs-field-section flex flex-col",
    },
  },
  defaultVariants: { variant: "box" },
});

function FieldSet({ className, variant, ...props }: React.ComponentProps<"fieldset"> & VariantProps<typeof fieldSetVariants>) {
  return <fieldset data-slot="field-set" data-variant={variant ?? "box"} className={cn(fieldSetVariants({ variant }), className)} {...props} />;
}

function FieldLegend({ className, ...props }: React.ComponentProps<"legend">) {
  return <legend data-slot="field-legend" className={cn("osrs-field-legend", className)} {...props} />;
}

/** Stacks fields (or field sets) with the game's 6px gap. */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-group" className={cn("flex flex-col", className)} style={{ gap: "calc(6 * var(--osrs-px))" }} {...props} />;
}

function Field({
  className,
  orientation = "horizontal",
  density = "default",
  ...props
}: FieldPrimitive.Root.Props & { orientation?: "horizontal" | "vertical"; density?: "default" | "relaxed" | "spacious" }) {
  return (
    <FieldPrimitive.Root
      data-slot="field"
      data-orientation={orientation}
      data-layout={orientation === "vertical" ? "stacked" : "inline"}
      data-density={density === "default" ? undefined : density}
      className={cn("osrs-setting-row", className)}
      {...props}
    />
  );
}

/** Wraps a title and description beside the control. */
function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-content" className={cn("flex min-w-0 flex-col", className)} {...props} />;
}

/** The field's label: names the control in its `Field`, and clicking it focuses the control. */
function FieldLabel({ className, ...props }: FieldPrimitive.Label.Props) {
  return <FieldPrimitive.Label data-slot="field-label" className={cn("cursor-pointer", className)} {...props} />;
}

/** A bold orange title, for fields with a description. */
function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-title" className={cn("osrs-setting-title", className)} {...props} />;
}

/** Extra detail under the label; read out with the control (aria-describedby). */
function FieldDescription({ className, ...props }: FieldPrimitive.Description.Props) {
  return <FieldPrimitive.Description data-slot="field-description" className={cn("osrs-setting-desc m-0", className)} {...props} />;
}

export { FieldSet, FieldLegend, FieldGroup, Field, FieldContent, FieldLabel, FieldTitle, FieldDescription };
