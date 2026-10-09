import { Slider } from "@/registry/osrs/ui/slider";

export default function SliderDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex w-[calc(180*var(--osrs-px))] flex-col gap-[calc(4*var(--osrs-px))] p-6">
      <span>Music volume</span>
      <Slider defaultValue={70} />
    </div>
  );
}
