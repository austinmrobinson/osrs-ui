import { PrayerButton } from "@/registry/osrs/ui/prayer-button";

export default function PrayerButtonDemo() {
  return (
    <div className="osrs osrs-texture-side-panel flex p-6">
      <PrayerButton prayer="protectFromMagic" />
      <PrayerButton prayer="protectFromMelee" defaultPressed />
      <PrayerButton prayer="piety" defaultPressed />
      <PrayerButton prayer="rigour" locked />
      <PrayerButton prayer="augury" locked />
    </div>
  );
}
