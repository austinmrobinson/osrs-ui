import { SkillTile, TotalLevelTile } from "@/registry/osrs/ui/skill-tile";

export default function SkillTileDemo() {
  return (
    <div className="osrs osrs-texture-side-panel flex gap-[calc(2*var(--osrs-px))] p-6">
      <SkillTile skill="attack" level={99} />
      <SkillTile skill="strength" level={99} boosted={118} />
      <SkillTile skill="sailing" level={40} selected />
      <TotalLevelTile total={2277} />
    </div>
  );
}
