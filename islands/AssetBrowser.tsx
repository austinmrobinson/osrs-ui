import * as React from "react";
import { zipSync, strToU8 } from "fflate";

import { composeFrame, composeTexture, download, scaleSvg, svgSize, toPng, type Asset } from "../site/compose";

const GROUPS = [
  { id: "all", label: "All" },
  { id: "skill", label: "Skills" },
  { id: "frame", label: "Frames" },
  { id: "texture", label: "Textures" },
  { id: "control", label: "Controls" },
] as const;

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
  return (
    <label className="flex flex-col gap-1 text-xs font-medium opacity-80">
      {label}
      <select
        className="rounded-md border border-current/20 bg-transparent px-2 py-1.5 text-sm"
        value={String(value)}
        onChange={(e) => {
          const raw = e.target.value;
          onChange((typeof value === "number" ? Number(raw) : raw) as T);
        }}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumberInput({ label, value, onChange, min = 1 }: { label: string; value: number; onChange: (n: number) => void; min?: number }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium opacity-80">
      {label}
      <input
        type="number"
        min={min}
        className="w-24 rounded-md border border-current/20 bg-transparent px-2 py-1.5 text-sm"
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.round(Number(e.target.value) || min)))}
      />
    </label>
  );
}

const btn =
  "rounded-md border border-current/20 px-3 py-1.5 text-sm font-medium hover:bg-current/5 disabled:opacity-40";
const primaryBtn = "rounded-md bg-[#ff981f] px-3 py-1.5 text-sm font-semibold text-black hover:brightness-110 disabled:opacity-40";

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

  async function downloadPack() {
    setBusy(true);
    try {
      const files: Record<string, Uint8Array> = {};
      for (const a of visible) {
        const f = await exportOne(svgs[a.file], `osrs-${a.group}-${a.name}`);
        files[`${a.group}/${f.name}`] = f.data;
      }
      files["CREDITS.txt"] = strToU8(
        "OSRS UI asset pack.\nCreated using intellectual property belonging to Jagex Limited under the terms of Jagex's Fan Content Policy. This content is not endorsed by or affiliated with Jagex.\n",
      );
      download(new Blob([zipSync(files) as BlobPart], { type: "application/zip" }), `osrs-ui-${group}-${format}${format === "png" ? `@${scale}x` : ""}.zip`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="not-prose flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-wrap gap-1">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              className={`${btn} ${group === g.id ? "bg-current/10" : ""}`}
            >
              {g.label}
            </button>
          ))}
        </div>
        <input
          placeholder="Search…"
          className="min-w-40 flex-1 rounded-md border border-current/20 bg-transparent px-2 py-1.5 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-current/15 p-3">
        <Select label="Format" value={format} onChange={setFormat} options={[{ value: "png", label: "PNG" }, { value: "svg", label: "SVG (vector)" }]} />
        <Select label="Scale" value={scale} onChange={setScale} options={SCALES.map((s) => ({ value: s, label: `${s}×` }))} />
        {format === "png" && (
          <>
            <Select label="Background" value={bg} onChange={setBg} options={BACKGROUNDS.map((b) => ({ value: b.id, label: b.label }))} />
            <NumberInput label="Padding (game px)" value={pad} min={0} onChange={setPad} />
          </>
        )}
        <div className="ml-auto flex items-end gap-2">
          <span className="pb-2 text-xs opacity-60">{visible.length} assets</span>
          <button type="button" className={primaryBtn} disabled={!loaded || busy || !visible.length} onClick={downloadPack}>
            {busy ? "Zipping…" : "Download pack (.zip)"}
          </button>
        </div>
      </div>

      {!loaded ? (
        <p className="text-sm opacity-60">Loading assets…</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-3">
          {visible.map((a) => {
            const svg = svgs[a.file];
            const fit = Math.max(1, Math.min(4, Math.floor(96 / Math.max(a.width, a.height))));
            return (
              <div key={a.file} className="flex flex-col overflow-hidden rounded-lg border border-current/15">
                <button
                  type="button"
                  title={a.group === "frame" || a.group === "texture" ? "Open in composer" : a.label}
                  onClick={() => setSelected(a)}
                  className="flex h-28 items-center justify-center bg-[#494034] bg-[repeating-conic-gradient(#0000_0_25%,#0001_0_50%)] bg-[length:16px_16px]"
                >
                  <img
                    alt={a.label}
                    src={dataUrl(svg)}
                    width={a.width * fit}
                    height={a.height * fit}
                    style={{ imageRendering: "pixelated", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                  />
                </button>
                <div className="flex items-center justify-between gap-2 px-2.5 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{a.label}</div>
                    <div className="text-xs opacity-60">
                      {a.width * scale}×{a.height * scale}
                    </div>
                  </div>
                  <button type="button" aria-label={`Download ${a.label}`} className={btn} onClick={() => downloadOne(svg, `osrs-${a.group}-${a.name}`)}>
                    ↓
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <Composer
          key={selected.file}
          asset={selected}
          svgs={svgs}
          textures={assets.filter((a) => a.group === "texture")}
          scale={scale}
          format={format}
          background={background}
          onClose={() => setSelected(null)}
        />
      )}
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
  onClose,
}: {
  asset: Asset;
  svgs: Record<string, string>;
  textures: Asset[];
  scale: number;
  format: Format;
  background?: string;
  onClose: () => void;
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
    <div className="flex flex-col gap-3 rounded-lg border border-current/15 p-4">
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-base font-semibold">{asset.label}</h3>
        <button type="button" className={btn} onClick={onClose}>
          Close
        </button>
      </div>
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
              <button
                key={`${pw}`}
                type="button"
                className={btn}
                title={`Fits ${pw}×${ph} at ${scale}×`}
                onClick={() => {
                  setW(Math.round(pw / scale));
                  setH(Math.round(ph / scale));
                }}
              >
                {pw}×{ph}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="overflow-auto rounded-md bg-[repeating-conic-gradient(#0000_0_25%,#0001_0_50%)] bg-[length:16px_16px] p-3">
        <img
          alt=""
          src={dataUrl(svg)}
          width={size.width * previewScale}
          height={size.height * previewScale}
          style={{ imageRendering: "pixelated", maxWidth: "none" }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm opacity-70">
          Output: {size.width * scale}×{size.height * scale}px {format.toUpperCase()}
        </span>
        <button type="button" className={primaryBtn} onClick={save}>
          Download
        </button>
      </div>
    </div>
  );
}
