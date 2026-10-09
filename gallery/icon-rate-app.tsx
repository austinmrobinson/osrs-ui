// Entry for the Icon Ratings page: original icons drawn with the osrs-pixel-icon skill
// (pixel-icons/gallery/*.txt), each shown at 1x, 2x and 4x and in the place the game would use it.
import * as React from "react";
import { createRoot } from "react-dom/client";

import { ItemSlot } from "@/registry/osrs/ui/item-slot";
import { List, ListItem } from "@/registry/osrs/ui/list";
import { tabSprites } from "@/registry/osrs/ui/tab-sprites";
import { pixelIconKinds, pixelIconNames, pixelIcons, type PixelIconName } from "./icons.generated";
import { RatingsPage } from "./ratings-ui";

const KIND_LABELS: Record<string, string> = {
  tab: "Tab icons",
  item: "Item icons",
  skill: "Skill icons",
  spell: "Spells",
  prayer: "Prayers",
  map: "Map icons",
  rank: "Clan ranks",
};
const KIND_BRIEF: Record<string, string> = {
  tab: "Side-panel tab icon: an object in mild perspective, 33 x 36 canvas, #0e0e0e outline and #1c1c1c drop shadow. Shown on a tab stone.",
  item: "Item icon: a 3D object in the item camera (from above, turned), 36 x 32 canvas, #000001 outline, no shadow. Shown in an item slot.",
  skill: "Skill icon: 25 x 25, #000001 outline, one object per skill.",
  spell: "Spell: 24 x 24, #000001 outline, saturated; the greyed disabled twin is generated. Shown beside it.",
  prayer: "Prayer: 30 x 30 with a coloured glow outline instead of black.",
  map: "Map icon: 15 x 15 grey disc with a black rim and one tiny symbol. Shown on map grass.",
  rank: "Clan rank: 13 x 13, 4-5 colours, has to read at 1x. Shown before a name.",
};

const Scales = ({ Icon }: { Icon: (typeof pixelIcons)[PixelIconName] }) => (
  <div className="icon-scales">
    {[1, 2, 4].map((s) => (
      <figure key={s}>
        <Icon scale={s} />
        <figcaption>{s}x</figcaption>
      </figure>
    ))}
  </div>
);

function Context({ id, kind }: { id: PixelIconName; kind: string }) {
  const Icon = pixelIcons[id];
  const style = { ["--osrs-px" as string]: "2px" } as React.CSSProperties;
  if (kind === "tab")
    return (
      <div className="osrs icon-context" style={style}>
        <span className="relative inline-flex">
          <tabSprites.tabStoneMiddle />
          <Icon className="absolute inset-0" />
        </span>
      </div>
    );
  if (kind === "spell") {
    const Disabled = pixelIcons[`${id}Disabled` as PixelIconName];
    return (
      <div className="osrs icon-context icon-context-spell" style={style}>
        <Icon />
        {Disabled ? <Disabled /> : null}
      </div>
    );
  }
  if (kind === "rank")
    return (
      <div
        className="osrs osrs-text icon-context"
        style={{
          ["--osrs-px" as string]: "2px",
          width: "calc(150 * var(--osrs-px))",
        }}
      >
        <List>
          {["Zezima", "Lynx Titan"].map((n) => (
            <ListItem key={n} style={{ gap: "calc(4 * var(--osrs-px))" }}>
              <Icon />
              <span style={{ color: "var(--osrs-white)" }}>{n}</span>
            </ListItem>
          ))}
        </List>
      </div>
    );
  if (kind === "map")
    return (
      <div className="icon-context icon-context-map" style={style}>
        <Icon />
      </div>
    );
  return (
    <div className="osrs icon-context" style={style}>
      <ItemSlot>
        <Icon />
      </ItemSlot>
    </div>
  );
}

const ids = (Object.keys(pixelIcons) as PixelIconName[]).filter((id) => !id.endsWith("Disabled"));

/** What changed after round 1 (research/icon-ratings.md). */
const CHANGES: Partial<Record<PixelIconName, string>> = {
  iCoinPouch: "Open mouth with a dark inside; form shading.",
  iHourglass: "Shorter; form shading.",
  iLock: "Taller shackle; form shading.",
  iTrophy: "Handles join the cup; the inside stays dark; form shading.",
  tQuestJournal: "Thicker book, steeper view, raised emblem.",
  pMysticWard: "Redone as a bevelled badge (flat face, rim catches the light) instead of a diagonal split.",
  pIronSkin: "Redone as a bevelled shield: gold rim, raised steel face.",
  sWarding: "Redone as a bevelled shield with a raised ward-star; centred.",
  mAltar: "Centred (a build bug offset every map icon).",
  mAnvil: "Centred (build bug).",
  mBank: "Centred (build bug); subject not yet changed.",
  mBoat: "Centred (build bug).",
  mGeneralStore: "Centred (build bug); subject not yet changed.",
  mQuest: "Centred (build bug).",
  spTeleportCivitas: "Centred (build bug).",
};

createRoot(document.getElementById("root")!).render(
  <RatingsPage
    title="Icon Ratings"
    round={2}
    lede={`${ids.length} original icons drawn in the game's style with the pixel-icon skill. Round 2: seven new standard icons (in their own group), and each revised icon shows its round 1 score and what changed. Rate how much each one looks like it belongs in the game, and click any pixel on the large view to comment on that spot. Ratings save as you go, and feed the next round of the skill.`}
    stageScale={false}
    tags={["Looks like the game", "Reads at 1x", "Hard to read", "Wrong colours", "Outline off", "Wrong size", "Too detailed", "Too plain", "Perspective off"]}
    items={ids.map((id) => {
      const kind = pixelIconKinds[id];
      return {
        id,
        title: pixelIconNames[id],
        group: id.startsWith("u") ? "ui" : kind,
        groupLabel: id.startsWith("u") ? "Standard icons" : (KIND_LABELS[kind] ?? kind),
        brief: id.startsWith("u")
          ? "Standard UI icon as a game object: a 3D render in the item camera with form shading, 36 x 32 canvas, #000001 outline. Shown in an item slot."
          : (KIND_BRIEF[kind] ?? ""),
        changed: CHANGES[id],
        pinRender: (scale: number) => {
          const Icon = pixelIcons[id];
          return <Icon scale={scale} />;
        },
        render: () => (
          <div className="icon-stage">
            <Scales Icon={pixelIcons[id]} />
            <Context id={id} kind={kind} />
          </div>
        ),
      };
    })}
  />,
);
