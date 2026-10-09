import { Interface, InterfaceClose, InterfaceContent, InterfaceHeader, InterfaceTitle } from "@/registry/osrs/ui/interface";
import { Button } from "@/registry/osrs/ui/button";

export default function InterfaceDemo() {
  return (
    <div className="osrs flex justify-center p-6">
      <Interface className="w-[calc(220*var(--osrs-px))]">
        <InterfaceHeader>
          <InterfaceTitle>The Bank of Gielinor</InterfaceTitle>
          <InterfaceClose />
        </InterfaceHeader>
        <InterfaceContent className="gap-[calc(6*var(--osrs-px))]">
          <p>Interfaces tile the stone texture and repeat the rivet frame, so they can be any size.</p>
          <div className="flex justify-end gap-[calc(4*var(--osrs-px))]">
            <Button variant="tile" size="sm">Item</Button>
            <Button variant="tile" size="sm">Note</Button>
          </div>
        </InterfaceContent>
      </Interface>
    </div>
  );
}
