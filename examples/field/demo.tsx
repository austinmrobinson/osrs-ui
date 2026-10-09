// The game's group box: a titled inset around related controls (Bank Fillers, Rune pouch).
import { Checkbox } from "@/registry/osrs/ui/checkbox";
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/registry/osrs/ui/field";
import { RadioGroup, RadioGroupItem } from "@/registry/osrs/ui/radio-group";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;

export default function FieldDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex p-6" style={{ gap: px(6), width: px(380) }}>
      <FieldSet className="flex-1">
        <FieldLegend>Bank fillers</FieldLegend>
        <RadioGroup defaultValue="all">
          {[
            ["1", "Fill 1"],
            ["10", "Fill 10"],
            ["all", "Fill all"],
          ].map(([v, l]) => (
            <label key={v} className="flex cursor-pointer items-center" style={{ gap: px(4) }}>
              <RadioGroupItem value={v} />
              {l}
            </label>
          ))}
        </RadioGroup>
      </FieldSet>
      <FieldSet className="flex-1">
        <FieldLegend>Deposit</FieldLegend>
        <Field>
          <FieldLabel htmlFor="worn">Worn items</FieldLabel>
          <Checkbox id="worn" defaultChecked />
        </Field>
        <Field>
          <FieldLabel htmlFor="pouch">Looting bag</FieldLabel>
          <Checkbox id="pouch" />
        </Field>
      </FieldSet>
    </div>
  );
}
