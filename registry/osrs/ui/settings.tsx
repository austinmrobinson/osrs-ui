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

/** Label on the left, control on the right. */
function SettingRow({ label, className, children, ...props }: React.ComponentProps<"div"> & { label: React.ReactNode }) {
  return (
    <div data-slot="setting-row" className={cn("osrs-setting-row", className)} {...props}>
      <span>{label}</span>
      {children}
    </div>
  );
}

export { SettingsSection, SettingRow };
