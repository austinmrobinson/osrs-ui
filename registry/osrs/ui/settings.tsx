import * as React from "react";

import { cn } from "@/lib/utils";

/** A titled group of setting rows (white bold band, then striped rows). */
function SettingsSection({ title, className, children, ...props }: React.ComponentProps<"section"> & { title?: React.ReactNode }) {
  return (
    <section data-slot="settings-section" className={cn("flex flex-col", className)} {...props}>
      {title ? <div className="osrs-section-title">{title}</div> : null}
      {children}
    </section>
  );
}

/**
 * One setting. `inline` (default): label (and description) left, control right — toggles, inputs.
 * `stacked`: centred bold title, description, then the control — sliders.
 */
function SettingRow({
  label,
  description,
  layout = "inline",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { label: React.ReactNode; description?: React.ReactNode; layout?: "inline" | "stacked" }) {
  const text = description ? (
    <div className="flex min-w-0 flex-col">
      <span className="osrs-setting-title">{label}</span>
      <span className="osrs-setting-desc">{description}</span>
    </div>
  ) : (
    <span>{label}</span>
  );
  return (
    <div data-slot="setting-row" data-layout={layout} className={cn("osrs-setting-row", className)} {...props}>
      {text}
      {children}
    </div>
  );
}

export { SettingsSection, SettingRow };
