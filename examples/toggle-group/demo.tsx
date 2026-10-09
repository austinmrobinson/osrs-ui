// The quantity row of the bank and stores: one choice stays pressed.
import { ToggleGroup, ToggleGroupItem } from "@/registry/osrs/ui/toggle-group";

export default function ToggleGroupDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex flex-col items-center gap-[calc(4*var(--osrs-px))] p-6">
      <span>Quantity:</span>
      <ToggleGroup defaultValue={["1"]}>
        {["1", "5", "10", "X", "All"].map((v) => (
          <ToggleGroupItem key={v} value={v}>
            {v}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
