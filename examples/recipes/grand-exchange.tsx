import { Button } from "@/registry/osrs/ui/button";
import { Card, CardContent, CardHeader } from "@/registry/osrs/ui/card";
import { ItemSlot } from "@/registry/osrs/ui/item-slot";
import { Progress } from "@/registry/osrs/ui/progress";
import { Window, WindowClose, WindowHeader } from "@/registry/osrs/ui/window";
import { geSprites } from "@/registry/osrs/ui/ge-sprites";
import { items, type ItemId } from "@/site/demo-data/items";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;

type Offer = { type: "Buy" | "Sell"; item: ItemId; qty: number; value: number; price: number; color: "red" | "green" | "orange" };
const OFFERS: (Offer | null)[] = [
  { type: "Buy", item: "dragon-bones", qty: 1000, value: 100, price: 3134, color: "red" },
  { type: "Sell", item: "raw-shark", qty: 1, value: 100, price: 554, color: "green" },
  { type: "Buy", item: "magic-logs", qty: 500, value: 0, price: 499, color: "orange" },
  { type: "Sell", item: "nature-rune", qty: 289, value: 35, price: 31, color: "orange" },
  null,
  null,
  null,
  null,
];

export default function GrandExchangeRecipe() {
  return (
    <div className="osrs flex justify-center p-6">
      <Window frame="tan" style={{ width: px(484), height: px(304) }}>
        <WindowHeader start={<Button variant="metal" size="sm">History</Button>} end={<WindowClose />}>
          Grand Exchange
        </WindowHeader>
        <div className="flex items-center justify-between" style={{ marginBottom: px(4) }}>
          <Button variant="metal" size="sm">Repeat Offer</Button>
          <span className="osrs-text-small">Select an offer slot to set up or view an offer.</span>
          <Button variant="metal" size="sm" disabled>Collect</Button>
        </div>
        <div className="grid flex-1 grid-cols-4 grid-rows-2" style={{ gap: px(4) }}>
          {OFFERS.map((o, i) => (
            <Card key={i} variant="offer">
              <CardHeader>{o ? o.type : "Empty"}</CardHeader>
              {o ? (
                <CardContent style={{ gap: px(4), padding: `0 ${px(3)}` }}>
                  <div className="flex items-start" style={{ gap: px(3) }}>
                    <div className="relative shrink-0">
                      <geSprites.selectedItemBox />
                      <ItemSlot quantity={o.qty} className="absolute" style={{ left: px(2), top: px(2) }}>
                        {(() => {
                          const { Icon } = items[o.item];
                          return <Icon />;
                        })()}
                      </ItemSlot>
                    </div>
                    <span className="osrs-text-small" style={{ lineHeight: px(11) }}>
                      {items[o.item].name}
                    </span>
                  </div>
                  <Progress value={o.value} color={o.color} />
                  <span className="osrs-text-small text-center">{o.price.toLocaleString("en-US")} coins</span>
                </CardContent>
              ) : (
                <CardContent className="flex-row items-center justify-around">
                  <button type="button" aria-label="Buy" className="group relative border-0 bg-transparent p-0">
                    <geSprites.makeOfferBuy className="group-hover:hidden" />
                    <geSprites.makeOfferBuyHovered className="hidden group-hover:block" />
                  </button>
                  <button type="button" aria-label="Sell" className="group relative border-0 bg-transparent p-0">
                    <geSprites.makeOfferSell className="group-hover:hidden" />
                    <geSprites.makeOfferSellHovered className="hidden group-hover:block" />
                  </button>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </Window>
    </div>
  );
}
