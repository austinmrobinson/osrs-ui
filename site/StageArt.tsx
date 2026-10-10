"use client";

// The homepage contents cards' stages, takes 9-13 (?art=9..13): drawn live with the library's own
// components, the way the share cards are (site/og/OgImages.tsx): walls of real sprites and slots,
// dark vignettes, real windows and controls at whole-number scales. Each scene is a fixed 360 x 240
// box that the stage clips.
import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { Card, CardContent, CardHeader } from "@/registry/osrs/ui/card";
import { NpcDialogue } from "@/registry/osrs/ui/chatbox";
import { Checkbox } from "@/registry/osrs/ui/checkbox";
import { ItemSlot } from "@/registry/osrs/ui/item-slot";
import { Orb } from "@/registry/osrs/ui/orb";
import { PrayerButton } from "@/registry/osrs/ui/prayer-button";
import { Progress } from "@/registry/osrs/ui/progress";
import { SkillTile, TotalLevelTile } from "@/registry/osrs/ui/skill-tile";
import { Window, WindowBody, WindowClose, WindowHeader } from "@/registry/osrs/ui/window";
import { XpDrop } from "@/registry/osrs/ui/xp-drop";
import { geSprites } from "@/registry/osrs/ui/ge-sprites";
import { prayerSprites } from "@/registry/osrs/ui/prayer-sprites";
import { skillIcons } from "@/registry/osrs/ui/skill-icons";
import type { SpriteComponent } from "@/registry/osrs/lib/sprite";
import { HansChathead } from "./demo-data/chatheads";
import { items } from "./demo-data/items";
import { BANK, wallSprites } from "./og/OgImages";
import { cx } from "./styles";

type Section = "components" | "recipes" | "assets";

/** The fixed scene box, clipped by the stage. */
const scene = "relative block h-[240px] w-[360px] shrink-0 overflow-hidden";
/** Darken towards the middle so the hero piece reads over the wall. */
const vignette =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_150px_95px_at_50%_50%,rgb(20_16_10/0.94)_0%,rgb(20_16_10/0.85)_55%,rgb(20_16_10/0.2)_100%)]";
/** Show the wall only round the edges, fading in from the stage's rim. */
const edges = "opacity-50 [mask-image:radial-gradient(ellipse_190px_130px_at_50%_50%,transparent_65%,black_100%)]";
const centre = "absolute inset-0 flex items-center justify-center";
const lift = "drop-shadow-[0_6px_0_rgb(0_0_0/0.4)]";

const SKILLS = Object.entries(skillIcons)
  .filter(([k]) => k !== "total")
  .map(([, v]) => v);

/** A grid of sprites, `count` cells, placed and sized by the caller's classes. */
function Wall({ sprites, count, className }: { sprites: SpriteComponent[]; count: number; className: string }) {
  return (
    <span aria-hidden="true" className={cx("absolute grid", className)}>
      {Array.from({ length: count }, (_, i) => {
        const S = sprites[i % sprites.length];
        return (
          <span key={i} className="flex items-center justify-center">
            <S />
          </span>
        );
      })}
    </span>
  );
}

/** The bank: items with their stack counts in bank-spaced slots. */
function BankWall({ count, className }: { count: number; className: string }) {
  return (
    <span aria-hidden="true" className={cx("absolute grid gap-x-3 gap-y-1", className)}>
      {Array.from({ length: count }, (_, i) => {
        const [id, q] = BANK[(i * 7) % BANK.length];
        const { Icon } = items[id];
        return (
          <ItemSlot key={i} quantity={q}>
            <Icon />
          </ItemSlot>
        );
      })}
    </span>
  );
}

/** A wall of skill tiles, the components' own wallpaper. */
function TileWall({ count, className }: { count: number; className: string }) {
  const skills = Object.keys(skillIcons).filter((k) => k !== "total") as React.ComponentProps<typeof SkillTile>["skill"][];
  return (
    <span aria-hidden="true" className={cx("absolute grid gap-1", className)}>
      {Array.from({ length: count }, (_, i) => (
        <SkillTile key={i} skill={skills[(i * 5) % skills.length]} level={99 - ((i * 13) % 40)} />
      ))}
    </span>
  );
}

/** A Grand Exchange offer, as on the share card. */
function Offer({ name, Icon, className }: { name: string; Icon: SpriteComponent; className?: string }) {
  return (
    <Card variant="offer" className={cx("w-[150px]", className)}>
      <CardHeader>Buy</CardHeader>
      <CardContent className="gap-1 px-[3px]">
        <span className="flex items-start gap-[3px]">
          <span className="relative shrink-0">
            <geSprites.selectedItemBox />
            <ItemSlot className="absolute top-[2px] left-[2px]">
              <Icon />
            </ItemSlot>
          </span>
          <span className="text-rs-orange">{name}</span>
        </span>
        <Progress value={100} color="green" flat />
        <span className="text-center text-rs-orange">Free</span>
      </CardContent>
    </Card>
  );
}

/** The Skills window from the share card, at 1x. */
function SkillsWindow({ className }: { className?: string }) {
  return (
    <Window className={cx("w-[228px]", className)}>
      <WindowHeader end={<WindowClose tooltip={false} />}>Skills</WindowHeader>
      <WindowBody className="flex-col gap-[3px] p-[5px]">
        <span className="grid grid-cols-3 gap-[2px] bg-black/20 p-[2px]">
          <SkillTile skill="attack" level={99} />
          <SkillTile skill="strength" level={99} boosted={118} />
          <SkillTile skill="magic" level={94} />
          <SkillTile skill="prayer" level={77} />
          <SkillTile skill="sailing" level={40} selected />
          <TotalLevelTile total={2277} />
        </span>
      </WindowBody>
    </Window>
  );
}

const BUTTON_LABELS = ["Yes", "No", "Accept", "Decline", "Deposit", "Withdraw", "Confirm", "Cancel", "Bank", "Trade"];
const BUTTON_STYLES = [
  { variant: "metal", tone: "default" },
  { variant: "metal", tone: "white" },
  { variant: "tile", tone: "default" },
  { variant: "stone", tone: "default" },
  { variant: "tile", tone: "white" },
] as const;

/** A wall of small buttons in every style, the game's own words on them. */
function ButtonWall({ className }: { className: string }) {
  return (
    <span aria-hidden="true" className={cx("absolute grid grid-cols-[repeat(5,76px)] gap-1.5", className)}>
      {Array.from({ length: 5 * 9 }, (_, i) => {
        const st = BUTTON_STYLES[(i * 3) % BUTTON_STYLES.length];
        return (
          <Button key={i} size="sm" variant={st.variant} tone={st.tone} tabIndex={-1} className="w-full">
            {BUTTON_LABELS[(i * 7) % BUTTON_LABELS.length]}
          </Button>
        );
      })}
    </span>
  );
}

/** A wall of small controls: checkboxes, prayers, orbs and buttons, in a fixed rhythm. */
function ControlWall({ className }: { className: string }) {
  const prayers = ["piety", "rigour", "augury", "protectFromMelee", "protectFromMagic"] as const;
  const cell = (i: number) => {
    switch (i % 4) {
      case 0:
        return <Checkbox defaultChecked={i % 3 !== 0} aria-hidden tabIndex={-1} />;
      case 1:
        return <PrayerButton prayer={prayers[i % prayers.length]} defaultPressed={i % 2 === 0} tabIndex={-1} />;
      case 2:
        return <Orb kind={(["hitpoints", "prayer", "run"] as const)[i % 3]} value={60 + (i % 40)} max={99} />;
      default:
        return (
          <Button size="sm" tabIndex={-1}>
            {BUTTON_LABELS[i % BUTTON_LABELS.length]}
          </Button>
        );
    }
  };
  return (
    <span aria-hidden="true" className={cx("absolute grid grid-cols-[repeat(6,64px)] auto-rows-[44px] place-items-center", className)}>
      {Array.from({ length: 6 * 7 }, (_, i) => (
        <span key={i} className="flex items-center justify-center">
          {cell(i + Math.floor(i / 6))}
        </span>
      ))}
    </span>
  );
}

/**
 * The Components card: one button at 2x. Behind it (?bg=):
 *   1  nothing, the plain dark well (default)
 *   2  skill tiles, faint round the edges
 *   3  small buttons in every style, faint round the edges
 *   4  mixed small controls (checkboxes, prayers, orbs, buttons), faint round the edges
 *   5  small buttons in every style under a dark vignette
 */
/** The lone button's label (?label=1..5): words the game's own buttons say. */
const LONE_LABELS = ["Accept", "Click here", "Deposit inventory", "Wield", "Confirm"];

function LoneButton() {
  const [bg, setBg] = React.useState(1);
  const [label, setLabel] = React.useState(0);
  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const n = Number(q.get("bg"));
    if (n >= 1 && n <= 5) setBg(n);
    const l = Number(q.get("label"));
    if (l >= 1 && l <= LONE_LABELS.length) setLabel(l - 1);
  }, []);
  return (
    <span className={scene}>
      {bg === 2 ? <TileWall count={6 * 8} className={cx("top-[-6px] left-[-14px] grid-cols-[repeat(6,62px)]", edges)} /> : null}
      {bg === 3 ? <ButtonWall className={cx("top-[-8px] left-[-22px]", edges)} /> : null}
      {bg === 4 ? <ControlWall className={cx("top-[-8px] left-[-12px]", edges)} /> : null}
      {bg === 5 ? (
        <>
          <ButtonWall className="top-[-8px] left-[-22px]" />
          <span className={vignette} />
        </>
      ) : null}
      {/* no drop shadow: the button's own frame already carries its bevel */}
      <span className={cx(centre, "[--osrs-px:2px]")}>
        <Button tabIndex={-1}>{LONE_LABELS[label]}</Button>
      </span>
    </span>
  );
}

/**
 * 9   walls under a vignette, one piece large in the middle: skill tiles and a 2x hitpoints orb; the
 *     bank and a Grand Exchange offer; the sprite wall and Attack at 4x
 * 10  one crisp piece with its wall faint round the edges: the Skills window; Hans in the chatbox;
 *     three sprites at 3x
 * 11  a collage: the Skills window with orbs and an XP drop; two offers in a Grand Exchange window;
 *     every skill icon in a tidy 2x grid
 * 12  one thing large: the orbs at 2x; a bank tab at 2x bleeding off the stage; Piety at 5x
 * 13  the walls tilted and bleeding off every edge, no vignette
 * 14  the pick: a lone button at 2x; (recipes: the bank screenshot); take 10's three sprites
 */
export function StageArt({ section, take }: { section: Section; take: number }) {
  if (take === 9) {
    if (section === "components")
      return (
        <span className={scene}>
          <TileWall count={6 * 8} className="top-[-6px] left-[-14px] grid-cols-[repeat(6,62px)]" />
          <span className={vignette} />
          <span className={cx(centre, "[--osrs-px:2px]", lift)}>
            <Orb kind="hitpoints" value={84} max={99} />
          </span>
        </span>
      );
    if (section === "recipes")
      return (
        <span className={scene}>
          <BankWall count={8 * 8} className="top-[-10px] left-[-16px] grid-cols-[repeat(8,36px)]" />
          <span className={vignette} />
          <span className={cx(centre, lift)}>
            <Offer name="Bank" Icon={items["coins-10000"].Icon} />
          </span>
        </span>
      );
    return (
      <span className={scene}>
        <Wall sprites={wallSprites()} count={11 * 8} className="top-[-6px] left-[-18px] grid-cols-[repeat(11,36px)] grid-rows-[repeat(8,36px)]" />
        <span className={vignette} />
        <span className={cx(centre, lift)}>
          <skillIcons.attack scale={4} />
        </span>
      </span>
    );
  }
  if (take === 10) {
    if (section === "components")
      return (
        <span className={scene}>
          <TileWall count={6 * 8} className={cx("top-[-6px] left-[-14px] grid-cols-[repeat(6,62px)]", edges)} />
          <span className={cx(centre, lift)}>
            <SkillsWindow />
          </span>
        </span>
      );
    if (section === "recipes")
      return (
        <span className={scene}>
          <BankWall count={8 * 8} className={cx("top-[-10px] left-[-16px] grid-cols-[repeat(8,36px)]", edges)} />
          <span className={cx(centre, "px-4", lift)}>
            <NpcDialogue size="fit" name="Hans" head={<HansChathead />} style={{ minHeight: 120 }}>
              Whole screens, ready to copy.
            </NpcDialogue>
          </span>
        </span>
      );
    return (
      <span className={scene}>
        <Wall sprites={wallSprites()} count={11 * 8} className={cx("top-[-6px] left-[-18px] grid-cols-[repeat(11,36px)] grid-rows-[repeat(8,36px)]", edges)} />
        <span className={cx(centre, "gap-3", lift)}>
          <skillIcons.magic scale={3} />
          <prayerSprites.piety scale={3} />
          <skillIcons.sailing scale={3} />
        </span>
      </span>
    );
  }
  if (take === 11) {
    if (section === "components")
      return (
        <span className={scene}>
          <span className="absolute top-[42px] left-[86px]">
            <SkillsWindow />
          </span>
          <span className="absolute top-[30px] left-[34px] flex flex-col gap-1">
            <Orb kind="hitpoints" value={84} max={99} />
            <Orb kind="prayer" value={61} max={77} active />
            <Orb kind="run" value={100} />
          </span>
          <span className="absolute top-[170px] left-[64px] flex items-center gap-2">
            <XpDrop skills={["ranged", "hitpoints"]} amount={1248} />
            <Checkbox defaultChecked aria-label="Example" />
            <PrayerButton prayer="piety" defaultPressed />
          </span>
        </span>
      );
    if (section === "recipes")
      return (
        <span className={cx(scene, "flex items-center justify-center")}>
          <Window frame="tan" className="w-[334px]">
            <WindowHeader start={<Button variant="metal" tone="white" size="sm">Docs</Button>} end={<WindowClose tooltip={false} />}>
              Grand Exchange
            </WindowHeader>
            <WindowBody className="gap-[4px] p-[4px]">
              <Offer name="Bank" Icon={items["coins-10000"].Icon} />
              <Offer name="Settings" Icon={items["rune-pickaxe"].Icon} />
            </WindowBody>
          </Window>
        </span>
      );
    return (
      <span className={cx(scene, "flex items-center justify-center")}>
        <Wall sprites={SKILLS} count={24} className="relative grid-cols-[repeat(6,52px)] grid-rows-[repeat(4,52px)] [--osrs-px:2px]" />
      </span>
    );
  }
  if (take === 12) {
    if (section === "components")
      return (
        <span className={cx(scene, "flex items-center justify-center gap-3 [--osrs-px:2px]", lift)}>
          <Orb kind="hitpoints" value={84} max={99} />
          <Orb kind="prayer" value={61} max={77} active />
        </span>
      );
    if (section === "recipes")
      return (
        <span className={scene}>
          <BankWall count={6 * 4} className="top-[24px] left-[20px] grid-cols-[repeat(6,36px)] gap-x-6 gap-y-2 [--osrs-px:2px]" />
        </span>
      );
    return (
      <span className={cx(scene, "flex items-center justify-center", lift)}>
        <prayerSprites.piety scale={5} />
      </span>
    );
  }
  if (take === 14) {
    // the chosen set: a lone button and the three sprites; recipes keep the bank screenshot
    // (stageArt take 1). What's behind the button: ?bg=1..5 (see LoneButton)
    if (section === "components") return <LoneButton />;
    // five sprites at 2x on the plain well: three across, two centred under them
    return (
      <span className={cx(scene, "flex flex-col items-center justify-center gap-1")}>
        <span className="flex items-center gap-3">
          <skillIcons.magic scale={2} />
          <prayerSprites.piety scale={2} />
          <skillIcons.sailing scale={2} />
        </span>
        <span className="flex items-center gap-3">
          <skillIcons.attack scale={2} />
          <skillIcons.hitpoints scale={2} />
        </span>
      </span>
    );
  }
  // 13: tilted, bleeding walls
  const tilt = "-rotate-8 scale-110";
  if (section === "components")
    return (
      <span className={scene}>
        <TileWall count={7 * 9} className={cx("top-[-40px] left-[-50px] grid-cols-[repeat(7,62px)]", tilt)} />
      </span>
    );
  if (section === "recipes")
    return (
      <span className={scene}>
        <BankWall count={10 * 9} className={cx("top-[-40px] left-[-50px] grid-cols-[repeat(10,36px)]", tilt)} />
      </span>
    );
  return (
    <span className={scene}>
      <Wall sprites={wallSprites()} count={13 * 10} className={cx("top-[-40px] left-[-50px] grid-cols-[repeat(13,36px)] grid-rows-[repeat(10,36px)]", tilt)} />
    </span>
  );
}
