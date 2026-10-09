import { RadioGroup, RadioGroupItem } from "@/registry/osrs/ui/radio-group";

export default function RadioGroupDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text p-6">
      <RadioGroup defaultValue="one">
        {[["one", "One mouse button"], ["two", "Two mouse buttons"]].map(([v, l]) => (
          <label key={v} className="flex items-center gap-[calc(4*var(--osrs-px))]">
            <RadioGroupItem value={v} />
            {l}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
