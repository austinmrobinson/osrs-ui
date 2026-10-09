import { SearchField } from "@/registry/osrs/ui/search-field";
import { Shortcut } from "@/registry/osrs/ui/shortcut";

export default function SearchFieldDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex w-full flex-col gap-[calc(8*var(--osrs-px))] p-6 *:w-[calc(240*var(--osrs-px))]">
      <SearchField aria-label="Search the bank" />
      <SearchField aria-label="Search the docs" end={<Shortcut keys={["⌘", "K"]} />} />
    </div>
  );
}
