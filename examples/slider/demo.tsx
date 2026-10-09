import { Slider } from "@/registry/osrs/ui/slider";

export default function SliderDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex w-[calc(260*var(--osrs-px))] flex-col gap-[calc(6*var(--osrs-px))] p-6">
      <span>Screen brightness</span>
      <Slider defaultValue={40} />
      <span>Camera zoom</span>
      <Slider defaultValue={25} thumb="green" />
      <span>Danger level</span>
      <Slider defaultValue={80} thumb="red" notches={3} />
    </div>
  );
}
