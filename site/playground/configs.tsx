// What each docs page's playground renders. `components` lists the [file, export] whose generated
// props become controls (in order; a name seen twice shows once). `extra` adds controls for props
// the generator skips (inherited ones like `value`); `hide` drops ones that make no sense to edit.
import * as React from "react";

import { bankSprites } from "@/registry/osrs/ui/bank-sprites";
import { Button } from "@/registry/osrs/ui/button";
import { Card } from "@/registry/osrs/ui/card";
import { NpcDialogue, OptionDialogue } from "@/registry/osrs/ui/chatbox";
import { Checkbox } from "@/registry/osrs/ui/checkbox";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/registry/osrs/ui/context-menu";
import { DescriptionItem, DescriptionList } from "@/registry/osrs/ui/description-list";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTrigger } from "@/registry/osrs/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/registry/osrs/ui/dropdown-menu";
import { EquipmentSlot } from "@/registry/osrs/ui/equipment-slot";
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/registry/osrs/ui/field";
import { Input } from "@/registry/osrs/ui/input";
import { ItemSlot } from "@/registry/osrs/ui/item-slot";
import { List, ListItem } from "@/registry/osrs/ui/list";
import { NavItem, NavList } from "@/registry/osrs/ui/nav-list";
import { NumberField } from "@/registry/osrs/ui/number-field";
import { Orb } from "@/registry/osrs/ui/orb";
import { PrayerButton } from "@/registry/osrs/ui/prayer-button";
import { Progress } from "@/registry/osrs/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/registry/osrs/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/osrs/ui/select";
import { SkillTile } from "@/registry/osrs/ui/skill-tile";
import { Slider } from "@/registry/osrs/ui/slider";
import { Stat } from "@/registry/osrs/ui/stat";
import { StatusIcon } from "@/registry/osrs/ui/status-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";
import { Toggle } from "@/registry/osrs/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/registry/osrs/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/osrs/ui/tooltip";
import { Window, WindowBody, WindowClose, WindowHeader } from "@/registry/osrs/ui/window";
import { XpDrop } from "@/registry/osrs/ui/xp-drop";
import { items } from "@/site/demo-data/items";

export type PropValues = Record<string, any>;
type Extra = { name: string; control: "select" | "boolean" | "number" | "text"; options?: string[]; default?: string | number | boolean };
export type PlaygroundConfig = {
  components: [file: string, component: string][];
  render: (p: PropValues) => React.ReactNode;
  extra?: Extra[];
  hide?: string[];
  initial?: PropValues;
  stageClassName?: string;
};

const px = (n: number) => `calc(${n} * var(--osrs-px))`;
const Whip = items["abyssal-whip"].Icon;
const Coins = items["coins-10000"].Icon;
const isIcon = (size?: string) => size?.startsWith("icon");

export const CONFIGS: Record<string, PlaygroundConfig> = {
  button: {
    components: [["button", "Button"]],
    hide: ["tooltipSide"],
    render: (p) => (
      <Button {...p} aria-label={isIcon(p.size) ? "Deposit inventory" : undefined}>
        {isIcon(p.size) ? <bankSprites.depositInventory /> : "Teleport"}
      </Button>
    ),
  },
  toggle: {
    components: [["toggle", "Toggle"]],
    extra: [{ name: "defaultPressed", control: "boolean", default: true }],
    render: (p) => (
      <Toggle key={String(p.defaultPressed)} {...p} aria-label="Always set placeholders">
        {isIcon(p.size) ? <bankSprites.placeholdersLock /> : "Note"}
      </Toggle>
    ),
  },
  "toggle-group": {
    components: [["toggle-group", "ToggleGroup"], ["toggle-group", "ToggleGroupItem"]],
    render: ({ size, disabled }) => (
      <ToggleGroup defaultValue={["1"]} disabled={disabled}>
        {["1", "5", "10", "X", "All"].map((v) => (
          <ToggleGroupItem key={v} value={v} size={size}>
            {v}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    ),
  },
  card: {
    components: [["card", "Card"]],
    render: (p) => (
      <Card {...p} className="items-center justify-center text-center" style={{ width: px(90), height: px(70), gap: px(2) }}>
        <Whip />
        <span>Abyssal whip</span>
      </Card>
    ),
  },
  checkbox: {
    components: [["checkbox", "Checkbox"]],
    extra: [{ name: "defaultChecked", control: "boolean", default: true }],
    render: (p) => (
      <label className="flex cursor-pointer items-center" style={{ gap: px(4) }}>
        <Checkbox key={String(p.defaultChecked)} {...p} />
        Hide roofs
      </label>
    ),
  },
  "radio-group": {
    components: [["radio-group", "RadioGroup"]],
    render: (p) => (
      <RadioGroup defaultValue="one" {...p}>
        {[
          ["one", "One mouse button"],
          ["two", "Two mouse buttons"],
        ].map(([v, l]) => (
          <label key={v} className="flex items-center" style={{ gap: px(4) }}>
            <RadioGroupItem value={v} />
            {l}
          </label>
        ))}
      </RadioGroup>
    ),
  },
  select: {
    components: [["select", "Select"]],
    stageClassName: "items-start",
    render: (p) => {
      const opts = { exact: "Exact Value", percent: "Percentage", bar: "Bar only" };
      return (
        <Select defaultValue="exact" items={opts} {...p}>
          <SelectTrigger style={{ width: px(110) }} />
          <SelectContent>
            {Object.entries(opts).map(([v, l]) => (
              <SelectItem key={v} value={v}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  "number-field": {
    components: [["number-field", "NumberField"]],
    render: (p) => <NumberField defaultValue={1000} min={1} {...p} />,
  },
  slider: {
    components: [["slider", "Slider"]],
    render: (p) => (
      <div style={{ width: px(180) }}>
        <Slider defaultValue={40} {...p} />
      </div>
    ),
  },
  input: {
    components: [["input", "Input"]],
    extra: [{ name: "placeholder", control: "text", default: "Search..." }],
    render: (p) => <Input {...p} style={{ width: px(160) }} />,
  },
  tabs: {
    components: [["tabs", "Tabs"], ["tabs", "TabsTrigger"]],
    render: ({ variant, size, disabled }) => (
      <Tabs key={variant} variant={variant} defaultValue="bosses" className="w-full" style={{ maxWidth: px(240) }}>
        <TabsList>
          {["Bosses", "Raids", "Clues"].map((t, i) => (
            <TabsTrigger key={t} value={t.toLowerCase()} size={size} disabled={i === 2 ? disabled : undefined}>
              {variant === "bank" ? <Coins /> : t}
            </TabsTrigger>
          ))}
        </TabsList>
        {["bosses", "raids", "clues"].map((v) => (
          <TabsContent key={v} value={v} style={{ padding: px(6) }}>
            {v[0].toUpperCase() + v.slice(1)}
          </TabsContent>
        ))}
      </Tabs>
    ),
  },
  "nav-list": {
    components: [["nav-list", "NavList"], ["nav-list", "NavItem"]],
    hide: ["tooltip"],
    render: ({ variant, disabled }) => (
      <Tabs orientation="vertical" defaultValue="Display" className="flex-row">
        <NavList variant={variant} style={{ width: px(76) }}>
          {["Activities", "Audio", "Chat", "Display"].map((i, n) => (
            <NavItem key={i} value={i} disabled={n === 1 ? disabled : undefined}>
              {i}
            </NavItem>
          ))}
        </NavList>
      </Tabs>
    ),
  },
  "dropdown-menu": {
    components: [["dropdown-menu", "DropdownMenuTrigger"]],
    stageClassName: "items-start",
    render: (p) => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button size="sm" />} {...p}>
          View
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Overview</DropdownMenuItem>
          <DropdownMenuItem>Tasks</DropdownMenuItem>
          <DropdownMenuItem>Rewards</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  "context-menu": {
    components: [["context-menu", "ContextMenuContent"]],
    render: (p) => (
      <ContextMenu>
        <ContextMenuTrigger className="flex items-center justify-center" style={{ width: px(160), height: px(70), boxShadow: "inset 0 0 0 1px #5d5848" }}>
          Right-click here
        </ContextMenuTrigger>
        <ContextMenuContent {...p}>
          <ContextMenuItem target="Bank booth">Bank</ContextMenuItem>
          <ContextMenuItem target="Bank booth">Collect</ContextMenuItem>
          <ContextMenuItem>Walk here</ContextMenuItem>
          <ContextMenuItem>Cancel</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    ),
  },
  tooltip: {
    components: [["tooltip", "TooltipContent"]],
    render: (p) => (
      <Tooltip open>
        <TooltipTrigger render={<Button />}>Hover me</TooltipTrigger>
        <TooltipContent {...p}>A highly polished stone button.</TooltipContent>
      </Tooltip>
    ),
  },
  dialog: {
    components: [["dialog", "DialogContent"]],
    initial: { title: "Are you sure?" },
    render: (p) => (
      <Dialog>
        <DialogTrigger render={<Button />}>Drop item</DialogTrigger>
        <DialogContent {...p}>
          <DialogDescription className="text-center">Drop the Abyssal whip? It will appear on the floor for 60 seconds.</DialogDescription>
          <DialogFooter>
            <DialogClose render={<Button tone="destructive" />}>Yes</DialogClose>
            <DialogClose render={<Button />}>No</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
  window: {
    components: [["window", "Window"]],
    render: (p) => (
      <Window key={p.frame} {...p} style={{ width: px(240), height: px(140) }}>
        <WindowHeader end={<WindowClose />}>Grand Exchange</WindowHeader>
        <WindowBody>Windows can be any size.</WindowBody>
      </Window>
    ),
  },
  field: {
    components: [["field", "FieldSet"], ["field", "Field"]],
    render: ({ variant, orientation, disabled }) => (
      <FieldSet variant={variant} disabled={disabled} style={{ width: px(170) }}>
        <FieldLegend>Deposit</FieldLegend>
        <Field orientation={orientation}>
          <FieldLabel htmlFor="pg-worn">Worn items</FieldLabel>
          <Checkbox id="pg-worn" defaultChecked />
        </Field>
        <Field orientation={orientation}>
          <FieldLabel htmlFor="pg-bag">Looting bag</FieldLabel>
          <Checkbox id="pg-bag" />
        </Field>
      </FieldSet>
    ),
  },
  chatbox: {
    components: [["chatbox", "OptionDialogue"]],
    initial: { options: "Yes, No, Maybe later" },
    render: ({ options, ...p }) => <OptionDialogue {...p} options={String(options ?? "").split(",").map((s) => s.trim()).filter(Boolean)} style={{ width: px(260), height: px(90) }} />,
  },
  list: {
    components: [["list", "ListItem"]],
    initial: { selected: true },
    render: (p) => (
      <List style={{ width: px(160) }}>
        <ListItem>Abyssal Sire</ListItem>
        <ListItem {...p}>Alchemical Hydra</ListItem>
        <ListItem>Araxxor</ListItem>
      </List>
    ),
  },
  "description-list": {
    components: [["description-list", "DescriptionList"]],
    initial: { striped: true },
    render: (p) => (
      <DescriptionList {...p} style={{ width: px(150) }}>
        <DescriptionItem label="Stab">+82</DescriptionItem>
        <DescriptionItem label="Slash">+82</DescriptionItem>
        <DescriptionItem label="Prayer">+0</DescriptionItem>
      </DescriptionList>
    ),
  },
  stat: {
    components: [["stat", "Stat"]],
    initial: { label: "Slayer Points", value: "1,240" },
    render: (p) => <Stat label="" value="" {...p} />,
  },
  "status-icon": {
    components: [["status-icon", "StatusIcon"]],
    initial: { status: "done" },
    render: (p) => <StatusIcon status="done" {...p} />,
  },
  progress: {
    components: [["progress", "Progress"]],
    extra: [{ name: "value", control: "number", default: 64 }],
    initial: { color: "green" },
    render: (p) => <Progress value={0} {...p} style={{ width: px(180) }} />,
  },
  "xp-drop": {
    components: [["xp-drop", "XpDrop"]],
    extra: [{ name: "skill", control: "select", options: ["attack", "strength", "ranged", "magic", "woodcutting", "fishing", "mining"], default: "ranged" }],
    initial: { amount: 1248 },
    render: ({ skill, amount }) => <XpDrop skills={[skill ?? "ranged"]} amount={amount ?? 0} />,
  },
  "item-slot": {
    components: [["item-slot", "ItemSlot"]],
    initial: { quantity: 250000 },
    stageClassName: "osrs-texture-side-panel",
    render: (p) => (
      <ItemSlot {...p}>
        <Coins />
      </ItemSlot>
    ),
  },
  "equipment-slot": {
    components: [["equipment-slot", "EquipmentSlot"]],
    initial: { slot: "weapon" },
    extra: [{ name: "item", control: "boolean", default: true }],
    stageClassName: "osrs-texture-side-panel",
    render: ({ item, ...p }) => <EquipmentSlot slot="weapon" {...p}>{item ? <Whip /> : null}</EquipmentSlot>,
  },
  "skill-tile": {
    components: [["skill-tile", "SkillTile"]],
    initial: { skill: "strength", level: 99, boosted: 118 },
    stageClassName: "osrs-texture-side-panel",
    render: (p) => <SkillTile skill="attack" level={1} {...p} />,
  },
  "prayer-button": {
    components: [["prayer-button", "PrayerButton"]],
    extra: [{ name: "defaultPressed", control: "boolean", default: false }],
    initial: { prayer: "piety" },
    stageClassName: "osrs-texture-side-panel",
    render: (p) => <PrayerButton key={String(p.defaultPressed)} prayer="piety" {...p} />,
  },
  orb: {
    components: [["orb", "Orb"]],
    initial: { kind: "hitpoints", value: 84, max: 99 },
    render: (p) => <Orb kind="hitpoints" value={0} {...p} />,
  },
};

/** Pages with a playground. */
export const PLAYGROUND_PAGES = Object.keys(CONFIGS);

// referenced so the chatbox page can switch to NPC dialogue later without new imports
void NpcDialogue;
