import { bankSprites } from "@/registry/osrs/ui/bank-sprites";
import { chevronSprites } from "@/registry/osrs/ui/chevron-sprites";
import { combatSprites } from "@/registry/osrs/ui/combat-sprites";
import { glyphSprites } from "@/registry/osrs/ui/glyph-sprites";
import { iconSprites } from "@/registry/osrs/ui/icon-sprites";
import { prayerSprites } from "@/registry/osrs/ui/prayer-sprites";
import { tabSprites } from "@/registry/osrs/ui/tab-sprites";

const GROUPS = { tabSprites, prayerSprites, combatSprites, bankSprites, glyphSprites, iconSprites, chevronSprites };

export default function SpritesDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex flex-col gap-[calc(6*var(--osrs-px))] p-6">
      {Object.entries(GROUPS).map(([g, sprites]) => (
        <div key={g} className="flex flex-col gap-[calc(2*var(--osrs-px))]">
          <span className="osrs-text-small" style={{ color: "var(--osrs-white)" }}>{g}</span>
          <div className="flex max-w-[calc(320*var(--osrs-px))] flex-wrap gap-[calc(2*var(--osrs-px))]">
            {Object.entries(sprites).slice(0, 24).map(([k, S]) => (
              <S key={k} title={k} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
