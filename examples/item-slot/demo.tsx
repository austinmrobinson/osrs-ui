import { Inventory, ItemSlot } from "@/registry/osrs/ui/item-slot";
import { items } from "@/site/demo-data/items";

export default function ItemSlotDemo() {
  const { Icon: Coins } = items["coins-10000"];
  const { Icon: Shark } = items.shark;
  const { Icon: Rune } = items["nature-rune"];
  return (
    <div className="osrs osrs-texture-side-panel flex flex-col items-center gap-[calc(8*var(--osrs-px))] p-6">
      <div className="flex gap-[calc(6*var(--osrs-px))]">
        <ItemSlot quantity={42}><Rune /></ItemSlot>
        <ItemSlot quantity={250_000}><Coins /></ItemSlot>
        <ItemSlot quantity={12_000_000}><Coins /></ItemSlot>
        <ItemSlot selected><Shark /></ItemSlot>
        <ItemSlot />
      </div>
      <Inventory>
        {Array.from({ length: 10 }, (_, i) => (
          <ItemSlot key={i}><Shark /></ItemSlot>
        ))}
      </Inventory>
    </div>
  );
}
