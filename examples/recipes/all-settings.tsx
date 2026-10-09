"use client";

import { Button } from "@/registry/osrs/ui/button";
import { Checkbox } from "@/registry/osrs/ui/checkbox";
import { Input } from "@/registry/osrs/ui/input";
import { NavItem, NavList } from "@/registry/osrs/ui/nav-list";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/osrs/ui/select";
import { SettingRow, SettingsSection } from "@/registry/osrs/ui/settings";
import { Slider } from "@/registry/osrs/ui/slider";
import { Tabs, TabsContent } from "@/registry/osrs/ui/tabs";
import { Window, WindowBody, WindowClose, WindowHeader } from "@/registry/osrs/ui/window";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;
const CATEGORIES = ["Activities", "Audio", "Chat", "Controls", "Display", "Gameplay", "Interfaces", "Warnings", "Popout"];

export default function AllSettingsRecipe() {
  return (
    <div className="osrs flex items-start justify-start p-6">
      <Window draggable resizable style={{ width: px(512), height: px(335) }} minWidth={380} minHeight={240}>
        <WindowHeader start={<Button variant="metal" size="sm">Show more information</Button>} end={<WindowClose />}>
          Settings
        </WindowHeader>
        <Tabs orientation="vertical" defaultValue="Activities" className="min-h-0 flex-1 flex-row" style={{ gap: px(6) }}>
          <NavList style={{ width: px(76) }}>
            {CATEGORIES.map((c) => (
              <NavItem key={c} value={c}>
                {c}
              </NavItem>
            ))}
          </NavList>
          <WindowBody className="flex-col" style={{ gap: px(4) }}>
            <div className="flex items-center" style={{ gap: px(6) }}>
              <span>Search:</span>
              <Input placeholder="*" className="flex-1" />
            </div>
            <TabsContent value="Activities" className="min-h-0 flex-1">
              <ScrollArea className="h-full">
                <SettingsSection title="General">
                  <div className="flex justify-end" style={{ padding: px(4) }}>
                    <Button variant="metal" size="lg" style={{ width: px(120) }}>
                      Clear your highlighted NPCs
                    </Button>
                  </div>
                </SettingsSection>
                <SettingsSection title="Combat">
                  <SettingRow label="Hitsplat tinting"><Checkbox defaultChecked /></SettingRow>
                  <SettingRow label="Max hit hitsplats"><Checkbox defaultChecked /></SettingRow>
                  <SettingRow label="Max hit hitsplats threshold">
                    <Input defaultValue="10" className="text-center" style={{ width: px(126) }} />
                  </SettingRow>
                  <SettingRow label="Show boss health overlay"><Checkbox defaultChecked /></SettingRow>
                  <SettingRow label="Show enemy name on health overlay"><Checkbox defaultChecked /></SettingRow>
                  <SettingRow label="Health overlay display type">
                    <Select defaultValue="exact" items={{ exact: "Exact Value", percent: "Percentage", bar: "Bar only" }}>
                      <SelectTrigger style={{ width: px(100) }} />
                      <SelectContent>
                        <SelectItem value="exact">Exact Value</SelectItem>
                        <SelectItem value="percent">Percentage</SelectItem>
                        <SelectItem value="bar">Bar only</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingRow>
                </SettingsSection>
                <SettingsSection title="Skilling">
                  <SettingRow label="Show XP to next level"><Checkbox /></SettingRow>
                  <SettingRow label="Skilling tooltip opacity">
                    <Slider defaultValue={60} style={{ width: px(126) }} />
                  </SettingRow>
                </SettingsSection>
              </ScrollArea>
            </TabsContent>
            {CATEGORIES.slice(1).map((c) => (
              <TabsContent key={c} value={c} className="flex flex-1 items-center justify-center">
                {c} settings
              </TabsContent>
            ))}
          </WindowBody>
        </Tabs>
      </Window>
    </div>
  );
}
