import { Button } from "@/registry/osrs/ui/button";
import { EquipmentGrid } from "@/registry/osrs/ui/equipment-slot";
import { SidePanel, SidePanelContent } from "@/registry/osrs/ui/side-panel";
import { items } from "@/site/demo-data/items";
import { BOTTOM_TABS, TOP_TABS } from "@/site/demo-data/game";

const I = (id: keyof typeof items) => {
  const { Icon, name } = items[id];
  return <Icon title={name} />;
};

export default function EquipmentRecipe() {
  return (
    <div className="osrs flex justify-center p-6">
      <SidePanel top={TOP_TABS} bottom={BOTTOM_TABS} defaultValue="equipment">
        <SidePanelContent value="equipment" className="flex flex-col items-center" style={{ gap: "calc(8 * var(--osrs-px))" }}>
          <EquipmentGrid
            items={{
              cape: I("fire-cape"),
              neck: I("amulet-of-glory-6"),
              weapon: I("abyssal-whip"),
              body: I("fighter-torso"),
              shield: I("dragon-defender"),
              legs: I("dragon-platelegs"),
              hands: I("barrows-gloves"),
              feet: I("dragon-boots"),
              ring: I("berserker-ring-i"),
            }}
          />
          <div className="grid grid-cols-2" style={{ gap: "calc(4 * var(--osrs-px))" }}>
            <Button size="sm">Stats</Button>
            <Button size="sm">Prices</Button>
            <Button size="sm">Death</Button>
            <Button size="sm">Follower</Button>
          </div>
        </SidePanelContent>
      </SidePanel>
    </div>
  );
}
