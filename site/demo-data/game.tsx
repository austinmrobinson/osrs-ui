import { items, type ItemId } from "./items";
import { ItemSlot } from "@/registry/osrs/ui/item-slot";
import type { SidePanelTab } from "@/registry/osrs/ui/side-panel";

/** Item slot helper for demos */
export function Item({ id, quantity, selected }: { id: ItemId; quantity?: number; selected?: boolean }) {
  const { Icon, name } = items[id];
  return (
    <ItemSlot quantity={quantity} selected={selected} title={name}>
      <Icon title={name} />
    </ItemSlot>
  );
}

export const TOP_TABS: SidePanelTab[] = [
  { value: "combat", icon: "combat", label: "Combat Options" },
  { value: "stats", icon: "stats", label: "Skills" },
  { value: "quests", icon: "quests", label: "Character Summary" },
  { value: "inventory", icon: "inventory", label: "Inventory" },
  { value: "equipment", icon: "equipment", label: "Worn Equipment" },
  { value: "prayer", icon: "prayer", label: "Prayer" },
  { value: "magic", icon: "magic", label: "Magic" },
];

export const BOTTOM_TABS: SidePanelTab[] = [
  { value: "clan", icon: "clanChat", label: "Chat-channel" },
  { value: "friends", icon: "friends", label: "Friends List" },
  { value: "account", icon: "accountManagement", label: "Account Management" },
  { value: "logout", icon: "logout", label: "Logout" },
  { value: "options", icon: "options", label: "Settings" },
  { value: "emotes", icon: "emotes", label: "Emotes" },
  { value: "music", icon: "music", label: "Music Player" },
];
