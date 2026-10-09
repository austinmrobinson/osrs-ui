import { SidePanel, SidePanelContent } from "@/registry/osrs/ui/side-panel";
import { BOTTOM_TABS, TOP_TABS } from "@/site/demo-data/game";

export default function SidePanelDemo() {
  return (
    <div className="osrs flex justify-center p-6">
      <SidePanel top={TOP_TABS} bottom={BOTTOM_TABS} defaultValue="inventory">
        {[...TOP_TABS, ...BOTTOM_TABS].map((t) => (
          <SidePanelContent key={t.value} value={t.value} className="osrs-text">
            {t.label}
          </SidePanelContent>
        ))}
      </SidePanel>
    </div>
  );
}
