"use client";

// The docs' component playground: one instance of a component on a stage, and a props panel with a
// control per prop. The controls are generated from the component's TypeScript props
// (site/playground/props.generated.json, written by scripts/build-props.ts): a select for string
// options, a checkbox for booleans, number and text inputs. Each page's playground is configured in
// site/playground/configs.tsx with what to render and which props to show.
import * as React from "react";

import { Checkbox } from "@/registry/osrs/ui/checkbox";
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/registry/osrs/ui/field";
import { Input } from "@/registry/osrs/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/osrs/ui/select";
import { CONFIGS, type PropValues } from "./configs";
import META from "./props.generated.json";

type Meta = { name: string; control: "select" | "boolean" | "number" | "text"; options?: string[]; default?: string | number | boolean; description?: string };
const metaFor = (file: string, component: string) => ((META as Record<string, Record<string, Meta[]>>)[file]?.[component] ?? []) as Meta[];

const px = (n: number) => `calc(${n} * var(--osrs-px))`;
/** Every playground is the same height, tall enough for a window at 2x without squeezing it. */
const PLAYGROUND_HEIGHT = 360;

function Control({ meta, value, onChange }: { meta: Meta; value: unknown; onChange: (v: unknown) => void }) {
  const id = `pg-${meta.name}`;
  if (meta.control === "boolean")
    return (
      <Field>
        <FieldLabel htmlFor={id} title={meta.description}>
          {meta.name}
        </FieldLabel>
        <Checkbox id={id} checked={Boolean(value)} onCheckedChange={(c) => onChange(Boolean(c))} />
      </Field>
    );
  if (meta.control === "select") {
    const items = Object.fromEntries([["", "(none)"], ...meta.options!.map((o) => [o, o])]);
    return (
      <Field>
        <FieldLabel title={meta.description}>{meta.name}</FieldLabel>
        <Select value={(value as string) ?? ""} onValueChange={(v) => onChange(v === "" ? undefined : v)} items={items}>
          <SelectTrigger style={{ width: 104 }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {meta.default === undefined ? <SelectItem value="">(none)</SelectItem> : null}
            {meta.options!.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    );
  }
  return (
    <Field>
      <FieldLabel htmlFor={id} title={meta.description}>
        {meta.name}
      </FieldLabel>
      <Input
        id={id}
        type={meta.control === "number" ? "number" : "text"}
        style={{ width: 104 }}
        value={value === undefined ? "" : String(value)}
        onChange={(e) => {
          const raw = (e.target as HTMLInputElement).value;
          onChange(raw === "" ? undefined : meta.control === "number" ? Number(raw) : raw);
        }}
      />
    </Field>
  );
}

/** The prop values a page's playground starts with: generated defaults, then the config's own. */
export function initialValues(page: string): PropValues {
  const config = CONFIGS[page];
  const vals: PropValues = {};
  for (const [file, comp] of config.components) for (const m of metaFor(file, comp)) if (m.default !== undefined && !(m.name in vals)) vals[m.name] = m.default;
  for (const m of config.extra ?? []) if (m.default !== undefined && !(m.name in vals)) vals[m.name] = m.default;
  return { ...vals, ...config.initial };
}

export function Playground({ page }: { page: string }) {
  const config = CONFIGS[page];
  // the props to show: generated metadata for each listed component, then any extras, minus hidden ones
  const metas = React.useMemo(() => {
    const seen = new Set<string>();
    const all: Meta[] = [];
    for (const [file, comp] of config.components)
      for (const m of metaFor(file, comp)) if (!seen.has(m.name) && !config.hide?.includes(m.name)) (seen.add(m.name), all.push(m));
    for (const m of config.extra ?? []) if (!seen.has(m.name)) (seen.add(m.name), all.push(m as Meta));
    return all;
  }, [config]);
  const [values, setValues] = React.useState<PropValues>(() => ({
    ...Object.fromEntries(metas.filter((m) => m.default !== undefined).map((m) => [m.name, m.default])),
    ...config.initial,
  }));
  const set = (name: string, v: unknown) => setValues((prev) => ({ ...prev, [name]: v }));
  // `?bare`: just the component, no props panel (the site search's page previews)
  const [bare, setBare] = React.useState(false);
  React.useEffect(() => setBare(new URLSearchParams(window.location.search).has("bare")), []);

  return (
    <div className="osrs osrs-text osrs-playground flex w-full" style={{ height: PLAYGROUND_HEIGHT }}>
      <div
        className={["flex min-w-0 flex-1 items-center justify-center", config.stageClassName].filter(Boolean).join(" ")}
        style={{ padding: px(12), minWidth: px(200) }}
      >
        {config.render(values)}
      </div>
      <aside
        hidden={bare}
        className="flex flex-none flex-col overflow-y-auto max-[520px]:hidden"
        // the panel is site chrome, drawn at 1x whatever scale the component uses
        style={{ ["--osrs-px" as string]: "1px", width: 224, gap: 0, padding: 0, boxShadow: "inset 1px 0 0 #1f1a14, inset 2px 0 0 #5d5848" } as React.CSSProperties}
      >
        <FieldSet variant="section">
          <FieldLegend>Props</FieldLegend>
          {metas.map((m) => (
            <Control key={m.name} meta={m} value={values[m.name]} onChange={(v) => set(m.name, v)} />
          ))}
        </FieldSet>
      </aside>
    </div>
  );
}
