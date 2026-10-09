import { skillIcons } from "@/registry/osrs/icons/skill-icons";

export default function SkillIconsDemo() {
  return (
    <div className="osrs osrs-texture-stone grid w-[calc(196*var(--osrs-px)_+_3rem)] grid-cols-5 gap-[calc(4*var(--osrs-px))] p-6">
      {Object.entries(skillIcons).map(([name, Icon]) => (
        <div key={name} title={name} className="osrs-well flex aspect-square items-center justify-center">
          <Icon title={name} />
        </div>
      ))}
    </div>
  );
}
