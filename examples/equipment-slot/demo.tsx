import { EquipmentGrid, EquipmentSlot } from "@/registry/osrs/ui/equipment-slot";
import { items } from "../data/items";

export default function EquipmentSlotDemo() {
  const { Icon: Whip } = items["abyssal-whip"];
  return (
    <div className="osrs osrs-texture-side-panel flex items-center gap-[calc(16*var(--osrs-px))] p-6">
      <div className="flex flex-col gap-[calc(4*var(--osrs-px))]">
        <EquipmentSlot slot="weapon"><Whip /></EquipmentSlot>
        <EquipmentSlot slot="head" />
        <EquipmentSlot slot="ring" selected />
      </div>
      <EquipmentGrid />
    </div>
  );
}
