import * as React from "react";
import { createPortal } from "react-dom";
import { zipSync, strToU8 } from "fflate";

import { cx, stone } from "./styles";
import { SearchField } from "@/registry/osrs/ui/search-field";
import { composeFrame, composeTexture, download, scaleSvg, svgSize, toPng, type Asset } from "./compose";
import { Button } from "@/registry/osrs/ui/button";
import { Card } from "@/registry/osrs/ui/card";
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/registry/osrs/ui/field";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/registry/osrs/ui/dropdown-menu";
import { Input } from "@/registry/osrs/ui/input";
import { Separator } from "@/registry/osrs/ui/separator";
import { SplitButton } from "@/registry/osrs/ui/split-button";
import { NumberField } from "@/registry/osrs/ui/number-field";
import { Select as OsrsSelect, SelectContent, SelectItem, SelectTrigger } from "@/registry/osrs/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";
import { Dialog, DialogContent } from "@/registry/osrs/ui/dialog";
import { chevronSprites } from "@/registry/osrs/ui/chevron-sprites";

const GROUP_LABELS: Record<string, string> = {
  skill: "Skills", frame: "Frames", texture: "Textures", control: "Controls", prayer: "Prayers", orb: "Orbs",
  equipment: "Equipment", stats: "Stats", combat: "Combat", bank: "Bank", tab: "Tabs", icon: "Icons",
  chatbox: "Chatbox", option: "Options", panel: "Panel", ge: "GE", chevron: "Chevrons", glyph: "Glyphs",
  "spell-normal": "Standard spells", "spell-ancient": "Ancient spells", "spell-lunar": "Lunar spells", "spell-arceuus": "Arceuus spells",
  emote: "Emotes", minigame: "Minigames", sailing: "Sailing",
};

const SCALES = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40];
const BACKGROUNDS = [
  { id: "transparent", label: "Transparent", value: undefined },
  { id: "green", label: "Green screen", value: "#00ff00" },
  { id: "magenta", label: "Magenta", value: "#ff00ff" },
  { id: "black", label: "Black", value: "#000000" },
] as const;

type Format = "png" | "svg";

const base = () => ((import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/").replace(/\/$/, "");

function useAssets() {
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [svgs, setSvgs] = React.useState<Record<string, string>>({});
  React.useEffect(() => {
    (async () => {
      const list: Asset[] = await fetch(`${base()}/assets/manifest.json`).then((r) => r.json());
      setAssets(list);
      const entries = await Promise.all(
        list.map(async (a) => [a.file, await fetch(`${base()}/assets/svg/${a.file}`).then((r) => r.text())] as const),
      );
      setSvgs(Object.fromEntries(entries));
    })();
  }, []);
  return { assets, svgs };
}

const dataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** Export controls are horizontal fields: label left, a control of this width right. */
const CONTROL_W = 120;

function Select<T extends string | number>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const items = Object.fromEntries(options.map((o) => [String(o.value), o.label]));
  return (
    <Field density="relaxed">
      <FieldLabel>{label}</FieldLabel>
      <OsrsSelect
        value={String(value)}
        items={items}
        onValueChange={(v) => onChange((typeof value === "number" ? Number(v) : v) as T)}
      >
        <SelectTrigger style={{ width: CONTROL_W }} />
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={String(o.value)} value={String(o.value)}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </OsrsSelect>
    </Field>
  );
}

function NumberInput({ label, value, onChange, min = 1 }: { label: string; value: number; onChange: (n: number) => void; min?: number }) {
  return (
    <Field density="relaxed">
      <FieldLabel>{label}</FieldLabel>
      <NumberField variant="inset" value={value} min={min} onValueChange={(v) => onChange(Math.max(min, Math.round(v ?? min)))} style={{ width: CONTROL_W }} />
    </Field>
  );
}


export default function AssetBrowser() {
  const { assets, svgs } = useAssets();
  const [group, setGroup] = React.useState<string>("all");
  const [query, setQuery] = React.useState("");
  const [scale, setScale] = React.useState(8);
  const [format, setFormat] = React.useState<Format>("png");
  const [bg, setBg] = React.useState<string>("transparent");
  const [pad, setPad] = React.useState(0);
  const [selected, setSelected] = React.useState<Asset | null>(null);
  const [busy, setBusy] = React.useState(false);
  // the export controls render into the site sidebar's slot (site/Sidebar.tsx)
  const [slot, setSlot] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => setSlot(document.getElementById("osrs-site-sidebar-slot")), []);

  const groups = [{ id: "all", label: "All" }, ...[...new Set(assets.map((a) => a.group))].map((g) => ({ id: g, label: GROUP_LABELS[g] ?? g }))];
  const background = BACKGROUNDS.find((b) => b.id === bg)?.value;
  const visible = assets.filter(
    (a) => (group === "all" || a.group === group) && (a.label + a.name).toLowerCase().includes(query.toLowerCase()),
  );
  const loaded = Object.keys(svgs).length > 0;

  async function exportOne(svg: string, name: string) {
    if (format === "svg") return { name: `${name}.svg`, data: strToU8(scaleSvg(svg, scale)) };
    const blob = await toPng(svg, scale, { pad, background });
    return { name: `${name}@${scale}x.png`, data: new Uint8Array(await blob.arrayBuffer()) };
  }

  async function downloadOne(svg: string, name: string) {
    const f = await exportOne(svg, name);
    download(new Blob([f.data as BlobPart], { type: format === "svg" ? "image/svg+xml" : "image/png" }), f.name);
  }

  /** Zip every asset, or one category's (`groupId`), at the chosen format and scale. */
  async function downloadPack(groupId = "all") {
    setBusy(true);
    try {
      const files: Record<string, Uint8Array> = {};
      for (const a of groupId === "all" ? assets : assets.filter((x) => x.group === groupId)) {
        const f = await exportOne(svgs[a.file], `osrs-${a.group}-${a.name}`);
        files[`${a.group}/${f.name}`] = f.data;
      }
      files["CREDITS.txt"] = strToU8(
        "OSRS UI asset pack.\nCreated using intellectual property belonging to Jagex Limited under the terms of Jagex's Fan Content Policy. This content is not endorsed by or affiliated with Jagex.\n",
      );
      download(new Blob([zipSync(files) as BlobPart], { type: "application/zip" }), `osrs-ui-${groupId}-${format}${format === "png" ? `@${scale}x` : ""}.zip`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="osrs-text flex flex-col gap-4 [--osrs-px:1px]">
      <div
        className={cx(
          // stuck under the header; --bleed is the gap from the main column's edge to the docs' text
          // (half the room the text's 48rem leaves, plus the column's padding; main is a size container)
          "sticky top-[54px] z-20 -mx-(--bleed) flex flex-wrap items-end gap-3 px-(--bleed) pt-1 pb-2 [--bleed:calc((100cqw-min(48rem,100cqw))/2+var(--main-pad))]",
          stone,
        )}
      >
        {/* The tab row is one scroll container as wide as the main column (past the docs' text
            width). Separators sit inside it either side of the tabs: the left one is exactly the
            gap from the column's edge to the text, so the first tab lines up with the text, and the
            right one fills what's left. They scroll with the tabs, so no scroll padding is needed. */}
        <Tabs value={group} onValueChange={(v) => setGroup(String(v))} className="-mx-(--bleed) min-w-0 flex-[0_0_calc(100%+2*var(--bleed))]">
          <TabsList className="w-full px-0 py-1 *:[[role=tab]]:h-[30px] *:[[role=tab]]:flex-none *:[[role=tab]]:px-4">
            <Separator aria-hidden className="w-auto flex-[0_0_var(--bleed)] self-end" />
            {groups.map((g) => (
              <TabsTrigger key={g.id} value={g.id}>
                {g.label}
              </TabsTrigger>
            ))}
            <Separator aria-hidden className="w-auto flex-[1_0_var(--bleed)] self-end" />
          </TabsList>
        </Tabs>
        <SearchField aria-label="Search assets" className="basis-full" value={query} onChange={(e) => setQuery((e.target as HTMLInputElement).value)} />
      </div>

      {slot
        ? createPortal(
            <div className="osrs-text mt-2 [--osrs-px:1px]">
              <FieldSet variant="section">
                <FieldLegend>Export</FieldLegend>
                <Select label="Format" value={format} onChange={setFormat} options={[{ value: "png", label: "PNG" }, { value: "svg", label: "SVG (vector)" }]} />
                <Select label="Scale" value={scale} onChange={setScale} options={SCALES.map((s) => ({ value: s, label: `${s}×` }))} />
                {format === "png" && (
                  <>
                    <Select label="Background" value={bg} onChange={setBg} options={BACKGROUNDS.map((b) => ({ value: b.id, label: b.label }))} />
                    <NumberInput label="Padding" value={pad} min={0} onChange={setPad} />
                  </>
                )}
                <div className="flex flex-col" style={{ gap: 8, padding: "8px 10px" }}>
                  {/* split button: download everything, or pick a category from the menu; one shared frame */}
                  <SplitButton>
                    <Button disabled={!loaded || busy} onClick={() => downloadPack()}>
                      {busy ? "Zipping…" : `Download all (${assets.length})`}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button size="icon" aria-label="Download a category" disabled={!loaded || busy} />}>
                        <chevronSprites.yellowDownSingle />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {groups
                          .filter((g) => g.id !== "all")
                          .map((g) => (
                            <DropdownMenuItem key={g.id} onClick={() => downloadPack(g.id)}>
                              {g.label} ({assets.filter((a) => a.group === g.id).length})
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SplitButton>
                </div>
              </FieldSet>
            </div>,
            slot,
          )
        : null}

      {!loaded ? (
        // skeleton tiles in the cards' own shape while the manifest and sprites load
        <div className="grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-3" aria-busy="true" aria-label="Loading assets">
          {Array.from({ length: 24 }, (_, i) => (
            <Card key={i} className="gap-1 p-1 motion-safe:animate-[osrs-site-skeleton_1.4s_ease-in-out_infinite]" aria-hidden="true">
              <div className="osrs-well h-28" />
              <div className="flex flex-col gap-1 px-1 py-1">
                <span className="block h-2.5 w-3/5 bg-black/28" />
                <span className="block h-2.5 w-[35%] bg-black/28" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-3">
          {visible.map((a) => {
            const svg = svgs[a.file];
            const fit = Math.max(1, Math.min(4, Math.floor(96 / Math.max(a.width, a.height))));
            return (
              <Card key={a.file} className="group/asset gap-1 p-1 transition-colors duration-80 hover:bg-white/6">
                <button
                  type="button"
                  title={a.group === "frame" || a.group === "texture" ? "Open in composer" : a.label}
                  onClick={() => setSelected(a)}
                  className="osrs-well flex h-28 cursor-pointer items-center justify-center border-0 group-hover/asset:bg-[color-mix(in_srgb,var(--osrs-well)_84%,white)] active:shadow-[inset_2px_2px_0_rgb(0_0_0/0.4)]"
                >
                  <img
                    alt={a.label}
                    src={dataUrl(svg)}
                    width={a.width * fit}
                    height={a.height * fit}
                    style={{ imageRendering: "pixelated", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                  />
                </button>
                <div className="flex items-center justify-between gap-2 px-1">
                  <div className="min-w-0">
                    <div className="truncate" style={{ color: "var(--osrs-white)" }}>{a.label}</div>
                    <div className="osrs-text-small">
                      {a.width * scale}×{a.height * scale}
                    </div>
                  </div>
                  <Button variant="metal" tone="white" size="icon" // on hover (and keyboard focus) where there is hover; always on touch screens
                    className="pointer-fine:opacity-0 pointer-fine:group-focus-within/asset:opacity-100 pointer-fine:group-hover/asset:opacity-100" aria-label={`Download ${a.label}`} onClick={() => downloadOne(svg, `osrs-${a.group}-${a.name}`)}>
                    <chevronSprites.yellowDownSingle />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* the composer opens over the page, where the asset was clicked */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        {selected ? (
          <DialogContent
            title={selected.label}
            className="flex w-[min(720px,calc(100vw-2rem))] max-w-none flex-col gap-3 pb-2.5 [--osrs-px:1px] sm:max-w-none"
          >
            <Composer
              key={selected.file}
              asset={selected}
              svgs={svgs}
              textures={assets.filter((a) => a.group === "texture")}
              scale={scale}
              format={format}
              background={background}
            />
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}

function Composer({
  asset,
  svgs,
  textures,
  scale,
  format,
  background,
}: {
  asset: Asset;
  svgs: Record<string, string>;
  textures: Asset[];
  scale: number;
  format: Format;
  background?: string;
}) {
  const resizable = asset.group === "frame" || asset.group === "texture";
  const [w, setW] = React.useState(resizable ? Math.max(asset.width * 3, 160) : asset.width);
  const [h, setH] = React.useState(resizable ? Math.max(asset.height * 2, 90) : asset.height);
  const [fill, setFill] = React.useState<string>(asset.name === "iron-rivets" ? "texture/stone.svg" : "none");
  const fillAsset = textures.find((t) => t.file === fill);

  const svg = !resizable
    ? svgs[asset.file]
    : asset.group === "texture"
      ? composeTexture(asset, svgs[asset.file], w, h)
      : composeFrame(asset, svgs[asset.file], w, h, fillAsset ? { asset: fillAsset, svg: svgs[fillAsset.file] } : undefined);
  const size = svgSize(svg);
  const previewScale = Math.max(1, Math.min(4, Math.floor(640 / size.width)));

  async function save() {
    const name = resizable ? `osrs-${asset.name}-${w}x${h}` : `osrs-${asset.group}-${asset.name}`;
    if (format === "svg") download(new Blob([scaleSvg(svg, scale)], { type: "image/svg+xml" }), `${name}.svg`);
    else download(await toPng(svg, scale, { background }), `${name}@${scale}x.png`);
  }

  return (
    <div className="flex flex-col gap-3 px-2.5">
      {resizable && (
        <div className="flex flex-wrap items-end gap-3">
          <NumberInput label="Width (game px)" value={w} onChange={setW} />
          <NumberInput label="Height (game px)" value={h} onChange={setH} />
          {asset.group === "frame" && (
            <Select
              label="Fill"
              value={fill}
              onChange={setFill}
              options={[{ value: "none", label: "None" }, ...textures.map((t) => ({ value: t.file, label: t.label }))]}
            />
          )}
          <div className="flex flex-wrap gap-1">
            {[
              [1920, 1080],
              [1280, 720],
              [1080, 1080],
            ].map(([pw, ph]) => (
              <Button
                key={`${pw}`}
                size="sm"
                title={`Fits ${pw}×${ph} at ${scale}×`}
                onClick={() => {
                  setW(Math.round(pw / scale));
                  setH(Math.round(ph / scale));
                }}
              >
                {pw}×{ph}
              </Button>
            ))}
          </div>
        </div>
      )}
      <div className="osrs-well flex max-h-[60vh] overflow-auto p-3 [&>img]:m-auto">
        <img
          alt=""
          src={dataUrl(svg)}
          width={size.width * previewScale}
          height={size.height * previewScale}
          style={{ imageRendering: "pixelated", maxWidth: "none" }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>
          Output: {size.width * scale}×{size.height * scale}px {format.toUpperCase()}
        </span>
        <Button variant="metal" tone="white" onClick={save}>
          Download
        </Button>
      </div>
    </div>
  );
}
