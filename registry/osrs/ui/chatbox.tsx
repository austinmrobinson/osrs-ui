"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";
import { px } from "@/lib/osrs";
import { chatboxSprites } from "@/components/ui/chatbox-sprites";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * The parchment chatbox. Its frame is a 9-slice, so it can be any size.
 * `size="game"` (default): the game's own 519 x 142. `size="fit"`: as wide as its container and as
 * tall as what's in it (a dialogue on a web page, a chat log of any length).
 */
function Chatbox({ className, style, size = "game", ...props }: React.ComponentProps<"div"> & { size?: "game" | "fit" }) {
  return (
    <div
      data-slot="chatbox"
      data-size={size}
      className={cn("osrs-chatbox osrs-framed osrs-frame-chatbox", className)}
      style={size === "game" ? { width: px(519), height: px(142), ...style } : { width: "100%", minHeight: px(60), ...style }}
      {...props}
    />
  );
}

type ChatTab = { value: string; label: string; status?: React.ReactNode; statusColor?: string };

/** The stone strip of chat filter buttons under the chatbox. */
function ChatboxTabs({
  tabs,
  report,
  onReport,
  className,
  style,
  ...props
}: TabsPrimitive.Root.Props & {
  tabs: ChatTab[];
  /** The red Report button at the strip's end: its label, or `true` for "Report". */
  report?: React.ReactNode;
  onReport?: () => void;
}) {
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
      {report ? (
        <button
          type="button"
          onClick={onReport}
          className="group absolute cursor-pointer border-0 bg-transparent p-0"
          style={{ left: px(437), top: 0, width: px(79), height: px(22) }}
        >
          <chatboxSprites.reportButton className="absolute inset-0 group-hover:opacity-0" />
          <chatboxSprites.reportButtonHovered className="absolute inset-0 opacity-0 group-hover:opacity-100" />
          <span className="osrs-text osrs-text-small absolute inset-0 flex items-center justify-center" style={{ color: "var(--osrs-white)" }}>
            {report === true ? "Report" : report}
          </span>
        </button>
      ) : null}
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

/**
 * The chat log of a game-size Chatbox: messages stacked from the bottom (the newest last), above the
 * input line, with the game's scrollbar down the right.
 */
function ChatboxMessages({ className, style, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="chatbox-messages" className={cn("absolute", className)} style={{ left: px(10), right: px(7), top: px(6), height: px(114), ...style }} {...props}>
      <ScrollArea className="size-full">
        <div className="flex flex-col justify-end" style={{ minHeight: px(114), lineHeight: px(14) }}>
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}

/** The input line under a game-size Chatbox's messages: the player's name in black, what they're
 *  typing in blue, then the blue `*` caret. */
function ChatboxInput({ name, children, caret = true, className, style, ...props }: React.ComponentProps<"div"> & { name: React.ReactNode; caret?: boolean }) {
  return (
    <div data-slot="chatbox-input" className={cn("absolute", className)} style={{ left: px(10), right: px(7), top: px(120), ...style }} {...props}>
      <div style={{ marginLeft: px(-3), height: px(1), background: "#807660" }} />
      <div className="osrs-text whitespace-pre" style={{ color: "#000000", lineHeight: px(14) }}>
        {name}: <span style={{ color: "#0000ff" }}>{children}</span>
        <span style={{ color: "#0000ff", visibility: caret ? undefined : "hidden" }}>*</span>
      </div>
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
}: React.ComponentProps<typeof Chatbox> & {
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
          style={{ font: "inherit" }}
        >
          {continueLabel}
        </button>
      </div>
      <div className="shrink-0" style={{ width: px(100) }} />
    </Chatbox>
  );
}

/**
 * "Select an Option" dialogue. Options are numbered, and the number keys pick them, as in game;
 * set `numbered={false}` for the older unnumbered style.
 */
function OptionDialogue({
  title = "Select an Option",
  options,
  onSelect,
  numbered = true,
  className,
  style,
  ...props
}: Omit<React.ComponentProps<typeof Chatbox>, "onSelect"> & {
  title?: React.ReactNode;
  options: React.ReactNode[];
  onSelect?: (index: number) => void;
  numbered?: boolean;
}) {
  React.useEffect(() => {
    if (!numbered || !onSelect) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable]")) return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) onSelect(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [numbered, onSelect, options.length]);

  return (
    <Chatbox className={cn("flex flex-col items-center justify-center", className)} style={{ gap: px(8), ...style }} {...props}>
      <div className="osrs-text osrs-text-quill text-center" style={{ color: "#800000" }}>
        {title}
      </div>
      <div className="flex flex-col items-center" style={{ gap: px(2) }} role="menu">
        {options.map((o, i) => (
          <button
            key={i}
            type="button"
            role="menuitem"
            onClick={() => onSelect?.(i)}
            className="osrs-text osrs-text-quill osrs-dialogue-option cursor-pointer border-0 bg-transparent p-0"
          >
            {numbered ? `${i + 1}. ` : null}
            {o}
          </button>
        ))}
      </div>
    </Chatbox>
  );
}

export { Chatbox, ChatboxInput, ChatboxMessages, ChatboxTabs, ChatMessage, NpcDialogue, OptionDialogue };
export type { ChatTab };
