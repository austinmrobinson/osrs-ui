import { ScrollArea } from "@/registry/osrs/ui/scroll-area";

const quests = [
  "Cook's Assistant", "Demon Slayer", "The Restless Ghost", "Romeo & Juliet", "Sheep Shearer",
  "Shield of Arrav", "Ernest the Chicken", "Vampyre Slayer", "Imp Catcher", "Prince Ali Rescue",
  "Doric's Quest", "Black Knights' Fortress", "Witch's Potion", "The Knight's Sword", "Goblin Diplomacy",
  "Pirate's Treasure", "Dragon Slayer I", "Rune Mysteries", "Misthalin Mystery", "The Corsair Curse",
];

export default function ScrollAreaDemo() {
  return (
    <div className="osrs osrs-texture-stone flex justify-center p-6">
      <ScrollArea className="osrs-text h-[calc(120*var(--osrs-px))] w-[calc(170*var(--osrs-px))]">
        <ul className="px-[calc(4*var(--osrs-px))]">
          {quests.map((q, i) => (
            <li key={q} style={{ color: i < 6 ? "var(--osrs-green)" : i < 9 ? "var(--osrs-yellow)" : "var(--osrs-red)" }}>
              {q}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
