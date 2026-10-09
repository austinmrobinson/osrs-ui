import { Progress } from "@/registry/osrs/ui/progress";

export default function ProgressDemo() {
  return (
    <div className="osrs osrs-texture-stone flex w-[calc(220*var(--osrs-px))] flex-col gap-[calc(6*var(--osrs-px))] p-6">
      <Progress value={64}>64%</Progress>
      <Progress value={30} color="orange" />
      <Progress value={100} color="green" />
      <Progress value={100} color="red" />
    </div>
  );
}
