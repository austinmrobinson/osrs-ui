import { Interface, InterfaceClose, InterfaceContent, InterfaceHeader, InterfaceTitle } from "@/registry/osrs/ui/interface";
import { ToggleGroup, ToggleGroupItem } from "@/registry/osrs/ui/toggle-group";
import { Item } from "@/site/demo-data/game";
import type { ItemId } from "@/site/demo-data/items";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;
const ITEMS: [ItemId, number][] = [
  ["coins-10000", 2_450_000],
  ["shark", 412],
  ["prayer-potion-4", 96],
  ["law-rune", 3_200],
  ["dragon-bones", 840],
  ["magic-logs", 1_206],
];

export default function InterfaceDemo() {
  return (
    <div className="osrs flex justify-center p-6">
      <Interface style={{ width: px(260) }}>
        <InterfaceHeader>
          <InterfaceTitle>The Bank of Gielinor</InterfaceTitle>
          <InterfaceClose />
        </InterfaceHeader>
        <InterfaceContent className="osrs-text" style={{ gap: px(8) }}>
          <div className="grid grid-cols-6" style={{ gap: px(2) }}>
            {ITEMS.map(([id, q]) => (
              <Item key={id} id={id} quantity={q} />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <ToggleGroup defaultValue={["item"]} style={{ gap: px(2) }}>
              <ToggleGroupItem value="item" size="sm">
                Item
              </ToggleGroupItem>
              <ToggleGroupItem value="note" size="sm">
                Note
              </ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup defaultValue={["1"]} style={{ gap: px(2) }}>
              {["1", "5", "10", "All"].map((v) => (
                <ToggleGroupItem key={v} value={v} size="icon-sm">
                  {v}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </InterfaceContent>
      </Interface>
    </div>
  );
}
