import * as React from "react";

import { cn } from "@/lib/utils";
import { px } from "@/lib/osrs";
import { equipmentSprites } from "@/components/ui/equipment-sprites";

const silhouettes = {
  head: equipmentSprites.slotHead,
  cape: equipmentSprites.slotCape,
  neck: equipmentSprites.slotNeck,
  ammo: equipmentSprites.slotAmmunition,
  weapon: equipmentSprites.slotWeapon,
  body: equipmentSprites.slotTorso,
  shield: equipmentSprites.slotShield,
  legs: equipmentSprites.slotLegs,
  hands: equipmentSprites.slotHands,
  feet: equipmentSprites.slotFeet,
  ring: equipmentSprites.slotRing,
};
type EquipmentSlotName = keyof typeof silhouettes;

/** A worn-equipment tile. Shows the slot silhouette when empty, the item when filled. */
function EquipmentSlot({
  slot,
  children,
  selected,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & { slot: EquipmentSlotName; selected?: boolean }) {
  const Silhouette = silhouettes[slot];
  const Tile = selected ? equipmentSprites.slotSelected : equipmentSprites.slotTile;
  return (
    <div
      data-slot="equipment-slot"
      aria-label={slot}
      className={cn("relative", className)}
      style={{ width: px(36), height: px(36), ...style }}
      {...props}
    >
      <Tile className="absolute inset-0" />
      <div className="absolute flex items-center justify-center" style={{ left: px(2), top: px(2), width: px(32), height: px(32) }}>
        {children ?? <Silhouette className="opacity-80" />}
      </div>
    </div>
  );
}

/** The equipment tab layout: 11 slots in the game's paper-doll arrangement. */
function EquipmentGrid({
  items = {},
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & { items?: Partial<Record<EquipmentSlotName, React.ReactNode>> }) {
  const at = (slot: EquipmentSlotName, x: number, y: number) => (
    <EquipmentSlot key={slot} slot={slot} className="absolute" style={{ left: px(x), top: px(y) }}>
      {items[slot]}
    </EquipmentSlot>
  );
  return (
    <div data-slot="equipment-grid" className={cn("relative", className)} style={{ width: px(162), height: px(196), ...style }} {...props}>
      {at("head", 63, 0)}
      {at("cape", 22, 40)}
      {at("neck", 63, 40)}
      {at("ammo", 104, 40)}
      {at("weapon", 7, 79)}
      {at("body", 63, 79)}
      {at("shield", 119, 79)}
      {at("legs", 63, 119)}
      {at("hands", 7, 159)}
      {at("feet", 63, 159)}
      {at("ring", 119, 159)}
    </div>
  );
}

export { EquipmentSlot, EquipmentGrid };
export type { EquipmentSlotName };
