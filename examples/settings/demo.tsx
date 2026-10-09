import { Checkbox } from "@/registry/osrs/ui/checkbox";
import { SettingRow, SettingsSection } from "@/registry/osrs/ui/settings";

export default function SettingsDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text w-[calc(260*var(--osrs-px))] p-6">
      <SettingsSection title="Combat">
        <SettingRow label="Hitsplat tinting"><Checkbox defaultChecked /></SettingRow>
        <SettingRow label="Max hit hitsplats"><Checkbox /></SettingRow>
        <SettingRow label="Show boss health overlay"><Checkbox defaultChecked /></SettingRow>
      </SettingsSection>
    </div>
  );
}
