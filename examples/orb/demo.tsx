import { Orb } from "@/registry/osrs/ui/orb";

export default function OrbDemo() {
  return (
    <div className="osrs osrs-texture-stone grid grid-cols-2 gap-[calc(4*var(--osrs-px))] p-6">
      <Orb kind="hitpoints" value={84} max={99} />
      <Orb kind="hitpoints" value={30} max={99} status="poison" />
      <Orb kind="prayer" value={61} max={77} active />
      <Orb kind="run" value={42} />
      <Orb kind="special" value={100} active />
      <Orb kind="hitpoints" value={9} max={99} status="venom" />
    </div>
  );
}
