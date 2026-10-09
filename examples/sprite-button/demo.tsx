import { buttonSprites } from "@/registry/osrs/ui/button-sprites";
import { optionSprites } from "@/registry/osrs/ui/option-sprites";
import { SpriteButton } from "@/registry/osrs/ui/sprite-button";

export default function SpriteButtonDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex items-center gap-[calc(8*var(--osrs-px))] p-6">
      <SpriteButton sprite={buttonSprites.menu} activeSprite={buttonSprites.menuSelected} aria-label="Menu" />
      <SpriteButton sprite={buttonSprites.wrench} activeSprite={buttonSprites.wrenchHovered} aria-label="Settings" />
      <SpriteButton sprite={optionSprites.masterVolume} aria-label="Sound" />
    </div>
  );
}
