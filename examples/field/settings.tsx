// Settings sections: a white title band over striped fields (All Settings).
import { Checkbox } from "@/registry/osrs/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/registry/osrs/ui/field";
import { Slider } from "@/registry/osrs/ui/slider";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;

export default function FieldSettingsDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text p-6" style={{ width: px(320) }}>
      <FieldSet variant="section">
        <FieldLegend>Display</FieldLegend>
        <Field orientation="vertical">
          <FieldContent className="items-center">
            <FieldTitle>Screen Brightness</FieldTitle>
            <FieldDescription>Change the level of brightness to make the world look lighter or darker.</FieldDescription>
          </FieldContent>
          <Slider defaultValue={40} className="mx-auto" style={{ width: px(220) }} />
        </Field>
        <Field>
          <FieldContent>
            <FieldTitle>Hide roofs</FieldTitle>
            <FieldDescription>Hides all roofs while you're indoors.</FieldDescription>
          </FieldContent>
          <Checkbox variant="bordered" defaultChecked />
        </Field>
        <Field>
          <FieldLabel htmlFor="hitsplat">Hitsplat tinting</FieldLabel>
          <Checkbox id="hitsplat" />
        </Field>
      </FieldSet>
    </div>
  );
}
