import { Input } from "@/registry/osrs/ui/input";

export default function InputDemo() {
  return (
    <div className="osrs osrs-texture-stone flex justify-center p-6">
      <Input placeholder="Search bank…" className="w-[calc(150*var(--osrs-px))]" />
    </div>
  );
}
