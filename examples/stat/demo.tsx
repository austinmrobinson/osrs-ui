// Labelled values: the boxed currency footer of stores, and inline footer stats.
import { Stat } from "@/registry/osrs/ui/stat";

export default function StatDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex flex-col items-center gap-[calc(10*var(--osrs-px))] p-6">
      <Stat label="Slayer Points" value="1,240" />
      <div className="flex gap-[calc(16*var(--osrs-px))]">
        <Stat variant="inline" label="Completed" value="214" />
        <Stat variant="inline" label="Total guide price" value="301,856,410" />
      </div>
    </div>
  );
}
