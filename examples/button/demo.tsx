import { Button } from "@/registry/osrs/ui/button";

export default function ButtonDemo() {
  return (
    <div className="osrs osrs-texture-stone flex flex-wrap items-center gap-4 p-6">
      <Button>Deposit inventory</Button>
      <Button size="sm">Note</Button>
      <Button disabled>Disabled</Button>
      <Button variant="square">Square</Button>
      <Button variant="square" aria-pressed="true">Selected</Button>
    </div>
  );
}
