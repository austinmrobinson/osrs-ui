"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";
import { px } from "@/lib/osrs";
import { chatboxSprites } from "@/components/ui/chatbox-sprites";

/** The parchment chatbox. Its frame is a 9-slice, so it can be any size. */
function Chatbox({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chatbox"
      className={cn("osrs-chatbox osrs-framed osrs-frame-chatbox", className)}
      style={{ width: px(519), height: px(142), ...style }}
      {...props}
    />
  );
}

type ChatTab = { value: string; label: string; status?: React.ReactNode; statusColor?: string };

/** The stone strip of chat filter buttons under the chatbox. */
function ChatboxTabs({
  tabs,
  className,
  style,
  ...props
}: TabsPrimitive.Root.Props & { tabs: ChatTab[] }) {
  return (
    <TabsPrimitive.Root data-slot="chatbox-tabs" className={cn("relative", className)} style={{ width: px(519), height: px(23), ...style }} {...props}>
      <chatboxSprites.buttonsBackgroundStones className="absolute inset-0" />
      <TabsPrimitive.List className="absolute inset-0 flex" style={{ paddingLeft: px(5), gap: px(6), paddingTop: px(1) }}>
        {tabs.map((t) => (
          <TabsPrimitive.Tab
            key={t.value}
            value={t.value}
            className="group relative shrink-0 cursor-pointer border-0 bg-transparent p-0 outline-none"
            style={{ width: px(56), height: px(22) }}
          >
            <chatboxSprites.button className="absolute inset-0 group-hover:opacity-0 group-data-[active]:opacity-0" />
            <chatboxSprites.buttonHovered className="absolute inset-0 opacity-0 group-hover:opacity-100 group-data-[active]:opacity-0" />
            <chatboxSprites.buttonSelected className="absolute inset-0 opacity-0 group-data-[active]:opacity-100" />
            <span className="osrs-text osrs-text-small absolute inset-0 flex flex-col items-center justify-center" style={{ lineHeight: px(10), color: "var(--osrs-white)" }}>
              <span>{t.label}</span>
              {t.status ? <span style={{ color: t.statusColor ?? "var(--osrs-green)" }}>{t.status}</span> : null}
            </span>
          </TabsPrimitive.Tab>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}

/** One chat line: optional sender, message text. */
function ChatMessage({
  name,
  children,
  color = "#000000",
  nameColor = "#000000",
  className,
  ...props
}: React.ComponentProps<"div"> & { name?: React.ReactNode; color?: string; nameColor?: string }) {
  return (
    <div data-slot="chat-message" className={cn("osrs-text osrs-text-plain", className)} style={{ color }} {...props}>
      {name ? <span style={{ color: nameColor }}>{name}: </span> : null}
      {children}
    </div>
  );
}

/** NPC / player dialogue: chathead, red name, Quill text and "Click here to continue". */
function NpcDialogue({
  name,
  head,
  side = "left",
  onContinue,
  continueLabel = "Click here to continue",
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  name: React.ReactNode;
  head?: React.ReactNode;
  side?: "left" | "right";
  onContinue?: () => void;
  continueLabel?: React.ReactNode;
}) {
  return (
    <Chatbox className={cn("flex items-center", side === "right" && "flex-row-reverse", className)} {...props}>
      <div className="flex shrink-0 items-center justify-center" style={{ width: px(100), height: "100%" }}>
        {head}
      </div>
      <div
        className="osrs-text osrs-text-quill flex flex-1 flex-col items-center justify-between self-stretch text-center"
        style={{ padding: `${px(10)} ${px(10)} ${px(12)}`, color: "#000" }}
      >
        <div style={{ color: "#800000" }}>{name}</div>
        <div className="flex flex-1 items-center">{children}</div>
        <button
          type="button"
          onClick={onContinue}
          className="osrs-dialogue-continue cursor-pointer border-0 bg-transparent p-0"
          style={{ font: "inherit", color: "#0000ff" }}
        >
          {continueLabel}
        </button>
      </div>
      <div className="shrink-0" style={{ width: px(100) }} />
    </Chatbox>
  );
}

/** "Select an Option" dialogue. */
function OptionDialogue({
  title = "Select an Option",
  options,
  onSelect,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onSelect"> & { title?: React.ReactNode; options: React.ReactNode[]; onSelect?: (index: number) => void }) {
  return (
    <Chatbox className={cn("flex flex-col items-center justify-center", className)} {...props}>
      <div className="osrs-text osrs-text-quill text-center" style={{ color: "#800000" }}>
        {title}
      </div>
      <div className="flex flex-col items-center" role="menu">
        {options.map((o, i) => (
          <button
            key={i}
            type="button"
            role="menuitem"
            onClick={() => onSelect?.(i)}
            className="osrs-text osrs-text-quill osrs-dialogue-option cursor-pointer border-0 bg-transparent p-0"
          >
            {o}
          </button>
        ))}
      </div>
    </Chatbox>
  );
}

export { Chatbox, ChatboxTabs, ChatMessage, NpcDialogue, OptionDialogue };
export type { ChatTab };
