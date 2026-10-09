// Shared helpers for the contrived gallery (gallery). Each example is a made-up interface
// built only from library components, following .claude/skills/osrs-interface, for rating.
import * as React from "react";

import { Window, WindowClose, WindowHeader } from "@/registry/osrs/ui/window";

export const px = (n: number) => `calc(${n} * var(--osrs-px))`;

export type Archetype = "window" | "panel" | "chatbox";
export type GalleryExample = {
  id: string;
  title: string;
  archetype: Archetype;
  /** What it's testing: the layout pattern and the components in play. */
  brief: string;
  Component: () => React.ReactElement;
};

/** A window at the game's sizes, with a title and close. */
export function Win({
  title,
  frame = "tan",
  width = 488,
  height = 314,
  start,
  children,
}: {
  title: React.ReactNode;
  frame?: "tan" | "rivets";
  width?: number;
  height?: number;
  start?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Window frame={frame} style={{ width: px(width), height: px(height) }} className="flex flex-col">
      <WindowHeader start={start} end={<WindowClose />}>
        {title}
      </WindowHeader>
      <div className="flex min-h-0 flex-1 flex-col" style={{ gap: px(6), padding: px(2) }}>
        {children}
      </div>
    </Window>
  );
}

/** One orange, centred instruction line under the title. */
export function Instruction({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 text-center" style={{ color: "var(--osrs-orange)" }}>
      {children}
    </p>
  );
}

export const Row = ({ gap = 6, className, style, ...props }: React.ComponentProps<"div"> & { gap?: number }) => (
  <div className={["flex", className].filter(Boolean).join(" ")} style={{ gap: px(gap), ...style }} {...props} />
);
export const Col = ({ gap = 6, className, style, ...props }: React.ComponentProps<"div"> & { gap?: number }) => (
  <div className={["flex flex-col", className].filter(Boolean).join(" ")} style={{ gap: px(gap), ...style }} {...props} />
);
export const White = ({ children }: { children: React.ReactNode }) => <span style={{ color: "var(--osrs-white)" }}>{children}</span>;
export const Yellow = ({ children }: { children: React.ReactNode }) => <span style={{ color: "var(--osrs-yellow)" }}>{children}</span>;
export const Green = ({ children }: { children: React.ReactNode }) => <span style={{ color: "#0dc10d" }}>{children}</span>;
export const Red = ({ children }: { children: React.ReactNode }) => <span style={{ color: "#ff3030" }}>{children}</span>;
export const Grey = ({ children }: { children: React.ReactNode }) => <span style={{ color: "#9f9f9f" }}>{children}</span>;
