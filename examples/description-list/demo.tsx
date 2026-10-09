// Label / value rows: equipment bonuses and summaries.
import { DescriptionItem, DescriptionList } from "@/registry/osrs/ui/description-list";

export default function DescriptionListDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text p-6" style={{ width: "calc(220 * var(--osrs-px))" }}>
      <DescriptionList striped>
        <DescriptionItem label="Stab">+82</DescriptionItem>
        <DescriptionItem label="Slash">+82</DescriptionItem>
        <DescriptionItem label="Crush">+0</DescriptionItem>
        <DescriptionItem label="Melee strength">+82</DescriptionItem>
        <DescriptionItem label="Prayer">+0</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
