import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/osrs/ui/select";

const ITEMS = { exact: "Exact Value", percent: "Percentage", bar: "Bar only" };

export default function SelectDemo() {
  return (
    <div className="osrs osrs-texture-stone flex min-h-[calc(90*var(--osrs-px))] items-start justify-center p-6">
      <Select defaultValue="exact" items={ITEMS}>
        <SelectTrigger className="w-[calc(110*var(--osrs-px))]" />
        <SelectContent>
          {Object.entries(ITEMS).map(([v, l]) => (
            <SelectItem key={v} value={v}>{l}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
