// Open Graph (social share) image concepts for the docs site, each a 1200 x 630 card drawn with the
// library's own components. To regenerate a PNG: mount <OgImage n={1..5} /> on a page served by the
// dev server, open it at a 1200 x 630 viewport and screenshot the element `#og-<n>` (headless
// Chrome via playwright-core). Everything is drawn at whole-number scales (--osrs-px: 2px, text at
// multiples of 16px) so the pixel art stays crisp.
import * as React from "react";

import { Button } from "@/registry/osrs/ui/button";
import { Card, CardContent, CardHeader } from "@/registry/osrs/ui/card";
import { NpcDialogue } from "@/registry/osrs/ui/chatbox";
import { ItemSlot } from "@/registry/osrs/ui/item-slot";
import { Orb } from "@/registry/osrs/ui/orb";
import { PrayerButton } from "@/registry/osrs/ui/prayer-button";
import { Progress } from "@/registry/osrs/ui/progress";
import { SkillTile, TotalLevelTile } from "@/registry/osrs/ui/skill-tile";
import { Window, WindowBody, WindowClose, WindowHeader } from "@/registry/osrs/ui/window";
import { XpDrop } from "@/registry/osrs/ui/xp-drop";
import { geSprites } from "@/registry/osrs/ui/ge-sprites";
import { normalSpellSprites } from "@/registry/osrs/ui/spell-normal-sprites";
import { prayerSprites } from "@/registry/osrs/ui/prayer-sprites";
import { skillIcons } from "@/registry/osrs/ui/skill-icons";
import type { SpriteComponent } from "@/registry/osrs/lib/sprite";
import { HansChathead } from "../demo-data/chatheads";
import { items, type ItemId } from "../demo-data/items";
import { LogoMark } from "../Logo";
import { colourAt, offsetAt } from "../HeroVariants";
import { cx } from "../styles";
import { SITE_HOST } from "../site-url";

export const OG_TITLE = "OSRS UI";
export const OG_TAGLINE = "Old School RuneScape components for shadcn/ui";
export const OG_URL = SITE_HOST;

/** The 1200 x 630 card: the game's stone (its tile at 2x under the site's tint), text in the game's
 *  fonts with a drop shadow one game pixel deep. */
const card =
  "relative isolate h-[630px] w-[1200px] shrink-0 overflow-hidden bg-rs-stone bg-[image:linear-gradient(rgb(0_0_0/0.14),rgb(0_0_0/0.14)),var(--osrs-texture-stone)] bg-[size:auto,176px_120px] bg-repeat font-rs text-rs-orange [--osrs-px:2px] [-webkit-font-smoothing:none] [font-synthesis:none] [image-rendering:pixelated]";

/** The site's iron rivet frame round the card, at 2x. */
function RivetFrame() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-50 border-[60px_50px] border-solid border-transparent [border-image:var(--osrs-frame-iron-rivets)_30_25_30_25/60px_50px/0_repeat]"
    />
  );
}

/** Text shadows one game pixel deep, for text set at 2x, 3x, 4x and 6x. */
const shadow = {
  2: "[text-shadow:2px_2px_0_#000]",
  3: "[text-shadow:3px_3px_0_#000]",
  4: "[text-shadow:4px_4px_0_#000]",
  6: "[text-shadow:6px_6px_0_#000]",
} as const;

// ------------------------------------------------------------------------------------------------
// 1. The mark, big, on the stone inside the rivet frame, with the tagline.

function Og1() {
  return (
    <div id="og-1" className={cx(card, "flex flex-col items-center pt-[80px]")}>
      <RivetFrame />
      <LogoMark scale={5} className="drop-shadow-[0_8px_0_rgb(0_0_0/0.35)]" />
      <p className={cx("m-0 mt-6 text-[48px] leading-[52px] text-rs-orange", shadow[3])}>{OG_TAGLINE}</p>
      <p className={cx("m-0 mt-2 text-[32px] leading-[40px] text-rs-yellow", shadow[2])}>{OG_URL}</p>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------
// 2. The headline on the left, a collage of real components on the right.

function Og2() {
  return (
    <div id="og-2" className={cx(card, "flex items-center")}>
      <RivetFrame />
      <div className="relative z-10 flex w-[560px] flex-col items-start pl-[86px]">
        <LogoMark scale={2} />
        <h1 className={cx("m-0 mt-6 font-rs-bold text-[96px] leading-[96px] font-normal text-rs-white", shadow[6])}>{OG_TITLE}</h1>
        <p className={cx("m-0 mt-5 text-[48px] leading-[52px] text-rs-orange", shadow[3])}>
          Old School RuneScape components for shadcn/ui
        </p>
        <p className={cx("m-0 mt-6 text-[32px] leading-[40px] text-rs-yellow", shadow[2])}>{OG_URL}</p>
      </div>
      <div className="relative z-10 ml-auto mr-[74px] flex h-full flex-col items-end justify-center">
        <div className="relative">
          <Window className="w-[456px]">
            <WindowHeader end={<WindowClose tooltip={false} />}>Skills</WindowHeader>
            <WindowBody className="flex-col gap-[6px] p-[10px]">
              <div className="grid grid-cols-3 gap-[4px] bg-black/20 p-[4px]">
                <SkillTile skill="attack" level={99} />
                <SkillTile skill="strength" level={99} boosted={118} />
                <SkillTile skill="magic" level={94} />
                <SkillTile skill="prayer" level={77} />
                <SkillTile skill="sailing" level={40} selected />
                <TotalLevelTile total={2277} />
              </div>
              <div className="flex items-center gap-[8px]">
                <PrayerButton prayer="protectFromMelee" defaultPressed className="shrink-0" />
                <PrayerButton prayer="piety" defaultPressed className="shrink-0" />
                <PrayerButton prayer="rigour" className="shrink-0" />
                <Button size="sm" tone="white" className="ml-auto">
                  Install
                </Button>
              </div>
            </WindowBody>
          </Window>
          <div className="absolute -top-[22px] -left-[78px] flex flex-col gap-[8px]">
            <Orb kind="hitpoints" value={84} max={99} />
            <Orb kind="prayer" value={61} max={77} active />
            <Orb kind="run" value={100} />
          </div>
          <div className="absolute -bottom-[48px] -left-[36px]">
            <XpDrop skills={["ranged", "hitpoints"]} amount={1248} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------
// 3. A wall of sprites from across the sets, with the mark over it.

const WALL_CELL = 72; // 36 game pixels at 2x
const WALL_COLS = Math.ceil(1200 / WALL_CELL);
const WALL_ROWS = Math.ceil(630 / WALL_CELL);

/** Every sprite that fits a 32 x 32 cell from the skill icons, items, prayers and standard spells,
 *  interleaved and shuffled with a fixed seed, so the wall mixes the sets but never changes. */
export function wallSprites(): SpriteComponent[] {
  const fits = (s: unknown): s is SpriteComponent =>
    typeof s === "object" && s !== null && "spriteWidth" in s && (s as SpriteComponent).spriteWidth <= 32 && (s as SpriteComponent).spriteHeight <= 32;
  const sets: SpriteComponent[][] = [
    Object.entries(skillIcons).filter(([k]) => k !== "total").map(([, v]) => v),
    Object.values(items).map((i) => i.Icon),
    Object.entries(prayerSprites).filter(([k]) => !/Disabled|activated|iconSmall/.test(k)).map(([, v]) => v),
    Object.entries(normalSpellSprites).filter(([k]) => !/Disabled|disabled/.test(k)).map(([, v]) => v),
  ].map((set) => set.filter(fits));
  const pool: SpriteComponent[] = [];
  for (let i = 0; pool.length < 400 && sets.some((s) => s.length > i); i++) for (const s of sets) if (s[i]) pool.push(s[i]);
  let seed = 11;
  for (let i = pool.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

function Og3() {
  const pool = wallSprites();
  const cells = Array.from({ length: WALL_COLS * WALL_ROWS }, (_, i) => pool[i % pool.length]);
  return (
    <div id="og-3" className={cx(card, "bg-rs-stone-dark")}>
      <div className="absolute -top-[9px] -left-[24px] grid grid-cols-[repeat(17,72px)] grid-rows-[repeat(9,72px)]">
        {cells.map((Sprite, i) => (
          <div key={i} className="flex items-center justify-center">
            <Sprite />
          </div>
        ))}
      </div>
      {/* darken the wall towards the middle so the mark reads over it */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_560px_290px_at_50%_52%,rgb(20_16_10/0.95)_0%,rgb(20_16_10/0.9)_60%,rgb(20_16_10/0.25)_100%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <LogoMark scale={4} className="drop-shadow-[0_8px_0_rgb(0_0_0/0.5)]" />
        <p className={cx("m-0 mt-6 text-[48px] leading-[52px] text-rs-white", shadow[3])}>{OG_TAGLINE}</p>
        <p className={cx("m-0 mt-2 text-[32px] leading-[40px] text-rs-yellow", shadow[2])}>{OG_URL}</p>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------
// 4. Hans, in the game's NPC dialogue, pitching the library.

function Og4() {
  return (
    <div id="og-4" className={cx(card, "flex flex-col items-center")}>
      <RivetFrame />
      <div className="mt-[72px] flex w-[580px] items-center gap-10">
        <LogoMark scale={2} />
        <div className="flex flex-col">
          <h1 className={cx("m-0 font-rs-bold text-[96px] leading-[96px] font-normal text-rs-white", shadow[6])}>{OG_TITLE}</h1>
          <p className={cx("m-0 mt-2 text-[32px] leading-[40px] text-rs-yellow", shadow[2])}>{OG_URL}</p>
        </div>
      </div>
      <NpcDialogue
        name="Hans"
        head={<HansChathead />}
        continueLabel="Click here to continue"
        className="mt-auto mb-[78px]"
      >
        <span>
          Old School RuneScape components
          <br />
          for shadcn/ui, traced pixel for pixel.
        </span>
      </NpcDialogue>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------
// 5. A Grand Exchange window that holds the title, its offers the library's components.

type Offer = { name: string; Icon: SpriteComponent; qty?: number };
const OFFERS: Offer[] = [
  { name: "Window", Icon: items["rune-platebody"].Icon },
  { name: "Button", Icon: items["dragon-scimitar"].Icon },
  { name: "Skill icons", Icon: skillIcons.magic, qty: 24 },
  { name: "Chatbox", Icon: items["clue-scroll-elite"].Icon },
];

function Og5() {
  return (
    <div id="og-5" className={cx(card, "flex items-center justify-center bg-rs-stone-dark")}>
      <Window frame="tan" className="h-[566px] w-[1136px]">
        <WindowHeader
          start={
            <Button variant="metal" tone="white" size="sm">
              Docs
            </Button>
          }
          end={<WindowClose tooltip={false} />}
        >
          Grand Exchange
        </WindowHeader>
        <div className="flex flex-1 flex-col items-center justify-center pb-2">
          <h1 className={cx("m-0 w-[272px] font-rs-bold text-[96px] leading-[96px] font-normal whitespace-nowrap text-rs-orange", shadow[6])}>{OG_TITLE}</h1>
          <p className={cx("m-0 mt-4 w-[832px] text-[48px] leading-[52px] whitespace-nowrap text-rs-white", shadow[3])}>{OG_TAGLINE}</p>
        </div>
        <div className="grid grid-cols-4 gap-[8px]">
          {OFFERS.map(({ name, Icon, qty }) => {
            return (
              <Card key={name} variant="offer" className="h-[208px]">
                <CardHeader>Buy</CardHeader>
                <CardContent className="gap-[8px] px-[6px]">
                  <div className="flex items-start gap-[6px]">
                    <div className="relative shrink-0">
                      <geSprites.selectedItemBox />
                      <ItemSlot quantity={qty} className="absolute top-[4px] left-[4px]">
                        <Icon />
                      </ItemSlot>
                    </div>
                    <span className="text-rs-orange">{name}</span>
                  </div>
                  <Progress value={100} color="green" flat />
                  <span className="text-center text-rs-orange">Free</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Window>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------
// Second round, after 1 and 3: the mark on the stone, with sprites around or behind it.

/** A grid of `count` sprites; the caller's classes place it and set its columns and rows. Keep each
 *  cell minus its sprite's size even, so every sprite lands on a whole pixel. */
function SpriteWall({ sprites, count, className }: { sprites: SpriteComponent[]; count: number; className: string }) {
  return (
    <div className={cx("absolute grid", className)}>
      {Array.from({ length: count }, (_, i) => {
        const Sprite = sprites[i % sprites.length];
        return (
          <div key={i} className="flex items-center justify-center">
            <Sprite />
          </div>
        );
      })}
    </div>
  );
}

/** The mark, tagline and URL, stacked and centred (concepts 6, 7 and 9). */
function CentredMark({ scale, tagline = "text-rs-orange" }: { scale: number; tagline?: string }) {
  return (
    <>
      <LogoMark scale={scale} className="drop-shadow-[0_8px_0_rgb(0_0_0/0.45)]" />
      <p className={cx("m-0 mt-6 text-[48px] leading-[52px]", tagline, shadow[3])}>{OG_TAGLINE}</p>
      <p className={cx("m-0 mt-2 text-[32px] leading-[40px] text-rs-yellow", shadow[2])}>{OG_URL}</p>
    </>
  );
}

// 6. Concept 1, with the sprite wall faintly round the edges, fading in from the frame.
function Og6() {
  return (
    <div id="og-6" className={cx(card, "flex flex-col items-center pt-[80px]")}>
      <SpriteWall
        sprites={wallSprites()}
        count={17 * 9}
        className="top-[-9px] left-[-12px] grid-cols-[repeat(17,72px)] grid-rows-[repeat(9,72px)] opacity-45 [mask-image:radial-gradient(ellipse_660px_360px_at_50%_50%,transparent_72%,black_100%)]"
      />
      <RivetFrame />
      <div className="relative z-10 flex flex-col items-center">
        <CentredMark scale={5} />
      </div>
    </div>
  );
}

// 7. Concept 3 with one set: every skill icon, in order, in a tidy grid at 4x; a darker vignette.
function Og7() {
  const skills = Object.entries(skillIcons).filter(([k]) => k !== "total").map(([, v]) => v);
  return (
    <div id="og-7" className={cx(card, "flex flex-col items-center justify-center bg-rs-stone-dark")}>
      <SpriteWall sprites={skills} count={10 * 5} className="top-[-5px] left-[-40px] grid-cols-[repeat(10,128px)] grid-rows-[repeat(5,128px)] [--osrs-px:4px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_580px_300px_at_50%_52%,rgb(14_11_7/0.97)_0%,rgb(14_11_7/0.93)_60%,rgb(14_11_7/0.45)_100%)]" />
      <div className="relative flex flex-col items-center pt-[4px]">
        <CentredMark scale={4} tagline="text-rs-white" />
      </div>
    </div>
  );
}

// 8. Concept 1 with the mark at 4x and the tagline as overhead chat, "wave:" in yellow, frozen
//    mid-wave; the URL glows ("glow1:"), caught part way through its ramp.
function ChatLine({ text, effect, colour, t, unit, className }: { text: string; effect: "wave" | "wave2"; colour: string; t: number; unit: number; className?: string }) {
  return (
    <p className={cx("m-0 flex text-(--c)", className)} style={{ ["--c" as string]: colour }}>
      {[...text].map((ch, i) => {
        const [dx, dy] = offsetAt(effect, i, text.length, t);
        return (
          <span key={i} className="inline-block translate-x-(--dx) translate-y-(--dy) whitespace-pre" style={{ ["--dx" as string]: `${dx * unit}px`, ["--dy" as string]: `${dy * unit}px` }}>
            {ch}
          </span>
        );
      })}
    </p>
  );
}

function Og8() {
  return (
    <div id="og-8" className={cx(card, "flex flex-col items-center pt-[96px]")}>
      <RivetFrame />
      <LogoMark scale={4} className="drop-shadow-[0_8px_0_rgb(0_0_0/0.35)]" />
      <ChatLine text={OG_TAGLINE} effect="wave" colour="var(--osrs-yellow)" t={7} unit={3} className={cx("mt-10 text-[48px] leading-[52px]", shadow[3])} />
      <ChatLine text={OG_URL} effect="wave" colour={colourAt("glow1", 130)} t={19} unit={2} className={cx("mt-5 text-[32px] leading-[40px]", shadow[2])} />
    </div>
  );
}

// 9. Concept 3 with the wall as a bank: items with their stack counts in bank-spaced slots.
export const BANK: [ItemId, number][] = [
  ["coins-10000", 38_900_000], ["abyssal-whip", 1], ["twisted-bow", 1], ["toxic-blowpipe", 1], ["dragon-scimitar", 1],
  ["rune-platebody", 3], ["dragon-defender", 1], ["fire-cape", 1], ["barrows-gloves", 1], ["dragon-boots", 1],
  ["shark", 1_840], ["anglerfish", 612], ["cooked-karambwan", 2_270], ["lobster", 5_120], ["raw-shark", 340],
  ["prayer-potion-4", 412], ["super-combat-potion-4", 96], ["saradomin-brew-4", 230], ["super-restore-4", 318],
  ["stamina-potion-4", 77], ["nature-rune", 24_400], ["law-rune", 8_150], ["blood-rune", 210_000],
  ["death-rune", 64_300], ["fire-rune", 1_200_000], ["air-rune", 12_480_000], ["water-rune", 96_000],
  ["logs", 3_120], ["oak-logs", 2_400], ["willow-logs", 1_870], ["yew-logs", 15_600], ["magic-logs", 4_210],
  ["iron-ore", 920], ["coal", 13_500], ["gold-bar", 840], ["bronze-bar", 12], ["uncut-diamond", 64],
  ["bones", 300], ["dragon-bones", 2_410], ["rune-pickaxe", 1], ["dragon-axe", 1], ["hammer", 1], ["knife", 1],
  ["grimy-ranarr-weed", 156], ["ranarr-weed", 88], ["snapdragon", 41], ["torstol", 27], ["supercompost", 500],
  ["clue-scroll-elite", 1], ["spade", 1], ["tinderbox", 1], ["fighter-torso", 1], ["dragon-platelegs", 1],
];

function Og9() {
  const cols = 13;
  const rows = 9;
  return (
    <div id="og-9" className={cx(card, "flex flex-col items-center justify-center")}>
      {/* the bank's spacing: 36 x 32 slots, 12 apart across and 4 down (at 2x) */}
      <div className="absolute top-[-11px] left-[-12px] grid grid-cols-[repeat(13,72px)] gap-x-[24px] gap-y-[8px]">
        {Array.from({ length: cols * rows }, (_, i) => {
          const [id, q] = BANK[(i * 7) % BANK.length];
          const { Icon } = items[id];
          return (
            <ItemSlot key={i} quantity={q}>
              <Icon />
            </ItemSlot>
          );
        })}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_580px_300px_at_50%_52%,rgb(20_16_10/0.96)_0%,rgb(20_16_10/0.9)_60%,rgb(20_16_10/0.3)_100%)]" />
      <div className="relative flex flex-col items-center">
        <CentredMark scale={4} tagline="text-rs-white" />
      </div>
    </div>
  );
}

// 10. Concept 1 with the mark to the left, the tagline under it, and a few sprites large on the right.
function Og10() {
  return (
    <div id="og-10" className={card}>
      <RivetFrame />
      <div className="absolute top-[100px] left-[96px] flex flex-col items-start">
        <LogoMark scale={4} className="drop-shadow-[0_8px_0_rgb(0_0_0/0.35)]" />
        <p className={cx("m-0 mt-6 ml-[12px] w-[560px] text-[48px] leading-[52px] text-rs-orange", shadow[3])}>
          Old School RuneScape components for shadcn/ui
        </p>
        <p className={cx("m-0 mt-4 ml-[12px] text-[32px] leading-[40px] text-rs-yellow", shadow[2])}>{OG_URL}</p>
      </div>
      <div className="absolute top-[96px] left-[860px] drop-shadow-[0_8px_0_rgb(0_0_0/0.35)]">
        <skillIcons.attack scale={6} />
      </div>
      <div className="absolute top-[372px] left-[946px] drop-shadow-[0_8px_0_rgb(0_0_0/0.35)]">
        <prayerSprites.piety scale={5} />
      </div>
      <div className="absolute top-[324px] left-[756px] drop-shadow-[0_8px_0_rgb(0_0_0/0.35)]">
        <skillIcons.magic scale={5} />
      </div>
    </div>
  );
}

const OGS = [Og1, Og2, Og3, Og4, Og5, Og6, Og7, Og8, Og9, Og10];

/** One concept, by number (1-10). */
export function OgImage({ n }: { n: number }) {
  const C = OGS[n - 1];
  return C ? <C /> : null;
}

/** All five, stacked, for screenshotting. */
export default function OgImages() {
  return (
    <div className="flex flex-col items-start gap-10">
      {OGS.map((C, i) => (
        <C key={i} />
      ))}
    </div>
  );
}
