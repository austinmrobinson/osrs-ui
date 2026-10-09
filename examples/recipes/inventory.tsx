import { Inventory } from "@/registry/osrs/ui/item-slot";
import { SidePanel, SidePanelContent } from "@/registry/osrs/ui/side-panel";
import { BOTTOM_TABS, Item, TOP_TABS } from "../data/game";

export default function InventoryRecipe() {
  return (
    <div className="osrs flex justify-center p-6">
      <SidePanel top={TOP_TABS} bottom={BOTTOM_TABS} defaultValue="inventory">
        <SidePanelContent value="inventory">
          <Inventory>
            <Item id="abyssal-whip" />
            <Item id="dragon-defender" />
            <Item id="super-combat-potion-4" />
            <Item id="prayer-potion-4" />
            <Item id="saradomin-brew-4" />
            <Item id="super-restore-4" />
            <Item id="prayer-potion-4" />
            <Item id="stamina-potion-4" />
            <Item id="shark" />
            <Item id="shark" />
            <Item id="shark" />
            <Item id="shark" />
            <Item id="anglerfish" />
            <Item id="anglerfish" />
            <Item id="cooked-karambwan" />
            <Item id="cooked-karambwan" />
            <Item id="coins-10000" quantity={1_284_317} />
            <Item id="nature-rune" quantity={3_412} />
            <Item id="law-rune" quantity={412} />
            <Item id="blood-rune" quantity={18_420_000} />
            <Item id="ring-of-dueling-8" />
            <Item id="games-necklace-8" />
            <Item id="rune-pickaxe" />
            <Item id="clue-scroll-elite" />
            {null}
            {null}
            <Item id="spade" />
            <Item id="tinderbox" />
          </Inventory>
        </SidePanelContent>
      </SidePanel>
    </div>
  );
}
