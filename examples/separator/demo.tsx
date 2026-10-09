import { Separator } from "@/registry/osrs/ui/separator";

export default function SeparatorDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex flex-col gap-[calc(4*var(--osrs-px))] p-6">
      <span>Combat Lvl: 126</span>
      <Separator />
      <div className="flex h-[calc(15*var(--osrs-px))] items-center gap-[calc(6*var(--osrs-px))]">
        <span>Attack</span>
        <Separator orientation="vertical" />
        <span>Strength</span>
        <Separator orientation="vertical" />
        <span>Defence</span>
      </div>
    </div>
  );
}
