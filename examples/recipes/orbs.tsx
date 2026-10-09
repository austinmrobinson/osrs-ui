import { Orb } from "@/registry/osrs/ui/orb";
import { XpDrop } from "@/registry/osrs/ui/xp-drop";

export default function OrbsRecipe() {
  return (
    <div className="osrs osrs-texture-stone flex items-start justify-center p-6" style={{ gap: "calc(24 * var(--osrs-px))" }}>
      <div className="flex flex-col" style={{ gap: "calc(2 * var(--osrs-px))" }}>
        <Orb kind="hitpoints" value={71} max={99} />
        <Orb kind="prayer" value={23} max={77} active />
        <Orb kind="run" value={100} max={100} active />
        <Orb kind="special" value={50} max={100} />
      </div>
      <div className="flex flex-col" style={{ gap: "calc(2 * var(--osrs-px))" }}>
        <Orb kind="hitpoints" value={12} max={99} status="venom" />
        <Orb kind="hitpoints" value={54} max={99} status="poison" />
      </div>
      <div className="flex flex-col items-end" style={{ gap: "calc(4 * var(--osrs-px))" }}>
        <XpDrop skills={["attack", "hitpoints"]} amount={562} />
        <XpDrop skills={["slayer"]} amount={198} />
        <XpDrop skills={["magic"]} amount={73} />
      </div>
    </div>
  );
}
