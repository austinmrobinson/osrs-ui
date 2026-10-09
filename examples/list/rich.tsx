// Rich rows, as in the Skill Guide: item media, a title and labelled description lines.
import { List, ListItem, ListItemContent, ListItemDescription, ListItemMedia, ListItemTitle } from "@/registry/osrs/ui/list";
import { Item } from "@/site/demo-data/game";
import type { ItemId } from "@/site/demo-data/items";

const ROWS: [ItemId, string, string][] = [
  ["bronze-bar", "Bronze bar", "Level 1 Smithing"],
  ["gold-bar", "Gold bar", "Level 40 Smithing"],
  ["rune-platebody", "Rune platebody", "Level 99 Smithing"],
];

export default function ListRichDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text p-6" style={{ width: "calc(260 * var(--osrs-px))" }}>
      <List>
        {ROWS.map(([id, name, req]) => (
          <ListItem key={id}>
            <ListItemMedia>
              <Item id={id} />
            </ListItemMedia>
            <ListItemContent>
              <ListItemTitle>{name}</ListItemTitle>
              <ListItemDescription label="Requires">{req}</ListItemDescription>
            </ListItemContent>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
