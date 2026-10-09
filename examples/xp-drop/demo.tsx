import { XpDrop } from "@/registry/osrs/ui/xp-drop";

export default function XpDropDemo() {
  return (
    <div className="osrs osrs-texture-stone flex flex-col items-end gap-[calc(4*var(--osrs-px))] p-6">
      <XpDrop skills={["ranged", "hitpoints"]} amount={1_248} />
      <XpDrop skills={["woodcutting"]} amount={175} />
    </div>
  );
}
