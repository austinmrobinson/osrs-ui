import { Button } from "@/registry/osrs/ui/button";
import { Window, WindowBody, WindowClose, WindowHeader } from "@/registry/osrs/ui/window";

export default function WindowDemo() {
  return (
    <div className="osrs flex justify-center p-6">
      <Window style={{ width: "calc(260 * var(--osrs-px))", height: "calc(130 * var(--osrs-px))" }}>
        <WindowHeader start={<Button variant="metal" size="sm">History</Button>} end={<WindowClose />}>
          Window title
        </WindowHeader>
        <WindowBody className="items-center justify-center">The modern interface frame, at any size.</WindowBody>
      </Window>
    </div>
  );
}
