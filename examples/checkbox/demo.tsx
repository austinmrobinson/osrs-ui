import { Checkbox } from "@/registry/osrs/ui/checkbox";

export default function CheckboxDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex flex-col gap-[calc(4*var(--osrs-px))] p-6">
      {[
        ["shift", "Shift click to drop items", true],
        ["esc", "Esc closes the current interface", false],
        ["xp", "Show XP drops", true],
      ].map(([id, label, checked]) => (
        <label key={id as string} htmlFor={id as string} className="flex items-center gap-[calc(4*var(--osrs-px))]">
          <Checkbox id={id as string} defaultChecked={checked as boolean} />
          {label}
        </label>
      ))}
    </div>
  );
}
