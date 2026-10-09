import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { WindowClose, WindowMenu } from "@/registry/osrs/ui/window";
import { bankSprites } from "@/registry/osrs/ui/bank-sprites";
import { buttonSprites } from "@/registry/osrs/ui/button-sprites";
import { glyphSprites } from "@/registry/osrs/ui/glyph-sprites";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;
const label = { color: "var(--osrs-white)" } as const;

// Each row is one button type from the game; columns are its states.
// Hover is forced with `data-hover` so every state is visible at once; the live buttons below react normally.
const ROWS = [
  {
    variant: "metal",
    tone: undefined,
    name: "metal",
    where: "View DPS",
    text: "View DPS",
    icon: <buttonSprites.equipmentStatsIcon />,
    pressed: "Same as hover",
  },
  {
    variant: "metal",
    tone: "white",
    name: 'metal, tone="white"',
    where: "Collection Log, Combat Achievements",
    text: "Boss list",
    icon: <buttonSprites.equipmentStatsIcon />,
    pressed: "Same as hover",
  },
  {
    variant: "tile",
    tone: undefined,
    name: "tile",
    where: "Bank, World Switcher",
    text: "Teleport",
    icon: <bankSprites.placeholdersLock />,
    pressed: "Red tile",
  },
  {
    variant: "tile",
    tone: "white",
    name: 'tile, tone="white"',
    where: "Account panel",
    text: "Open Store",
    icon: <glyphSprites.storeIcon />,
    pressed: "Same as hover",
  },
] as const;

const SIZES = [
  { text: "sm", icon: "icon-sm" },
  { text: "default", icon: "icon" },
  { text: "lg", icon: "icon-lg" },
] as const;

const QUANTITIES = ["1", "5", "10", "X", "All"];

export default function ButtonDemo() {
  const [qty, setQty] = React.useState("1");
  const [locked, setLocked] = React.useState(true);
  const [view, setView] = React.useState("tasks");
  return (
    <div className="osrs osrs-texture-stone osrs-text flex flex-col p-6" style={{ gap: px(12) }}>
      <div
        className="grid items-center"
        style={{ gridTemplateColumns: `auto repeat(5, max-content)`, gap: `${px(6)} ${px(10)}` }}
      >
        <span />
        {["Default", "Hover", "Pressed", "Disabled", "Icon"].map((h) => (
          <span key={h} className="osrs-text-small" style={label}>
            {h}
          </span>
        ))}
        {ROWS.map((r) => (
          <div key={r.name} className="contents">
            <span className="flex flex-col">
              <code className="osrs-text-small" style={{ color: "var(--osrs-orange)" }}>{r.name}</code>
              <span className="osrs-text-small" style={{ color: "#9f9f9f" }}>{r.where}</span>
            </span>
            <Button variant={r.variant} tone={r.tone}>{r.text}</Button>
            <Button variant={r.variant} tone={r.tone} data-hover="">{r.text}</Button>
            <Button variant={r.variant} tone={r.tone} aria-pressed title={r.pressed}>{r.text}</Button>
            <Button variant={r.variant} tone={r.tone} disabled>{r.text}</Button>
            <Button variant={r.variant} tone={r.tone} size="icon" aria-label={r.text}>
              {r.icon}
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-col" style={{ gap: px(6) }}>
        <span className="osrs-text-small" style={label}>
          Sizes: each text size is the height of its icon size (26 / 36 / 44)
        </span>
        <div className="flex flex-wrap items-end" style={{ gap: px(16) }}>
          {SIZES.map((sz) => (
            <div key={sz.text} className="flex flex-col" style={{ gap: px(4) }}>
              <code className="osrs-text-small" style={{ color: "var(--osrs-orange)" }}>
                {sz.text} / {sz.icon}
              </code>
              {(["metal", "tile"] as const).map((v) => (
                <div key={v} className="flex items-center" style={{ gap: px(4) }}>
                  <Button variant={v} size={sz.text}>Deposit</Button>
                  <Button variant={v} size={sz.icon} aria-label="Deposit inventory">
                    <bankSprites.depositInventory />
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center" style={{ gap: px(16) }}>
        <div className="flex items-center" style={{ gap: px(4) }}>
          {QUANTITIES.map((q) => (
            <Button key={q} variant="tile" size="icon-lg" aria-pressed={qty === q} onClick={() => setQty(q)}>
              {q}
            </Button>
          ))}
          <Button
            variant="tile"
            size="icon-lg"
            aria-label="Always set placeholders"
            aria-pressed={locked}
            onClick={() => setLocked((v) => !v)}
          >
            <bankSprites.placeholdersLock />
          </Button>
        </div>
        <Button variant="metal" tone="white" size="sm">
          Less <span style={{ color: "var(--osrs-orange)" }}>info</span>
        </Button>
        <Button variant="tile" tone="white" tooltip="Bond Pouch" style={{ minWidth: px(140), justifyContent: "space-between" }}>
          <glyphSprites.bondIcon />
          Bond Pouch
          <glyphSprites.bondIcon />
        </Button>
        <div className="flex items-center" style={{ gap: px(4) }}>
          <WindowMenu
            value={view}
            onValueChange={setView}
            items={[
              { value: "overview", label: "Overview" },
              { value: "tasks", label: "Tasks" },
            ]}
          />
          <WindowClose className="!static !translate-none" />
        </div>
      </div>
    </div>
  );
}
