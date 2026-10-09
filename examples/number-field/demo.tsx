import { NumberField } from "@/registry/osrs/ui/number-field";

export default function NumberFieldDemo() {
  return (
    <div className="osrs osrs-texture-stone flex justify-center p-6">
      <NumberField defaultValue={1000} min={1} />
    </div>
  );
}
