// Single on/off tiles from the bank's footer: red while on.
import { bankSprites } from "@/registry/osrs/ui/bank-sprites";
import { Toggle } from "@/registry/osrs/ui/toggle";

export default function ToggleDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex items-center gap-[calc(4*var(--osrs-px))] p-6">
      <Toggle aria-label="Always set placeholders" defaultPressed>
        <bankSprites.placeholdersLock />
      </Toggle>
      <Toggle aria-label="Search">
        <bankSprites.search />
      </Toggle>
      <Toggle size="default">Note</Toggle>
    </div>
  );
}
