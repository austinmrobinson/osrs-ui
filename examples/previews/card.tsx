"use client";

// One preview per component, for the overview cards and the search window
// (scripts/build-previews.ts screenshots `/blume-examples/previews/card?page=<name>`).
// Every preview is drawn at the same scale (one game pixel = 1px, the game's own 16px text) so
// the cards compare true to size. Menus, dialogs and tooltips are shown open; game elements sit on
// nothing, as they do in their panels. Pages without an entry here use their playground at its
// starting props.
import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/registry/osrs/ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/registry/osrs/ui/dropdown-menu";
import { Interface, InterfaceClose, InterfaceContent, InterfaceHeader, InterfaceTitle } from "@/registry/osrs/ui/interface";
import { Window, WindowBody, WindowClose, WindowHeader } from "@/registry/osrs/ui/window";
import { skillIcons } from "@/registry/osrs/ui/skill-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";
import { emoteSprites } from "@/registry/osrs/ui/emote-sprites";
import { minigameSprites } from "@/registry/osrs/ui/minigame-sprites";
import { normalSpellSprites } from "@/registry/osrs/ui/spell-normal-sprites";
import { prayerSprites } from "@/registry/osrs/ui/prayer-sprites";
import { tabSprites } from "@/registry/osrs/ui/tab-sprites";
import type { SpriteComponent } from "@/registry/osrs/lib/sprite";
import { NavItem, NavList } from "@/registry/osrs/ui/nav-list";
import { RadioGroup, RadioGroupItem } from "@/registry/osrs/ui/radio-group";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { Item } from "@/site/demo-data/game";
import { initialValues } from "@/site/playground/Playground";
import { CONFIGS } from "@/site/playground/configs";
import SeparatorDemo from "@/examples/separator/demo";
import SidePanelDemo from "@/examples/side-panel/demo";
import { buttonSprites } from "@/registry/osrs/ui/button-sprites";
import { chevronSprites } from "@/registry/osrs/ui/chevron-sprites";
import { Checkbox } from "@/registry/osrs/ui/checkbox";
import { CodeBlock } from "@/registry/osrs/ui/code-block";
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/registry/osrs/ui/field";
import { optionSprites } from "@/registry/osrs/ui/option-sprites";
import { SearchField } from "@/registry/osrs/ui/search-field";
import { Separator } from "@/registry/osrs/ui/separator";
import { Shortcut } from "@/registry/osrs/ui/shortcut";
import { SplitButton } from "@/registry/osrs/ui/split-button";
import { SpriteButton } from "@/registry/osrs/ui/sprite-button";
import { Step, Steps } from "@/registry/osrs/ui/steps";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;

/** A fixed-seed pick of `n` entries, so previews show a spread of the set but never change. */
function sample<T>(all: T[], n: number, seed: number) {
  const out: T[] = [];
  const pool = [...all];
  let s = seed;
  for (let i = 0; i < n && pool.length; i++) {
    s = (s * 1103515245 + 12345) % 2147483648;
    out.push(pool.splice(s % pool.length, 1)[0]);
  }
  return out;
}

const SKILLS = sample(Object.entries(skillIcons), 5, 7);
// sprites from across the sets, all of one size (the most common one) so the row reads evenly
const ALL_SPRITES = [tabSprites, prayerSprites, normalSpellSprites, emoteSprites, minigameSprites].flatMap((g) => Object.entries(g) as [string, SpriteComponent][]);
const sizeKey = ([, S]: [string, SpriteComponent]) => `${S.spriteWidth}x${S.spriteHeight}`;
const counts = ALL_SPRITES.reduce<Record<string, number>>((m, e) => ((m[sizeKey(e)] = (m[sizeKey(e)] ?? 0) + 1), m), {});
const COMMON = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
const SPRITES = sample(ALL_SPRITES.filter((e) => sizeKey(e) === COMMON), 5, 29);

const PREVIEWS: Record<string, () => React.ReactNode> = {
  dialog: () => (
    <Interface style={{ width: px(200) }}>
      <InterfaceHeader>
        <InterfaceTitle>Are you sure?</InterfaceTitle>
        <InterfaceClose />
      </InterfaceHeader>
      <InterfaceContent className="osrs-text items-center text-center" style={{ gap: px(8) }}>
        <p className="m-0">Drop the Abyssal whip?</p>
        <div className="flex" style={{ gap: px(6) }}>
          <Button tone="destructive">Yes</Button>
          <Button>No</Button>
        </div>
      </InterfaceContent>
    </Interface>
  ),
  "dropdown-menu": () => (
    <DropdownMenu defaultOpen modal={false}>
      <DropdownMenuTrigger render={<Button size="sm" />}>View</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Overview</DropdownMenuItem>
        <DropdownMenuItem>Tasks</DropdownMenuItem>
        <DropdownMenuItem>Rewards</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  // the screenshot script right-clicks [data-preview-rightclick] to open it
  "context-menu": () => (
    <ContextMenu>
      <ContextMenuTrigger data-preview-rightclick="" style={{ display: "block", width: px(12), height: px(12) }} />
      <ContextMenuContent>
        <ContextMenuItem target="Bank booth">Bank</ContextMenuItem>
        <ContextMenuItem target="Bank booth">Collect</ContextMenuItem>
        <ContextMenuItem>Walk here</ContextMenuItem>
        <ContextMenuItem>Cancel</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  tabs: () => (
    <Tabs variant="panel" defaultValue="bosses" style={{ width: px(200) }}>
      <TabsList>
        {["Bosses", "Raids", "Clues"].map((t) => (
          <TabsTrigger key={t} value={t.toLowerCase()}>
            {t}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="bosses" className="osrs-text" style={{ padding: px(6), height: px(60) }}>
        Abyssal Sire
        <br />
        Alchemical Hydra
        <br />
        Araxxor
      </TabsContent>
    </Tabs>
  ),
  // containers at a width that fits a card without shrinking, like the smaller previews beside them
  interface: () => (
    <Interface style={{ width: px(200) }}>
      <InterfaceHeader>
        <InterfaceTitle>Bank</InterfaceTitle>
        <InterfaceClose />
      </InterfaceHeader>
      <InterfaceContent className="osrs-text">
        <div className="flex" style={{ gap: px(2) }}>
          {(["coins-10000", "shark", "prayer-potion-4", "law-rune", "dragon-bones"] as const).map((id) => (
            <Item key={id} id={id} />
          ))}
        </div>
      </InterfaceContent>
    </Interface>
  ),
  window: () => (
    <Window style={{ width: px(200), height: px(110) }}>
      <WindowHeader end={<WindowClose />}>Grand Exchange</WindowHeader>
      <WindowBody>Windows can be any size.</WindowBody>
    </Window>
  ),
  "scroll-area": () => (
    <ScrollArea className="osrs-text" style={{ height: px(96), width: px(150) }}>
      <ul className="m-0 list-none" style={{ padding: `0 ${px(4)}` }}>
        {["Cook's Assistant", "Demon Slayer", "The Restless Ghost", "Romeo & Juliet", "Sheep Shearer", "Shield of Arrav", "Ernest the Chicken", "Vampyre Slayer", "Imp Catcher", "Prince Ali Rescue"].map((q, i) => (
          <li key={q} style={{ color: i < 4 ? "var(--osrs-green)" : i < 6 ? "var(--osrs-yellow)" : "var(--osrs-red)" }}>
            {q}
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
  "radio-group": () => (
    <RadioGroup defaultValue="one" className="flex-row" style={{ gap: px(12) }}>
      {[
        ["one", "One mouse button"],
        ["two", "Two"],
      ].map(([v, l]) => (
        <label key={v} className="flex items-center" style={{ gap: px(4) }}>
          <RadioGroupItem value={v} />
          {l}
        </label>
      ))}
    </RadioGroup>
  ),
  // the list on its own, without the panel shading it sits on in the Settings window
  "nav-list": () => (
    <Tabs orientation="vertical" defaultValue="Display" className="flex-row">
      <NavList style={{ width: px(76), background: "none", boxShadow: "none", padding: 0 }}>
        {["Activities", "Audio", "Chat", "Display"].map((i) => (
          <NavItem key={i} value={i}>
            {i}
          </NavItem>
        ))}
      </NavList>
    </Tabs>
  ),
  separator: () => <SeparatorDemo />,
  // the popover drawn open, as its window on its own
  popover: () => (
    <Interface className="osrs-popover" style={{ position: "static" }}>
      <FieldSet variant="section">
        <FieldLegend className="w-full">Display</FieldLegend>
        <Separator />
        <div>
          <Field density="spacious">
            <FieldLabel>Hide roofs</FieldLabel>
            <Checkbox defaultChecked />
          </Field>
          <Field density="spacious">
            <FieldLabel>Show fog</FieldLabel>
            <Checkbox />
          </Field>
        </div>
      </FieldSet>
    </Interface>
  ),
  "code-block": () => <CodeBlock style={{ width: px(240) }}>npx shadcn add button</CodeBlock>,
  steps: () => (
    <Steps style={{ width: px(180) }}>
      <Step n={1} title="Talk to the Cook" />
      <Step n={2} title="Gather ingredients" />
    </Steps>
  ),
  "sprite-button": () => (
    <div className="flex items-center" style={{ gap: px(8) }}>
      <SpriteButton sprite={buttonSprites.menu} activeSprite={buttonSprites.menuSelected} aria-label="Menu" />
      <SpriteButton sprite={buttonSprites.wrench} activeSprite={buttonSprites.wrenchHovered} aria-label="Settings" />
      <SpriteButton sprite={optionSprites.masterVolume} aria-label="Sound" />
    </div>
  ),
  "split-button": () => (
    <SplitButton style={{ width: px(160) }}>
      <Button>Withdraw all</Button>
      <Button size="icon" aria-label="Withdraw a tab">
        <chevronSprites.yellowDownSingle />
      </Button>
    </SplitButton>
  ),
  "search-field": () => <SearchField aria-label="Search" style={{ width: px(200) }} />,
  shortcut: () => (
    <div className="flex items-center" style={{ gap: px(8) }}>
      <Shortcut keys={["⌘", "K"]} />
      <Shortcut>Esc</Shortcut>
    </div>
  ),
  "side-panel": () => <SidePanelDemo />,
  "skill-icons": () => (
    <div className="flex" style={{ gap: px(4) }}>
      {SKILLS.map(([k, Icon]) => (
        <Icon key={k} />
      ))}
    </div>
  ),
  sprites: () => (
    <div className="flex items-center" style={{ gap: px(4) }}>
      {SPRITES.map(([k, S]) => (
        <S key={k} />
      ))}
    </div>
  ),
};

export default function PreviewCard() {
  const [page, setPage] = React.useState<string | null>(null);
  React.useEffect(() => setPage(new URLSearchParams(window.location.search).get("page")), []);
  // a box to hydrate on: the frame hydrates islands when they scroll into view, and an empty one never does
  if (!page) return <div style={{ width: 1, height: 1 }} />;
  const custom = PREVIEWS[page];
  const config = CONFIGS[page];
  return (
    <div className="osrs osrs-text inline-flex" data-preview={page} style={{ ["--osrs-px" as string]: "1px", padding: 24 }}>
      {custom ? custom() : config ? config.render(initialValues(page)) : null}
    </div>
  );
}
