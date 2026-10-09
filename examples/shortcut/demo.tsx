import { Shortcut } from "@/registry/osrs/ui/shortcut";

export default function ShortcutDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex flex-col items-start gap-[calc(8*var(--osrs-px))] p-6">
      <span className="flex items-center gap-[calc(6*var(--osrs-px))]">
        Search <Shortcut keys={["⌘", "K"]} />
      </span>
      <span className="flex items-center gap-[calc(6*var(--osrs-px))]">
        Close <Shortcut>Esc</Shortcut>
      </span>
      <span className="flex items-center gap-[calc(6*var(--osrs-px))]">
        Pick an option <Shortcut keys={["1", "2", "3"]} />
      </span>
    </div>
  );
}
