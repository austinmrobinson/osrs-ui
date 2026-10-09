// Blume Callout override: a notched OSRS card, tinted by type.
import * as React from "react";

import { Card } from "@/registry/osrs/ui/card";

const TONES: Record<string, string> = {
  info: "var(--osrs-orange)",
  note: "var(--osrs-orange)",
  tip: "var(--osrs-green)",
  success: "var(--osrs-green)",
  check: "var(--osrs-green)",
  warning: "var(--osrs-yellow)",
  caution: "var(--osrs-yellow)",
  danger: "#ff4040",
};

export default function Callout({ type = "info", title, children }: { type?: string; title?: string; children?: React.ReactNode }) {
  return (
    <Card className="osrs-site-callout my-6" style={{ color: TONES[type] ?? TONES.info }}>
      {title ? <div style={{ fontFamily: "var(--osrs-font-bold)", color: "var(--osrs-white)" }}>{title}</div> : null}
      <div className="osrs-site-callout-body">{children}</div>
    </Card>
  );
}
