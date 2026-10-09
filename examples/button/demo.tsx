import { Button } from "@/registry/osrs/ui/button";
import { bankSprites } from "@/registry/osrs/ui/bank-sprites";
import { buttonSprites } from "@/registry/osrs/ui/button-sprites";
import { chevronSprites } from "@/registry/osrs/ui/chevron-sprites";
import { iconSprites } from "@/registry/osrs/ui/icon-sprites";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;
const VARIANTS = ["stone", "metal", "square", "flat"] as const;

export default function ButtonDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex flex-col p-6" style={{ gap: px(8) }}>
      <div className="grid items-center" style={{ gridTemplateColumns: `${px(56)} repeat(7, auto)`, gap: `${px(6)} ${px(8)}` }}>
        <span />
        {["sm", "default", "lg", "pressed", "icon-sm", "icon", "icon-lg"].map((h) => (
          <span key={h} className="osrs-text-small" style={{ color: "var(--osrs-white)" }}>
            {h}
          </span>
        ))}
        {VARIANTS.map((v) => (
          <div key={v} className="contents">
            <span className="osrs-text-small" style={{ color: "var(--osrs-white)" }}>{v}</span>
            <Button variant={v} size="sm">Note</Button>
            <Button variant={v}>Deposit</Button>
            <Button variant={v} size="lg">Show more</Button>
            <Button variant={v} aria-pressed>All</Button>
            <Button variant={v} size="icon-sm" aria-label="Expand">
              <chevronSprites.yellowDownSingle />
            </Button>
            <Button variant={v} size="icon" aria-label="Bank settings">
              <buttonSprites.wrench />
            </Button>
            <Button variant={v} size="icon-lg" aria-label="Deposit inventory">
              <bankSprites.depositInventory />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-center" style={{ gap: px(8) }}>
        <Button disabled>Disabled</Button>
        <Button variant="metal" disabled>Disabled</Button>
        <Button variant="square" size="icon" aria-label="Add" >
          <iconSprites.plusIcon />
        </Button>
      </div>
    </div>
  );
}
