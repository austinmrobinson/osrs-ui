"use client";

import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { Interface, InterfaceClose, InterfaceHeader, InterfaceTitle } from "@/registry/osrs/ui/interface";
import { ItemSlot } from "@/registry/osrs/ui/item-slot";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { bankSprites } from "@/registry/osrs/ui/bank-sprites";
import { buttonSprites } from "@/registry/osrs/ui/button-sprites";
import { WindowSeparator } from "@/registry/osrs/ui/window";
import { items, type ItemId } from "@/site/demo-data/items";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;

const BANK: [ItemId, number][] = [
  ["coins-10000", 38_900_000], ["abyssal-whip", 1], ["twisted-bow", 1], ["toxic-blowpipe", 1], ["dragon-scimitar", 1],
  ["rune-platebody", 3], ["dragon-defender", 1], ["fire-cape", 1], ["barrows-gloves", 1], ["dragon-boots", 1],
  ["shark", 1_840], ["anglerfish", 612], ["cooked-karambwan", 2_270], ["lobster", 5_120], ["raw-shark", 340],
  ["prayer-potion-4", 412], ["super-combat-potion-4", 96], ["saradomin-brew-4", 230], ["super-restore-4", 318],
  ["stamina-potion-4", 77], ["nature-rune", 24_400], ["law-rune", 8_150], ["blood-rune", 210_000],
  ["death-rune", 64_300], ["fire-rune", 1_200_000], ["air-rune", 12_480_000], ["water-rune", 96_000],
  ["logs", 3_120], ["oak-logs", 2_400], ["willow-logs", 1_870], ["yew-logs", 15_600], ["magic-logs", 4_210],
  ["iron-ore", 920], ["coal", 13_500], ["gold-bar", 840], ["bronze-bar", 12], ["uncut-diamond", 64],
  ["bones", 300], ["dragon-bones", 2_410], ["rune-pickaxe", 1], ["dragon-axe", 1], ["hammer", 1], ["knife", 1],
];

/** Square stone button used along the bank's bottom bar. */
function SquareButton({ pressed, onClick, label, children }: { pressed?: boolean; onClick?: () => void; label: string; children: React.ReactNode }) {
  return (
    <Button
      variant="square"
      size="icon"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      onClick={onClick}
      style={{ width: px(36), height: px(32), minHeight: 0, padding: 0 }}
    >
      {children}
    </Button>
  );
}

export default function BankRecipe() {
  const [qty, setQty] = React.useState("All");
  const [noted, setNoted] = React.useState(false);
  const [locked, setLocked] = React.useState(true);
  return (
    <div className="osrs flex items-start justify-start p-6">
      <Interface draggable resizable style={{ width: px(488), height: px(335) }} minWidth={420} minHeight={240}>
        <InterfaceHeader>
          <span className="absolute left-0 flex items-center" style={{ gap: px(4) }}>
            <span className="osrs-text-small flex flex-col" style={{ lineHeight: px(11) }}>
              <span>{BANK.length}</span>
              <span>1160</span>
            </span>
            <button type="button" aria-label="Bank settings" className="group border-0 bg-transparent p-0">
              <buttonSprites.wrench className="group-hover:hidden" />
              <buttonSprites.wrenchHovered className="hidden group-hover:block" />
            </button>
          </span>
          <InterfaceTitle>The Bank of Gielinor</InterfaceTitle>
          <InterfaceClose />
        </InterfaceHeader>
        <WindowSeparator style={{ margin: `0 ${px(-4)}` }} />
        <div className="flex min-h-0 flex-1" style={{ gap: px(4), paddingTop: px(4) }}>
          <div className="flex flex-col justify-end" style={{ width: px(36), gap: px(4), paddingBottom: px(4) }}>
            <SquareButton label="Potion storage">
              <bankSprites.potionStorage />
            </SquareButton>
            <SquareButton label="Incinerator">
              <bankSprites.incinerator />
            </SquareButton>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-end" style={{ gap: px(1) }}>
              <div className="relative" style={{ width: px(41), height: px(40) }}>
                <bankSprites.tabSelected className="absolute inset-0" />
                <bankSprites.tabAllItemsIcon className="absolute" style={{ left: px(3), top: px(4) }} />
              </div>
              {(["abyssal-whip", "shark", "nature-rune", "magic-logs", "dragon-bones"] as ItemId[]).map((id) => {
                const { Icon } = items[id];
                return (
                  <div key={id} className="relative flex items-center justify-center" style={{ width: px(41), height: px(40) }}>
                    <bankSprites.tab className="absolute inset-0" />
                    <Icon className="relative" />
                  </div>
                );
              })}
              <div className="relative" style={{ width: px(41), height: px(40) }}>
                <bankSprites.tabEmpty className="absolute inset-0" />
                <bankSprites.tabAddIcon className="absolute" style={{ left: px(3), top: px(4) }} />
              </div>
              <div className="ml-auto">
                <SquareButton label="Worn items">
                  <bankSprites.wornItems />
                </SquareButton>
              </div>
            </div>
            <ScrollArea className="flex-1" style={{ marginTop: px(2) }}>
              <div className="grid grid-cols-8" style={{ rowGap: px(4), columnGap: px(12), padding: `${px(2)} ${px(6)}` }}>
                {BANK.map(([id, q]) => {
                  const { Icon, name } = items[id];
                  return (
                    <ItemSlot key={id} quantity={q} title={name}>
                      <Icon />
                    </ItemSlot>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className="flex items-center" style={{ gap: px(4), paddingTop: px(4) }}>
          <SquareButton label="Rearrange: swap">
            <bankSprites.swapItems />
          </SquareButton>
          <SquareButton label="Withdraw as note" pressed={noted} onClick={() => setNoted((n) => !n)}>
            <bankSprites.notedItems />
          </SquareButton>
          <span style={{ width: px(6) }} />
          {["1", "5", "10", "X", "All"].map((q) => (
            <SquareButton key={q} label={`Quantity ${q}`} pressed={qty === q} onClick={() => setQty(q)}>
              {q}
            </SquareButton>
          ))}
          <span style={{ width: px(6) }} />
          <SquareButton label="Search">
            <bankSprites.search />
          </SquareButton>
          <SquareButton label="Placeholders" pressed={locked} onClick={() => setLocked((l) => !l)}>
            <bankSprites.placeholdersLock />
          </SquareButton>
          <span className="flex-1" />
          <SquareButton label="Deposit looting bag">
            <bankSprites.depositLootingBag />
          </SquareButton>
          <SquareButton label="Deposit inventory">
            <bankSprites.depositInventory />
          </SquareButton>
          <SquareButton label="Deposit worn items">
            <bankSprites.depositEquipment />
          </SquareButton>
        </div>
      </Interface>
    </div>
  );
}
