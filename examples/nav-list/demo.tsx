import { NavItem, NavList } from "@/registry/osrs/ui/nav-list";
import { Tabs, TabsContent } from "@/registry/osrs/ui/tabs";

const ITEMS = ["Activities", "Audio", "Chat", "Controls", "Display", "Gameplay", "Interfaces", "Warnings"];

export default function NavListDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text p-6">
      <Tabs orientation="vertical" defaultValue="Display" className="flex-row gap-[calc(8*var(--osrs-px))]">
        <NavList className="w-[calc(76*var(--osrs-px))]">
          {ITEMS.map((i) => (
            <NavItem key={i} value={i} tooltip={<>Select <span className="text-[var(--osrs-orange)]">{i}</span></>}>
              {i}
            </NavItem>
          ))}
        </NavList>
        {ITEMS.map((i) => (
          <TabsContent key={i} value={i}>{i} settings</TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
