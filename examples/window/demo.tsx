import { Button } from "@/registry/osrs/ui/button";
import { List, ListItem } from "@/registry/osrs/ui/list";
import { Window, WindowBody, WindowClose, WindowHeader } from "@/registry/osrs/ui/window";

const QUESTS = [
  "Cook's Assistant", "Demon Slayer", "The Restless Ghost", "Romeo & Juliet", "Sheep Shearer", "Shield of Arrav",
  "Ernest the Chicken", "Vampyre Slayer", "Imp Catcher", "Prince Ali Rescue", "Doric's Quest", "Black Knights' Fortress",
];

export default function WindowDemo() {
  return (
    <div className="osrs flex h-[calc(260*var(--osrs-px))] items-start justify-start p-6">
      <Window draggable resizable defaultSize={{ width: 440, height: 300 }} minWidth={240} minHeight={140}>
        <WindowHeader start={<Button variant="metal" tone="white" size="sm">Filter</Button>} end={<WindowClose />}>
          Quest List
        </WindowHeader>
        <WindowBody scroll>
          <List>
            {QUESTS.map((q, i) => (
              <ListItem key={q} style={{ color: i < 5 ? "var(--osrs-green)" : i < 8 ? "var(--osrs-yellow)" : "var(--osrs-red)" }}>
                {q}
              </ListItem>
            ))}
          </List>
        </WindowBody>
      </Window>
    </div>
  );
}
