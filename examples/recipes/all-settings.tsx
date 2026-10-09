"use client";

import { Button } from "@/registry/osrs/ui/button";
import { Checkbox } from "@/registry/osrs/ui/checkbox";
import { Input } from "@/registry/osrs/ui/input";
import { NavItem, NavList } from "@/registry/osrs/ui/nav-list";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { Field, FieldContent, FieldDescription, FieldLegend, FieldSet, FieldTitle } from "@/registry/osrs/ui/field";
import { Slider } from "@/registry/osrs/ui/slider";
import { Tabs, TabsContent } from "@/registry/osrs/ui/tabs";
import { Window, WindowClose, WindowHeader } from "@/registry/osrs/ui/window";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;
const CATEGORIES = ["Activities", "Audio", "Chat", "Controls", "Display", "Gameplay", "Interfaces", "Warnings"];

export default function AllSettingsRecipe() {
  return (
    <div className="osrs flex items-start justify-start p-6">
      <Window draggable resizable style={{ width: px(512), height: px(560) }} minWidth={420} minHeight={300}>
        <WindowHeader
          start={
            <>
              <Button variant="metal" tone="white" size="sm">
                Less info
              </Button>
              <Button variant="metal" tone="white" size="sm">
                Hide locked
              </Button>
            </>
          }
          end={<WindowClose />}
        >
          Settings
        </WindowHeader>
        <Tabs orientation="vertical" defaultValue="Display" className="min-h-0 flex-1 flex-row">
          <NavList style={{ width: px(124) }}>
            {CATEGORIES.map((c) => (
              <NavItem
                key={c}
                value={c}
                tooltip={
                  <>
                    Select <span style={{ color: "var(--osrs-orange)" }}>{c}</span>
                  </>
                }
              >
                {c}
              </NavItem>
            ))}
          </NavList>
          <div className="flex min-w-0 flex-1 flex-col">
            <div
              className="flex items-center"
              style={{
                gap: px(10),
                padding: `${px(6)} ${px(6)} ${px(6)} ${px(12)}`,
              }}
            >
              <span>Search:</span>
              <Input placeholder="*" className="flex-1" />
            </div>
            <TabsContent value="Display" className="min-h-0 flex-1" style={{ boxShadow: `inset 0 ${px(1)} 0 #1f1a14` }}>
              <ScrollArea className="h-full">
                <FieldSet variant="section" style={{ margin: px(6) }}>
                  <FieldLegend>Graphics</FieldLegend>
                  <Field orientation="vertical">
                    <FieldContent>
                      <FieldTitle>Screen Brightness</FieldTitle>
                      <FieldDescription>Change the level of brightness to make the world look lighter or darker.</FieldDescription>
                    </FieldContent>
                    <Slider defaultValue={40} className="mx-auto" style={{ width: px(260) }} />
                  </Field>
                  <Field orientation="vertical">
                    <FieldContent>
                      <FieldTitle>Camera zoom distance</FieldTitle>
                      <FieldDescription>Use the slider to change the camera zoom level.</FieldDescription>
                    </FieldContent>
                    <Slider defaultValue={30} thumb="green" className="mx-auto" style={{ width: px(260) }} />
                  </Field>
                  <Field orientation="vertical">
                    <FieldContent>
                      <FieldTitle>View distance</FieldTitle>
                      <FieldDescription>Change how far you can see the landscape. This does not affect view distance of other players or interact distance.</FieldDescription>
                    </FieldContent>
                    <Slider defaultValue={0} className="mx-auto" style={{ width: px(260) }} />
                  </Field>
                  <Field>
                    <FieldContent>
                      <FieldTitle>Hide roofs</FieldTitle>
                      <FieldDescription>When enabled, hides all roofs. If you are inside a building, the roof will be hidden regardless of the setting being disabled.</FieldDescription>
                    </FieldContent>
                    <Checkbox variant="bordered" />
                  </Field>
                  <Field>
                    <FieldContent>
                      <FieldTitle>Scroll wheel can change zoom distance</FieldTitle>
                      <FieldDescription>When enabled, the scroll wheel can change the camera zoom.</FieldDescription>
                    </FieldContent>
                    <Checkbox variant="bordered" defaultChecked />
                  </Field>
                </FieldSet>
              </ScrollArea>
            </TabsContent>
            {CATEGORIES.filter((c) => c !== "Display").map((c) => (
              <TabsContent key={c} value={c} className="flex flex-1 items-center justify-center">
                {c} settings
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </Window>
    </div>
  );
}
