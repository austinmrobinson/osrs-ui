"use client";

import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { Interface, InterfaceClose, InterfaceHeader, InterfaceTitle } from "@/registry/osrs/ui/interface";
import { ItemSlot } from "@/registry/osrs/ui/item-slot";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { Separator } from "@/registry/osrs/ui/separator";
import { bankSprites } from "@/registry/osrs/ui/bank-sprites";
import { items, type ItemId } from "../data/items";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;

const BANK: [ItemId, number][] = [
  ["coins-10000", 48_221_904], ["abyssal-whip", 1], ["twisted-bow", 1], ["toxic-blowpipe", 1], ["dragon-scimitar", 1],
  ["rune-platebody", 3], ["dragon-defender", 1], ["fire-cape", 1], ["barrows-gloves", 1], ["dragon-boots", 1],
  ["shark", 1_840], ["anglerfish", 612], ["cooked-karambwan", 2_270], ["lobster", 5_120], ["raw-shark", 340],
  ["prayer-potion-4", 412], ["super-combat-potion-4", 96], ["saradomin-brew-4", 230], ["super-restore-4", 318],
  ["stamina-potion-4", 77], ["nature-rune", 24_400], ["law-rune", 8_150], ["blood-rune", 210_000],
  ["death-rune", 64_300], ["fire-rune", 1_200_000], ["air-rune", 12_480_000], ["water-rune", 96_000],
  ["logs", 3_120], ["oak-logs", 2_400], ["willow-logs", 1_870], ["yew-logs", 15_600], ["magic-logs", 4_210],
  ["iron-ore", 920], ["coal", 13_500], ["gold-bar", 840], ["bronze-bar", 12], ["uncut-diamond", 64],
  ["bones", 300], ["dragon-bones", 2_410], ["rune-pickaxe", 1], ["dragon-axe", 1], ["hammer", 1], ["knife", 1],
];

function Toggle2({ label, options }: { label: string; options: string[] }) {
  const [v, setV] = React.useState(0);
  return (
    <div className="flex flex-col items-center" style={{ gap: px(2) }}>
      <span className="osrs-text-small">{label}</span>
      <div className="flex" style={{ gap: px(2) }}>
        {options.map((o, i) => (
          <Button key={o} size="sm" aria-pressed={v === i} onClick={() => setV(i)} style={{ minWidth: px(36) }}>
            {o}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function BankRecipe() {
  return (
    <div className="osrs flex justify-center p-6">
      <Interface style={{ width: px(488), height: px(334) }}>
        <InterfaceHeader>
          <span className="osrs-text-small absolute left-0 flex flex-col" style={{ lineHeight: px(11) }}>
            <span>{BANK.length}</span>
            <span>800</span>
          </span>
          <InterfaceTitle>The Bank of Gielinor</InterfaceTitle>
          <InterfaceClose />
        </InterfaceHeader>
        <div className="flex" style={{ gap: px(1), marginBottom: px(2), paddingLeft: px(4) }}>
          <div className="relative" style={{ width: px(41), height: px(40) }}>
            <bankSprites.tabSelected className="absolute inset-0" />
            <bankSprites.tabAllItemsIcon className="absolute" style={{ left: px(3), top: px(4) }} />
          </div>
          {(["abyssal-whip", "shark", "nature-rune", "magic-logs"] as ItemId[]).map((id) => {
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
        </div>
        <Separator />
        <ScrollArea className="flex-1" style={{ marginTop: px(2) }}>
          <div className="grid grid-cols-8" style={{ rowGap: px(4), columnGap: px(12), padding: `${px(2)} ${px(10)}` }}>
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
        <Separator />
        <div className="flex items-end justify-between" style={{ paddingTop: px(4) }}>
          <Toggle2 label="Rearrange mode:" options={["Swap", "Insert"]} />
          <Toggle2 label="Withdraw as:" options={["Item", "Note"]} />
          <Toggle2 label="Quantity:" options={["1", "5", "10", "X", "All"]} />
          <div className="flex" style={{ gap: px(2) }}>
            <bankSprites.search title="Search" />
            <bankSprites.depositInventory title="Deposit inventory" />
            <bankSprites.depositEquipment title="Deposit worn items" />
          </div>
        </div>
      </Interface>
    </div>
  );
}
