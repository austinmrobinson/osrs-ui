"use client";

// The Recipes card's art: the Bank, built from the library, at the game's own 1x, cropped off the
// card's right and bottom edges. Made with Stageshow (site/stageshow, MIT). One beat, played once
// when the card scrolls into view: the cursor right-clicks the Twisted bow, the game's "Choose
// Option" menu opens under it, Withdraw-1 lights up yellow, and the bow is left behind as a
// placeholder (faded, quantity 0), as the game does with placeholders on. The menu opens and
// closes instantly, as it does in game. The poster (reduced motion, first paint) is the open menu.
import { Interface, InterfaceHeader, InterfaceTitle, InterfaceClose } from "@/registry/osrs/ui/interface";
import { ItemSlot } from "@/registry/osrs/ui/item-slot";
import { Tabs, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";
import { bankSprites } from "@/registry/osrs/ui/bank-sprites";
import { buttonSprites } from "@/registry/osrs/ui/button-sprites";
import { WindowSeparator } from "@/registry/osrs/ui/window";
import { items, type ItemId } from "@/site/demo-data/items";
import type { Act } from "./stageshow/act";
import { Stage } from "./stageshow/stage";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;

// The bank's first rows; only the bow is acted on, the rest is the domain's own content
const BANK: [ItemId, number][] = [
  ["coins-10000", 38_900_000], ["abyssal-whip", 1], ["twisted-bow", 1], ["toxic-blowpipe", 1], ["dragon-scimitar", 1],
  ["rune-platebody", 3], ["dragon-defender", 1], ["fire-cape", 1],
  ["shark", 1_840], ["anglerfish", 612], ["cooked-karambwan", 2_270], ["lobster", 5_120], ["raw-shark", 340],
  ["prayer-potion-4", 412], ["super-combat-potion-4", 96], ["saradomin-brew-4", 230],
  ["nature-rune", 24_400], ["law-rune", 8_150], ["blood-rune", 210_000], ["death-rune", 64_300], ["fire-rune", 1_200_000],
  ["air-rune", 12_480_000], ["water-rune", 96_000], ["logs", 3_120],
  ["yew-logs", 15_600], ["magic-logs", 4_210], ["coal", 13_500], ["gold-bar", 840], ["uncut-diamond", 64],
  ["dragon-bones", 2_410], ["rune-pickaxe", 1], ["dragon-axe", 1],
];
const TABS: ItemId[] = ["abyssal-whip", "shark", "nature-rune", "magic-logs", "dragon-bones"];
const OPTIONS = ["Withdraw-1", "Withdraw-5", "Withdraw-All", "Examine"] as const;

type S = { menu: { x: number; y: number } | null; lit: string | null; withdrawn: boolean };

const initial: S = { menu: null, lit: null, withdrawn: false };
// The frame that tells the story on its own: the menu open on the bow, Withdraw-1 lit
const MENU_AT = { x: 176, y: 128 };
const poster: S = { menu: MENU_AT, lit: "Withdraw-1", withdrawn: false };

async function script(a: Act<S>) {
  await a.wait(700);
  const bow = a.rect("bow");
  const at = { x: Math.round(bow.x + bow.width / 2 + 1), y: Math.round(bow.y + bow.height / 2 + 1) };
  await a.move(at);
  await a.wait(250);
  a.mark("menu");
  await a.click(undefined, { right: true });
  a.set({ menu: at });
  await a.wait(500);
  const opt = a.rect("opt-Withdraw-1");
  await a.move({ x: opt.x + 30, y: opt.y + opt.height / 2 }, { duration: 420 });
  a.set({ lit: "Withdraw-1" });
  await a.wait(450);
  a.mark("withdraw");
  await a.click();
  a.set({ menu: null, lit: null, withdrawn: true });
  await a.wait(600);
  await a.move({ x: at.x + 70, y: at.y + 66 }, { duration: 700 });
  await a.wait(2400);
}

export function BankStage() {
  return (
    <Stage
      width={360}
      height={240}
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      cursor={{ at: { x: 300, y: 214 } }}
      className="bank-stage"
    >
      {(s) => (
        // the library's own type and scale, at the game's 1x
        <div className="osrs absolute inset-0 [--osrs-px:1px]">
          <Interface style={{ position: "absolute", left: 24, top: 24, width: px(488), height: px(335) }}>
            <InterfaceHeader>
              <span className="absolute flex items-center" style={{ left: px(3), gap: px(4) }}>
                <span className="osrs-text-small flex flex-col" style={{ lineHeight: px(11) }}>
                  <span>{s.withdrawn ? 42 : 43}</span>
                  <span>1160</span>
                </span>
                <buttonSprites.wrench />
              </span>
              <InterfaceTitle>The Bank of Gielinor</InterfaceTitle>
              <InterfaceClose tabIndex={-1} />
            </InterfaceHeader>
            <WindowSeparator style={{ margin: `0 ${px(-4)}` }} />
            <div className="flex min-h-0 flex-1" style={{ gap: px(4), paddingTop: px(4) }}>
              <div className="flex min-w-0 flex-1 flex-col">
                <Tabs variant="bank" defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all" tabIndex={-1} aria-label="All items">
                      <bankSprites.tabAllItemsIcon />
                    </TabsTrigger>
                    {TABS.map((id) => {
                      const { Icon, name } = items[id];
                      return (
                        <TabsTrigger key={id} value={id} tabIndex={-1} aria-label={name}>
                          <Icon />
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </Tabs>
                <div className="grid grid-cols-8" style={{ marginTop: px(2), rowGap: px(4), columnGap: px(12), padding: `${px(2)} ${px(6)}` }}>
                  {BANK.map(([id, q]) => {
                    const { Icon } = items[id];
                    if (id !== "twisted-bow")
                      return (
                        <ItemSlot key={id} quantity={q}>
                          <Icon />
                        </ItemSlot>
                      );
                    // the bow: whole until withdrawn, then the game's placeholder, faded with a 0
                    return (
                      <ItemSlot key={id} data-target="bow">
                        <span className="flex" style={{ opacity: s.withdrawn ? 0.5 : 1 }}>
                          <Icon />
                        </span>
                        {s.withdrawn ? (
                          <span className="osrs-text osrs-text-small pointer-events-none absolute top-0 left-0" style={{ color: "var(--osrs-yellow)", lineHeight: px(10) }}>
                            0
                          </span>
                        ) : null}
                      </ItemSlot>
                    );
                  })}
                </div>
              </div>
            </div>
          </Interface>
          {s.menu ? (
            // the context menu's own classes, drawn in place (the component portals to the body);
            // the game centres it on the pointer, its top a few pixels above it
            <div
              className="osrs-menu osrs-text absolute"
              style={{ left: s.menu.x, top: s.menu.y - 3, transform: "translateX(-50%)", whiteSpace: "nowrap" }}
            >
              <div className="osrs-menu-header">Choose Option</div>
              {OPTIONS.map((o) => (
                <div key={o} className="osrs-menu-item" data-target={`opt-${o}`} data-highlighted={s.lit === o || undefined}>
                  <span>{o}</span>
                  {o === "Examine" || o.startsWith("Withdraw") ? <span className="osrs-menu-target">Twisted bow</span> : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </Stage>
  );
}
