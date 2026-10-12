"use client";

import * as React from "react";

import { Input } from "@/registry/osrs/ui/input";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/osrs/ui/select";
import { Window, WindowSeparator } from "@/registry/osrs/ui/window";
import {
  MAP_ICONS,
  WorldMapClose,
  WorldMapKeyButton,
  WorldMapOverviewButton,
  WorldMapZoomInButton,
  WorldMapZoomOutButton,
} from "@/site/demo-data/world-map";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;

// The map image: the region from game square (2944, 3008) to (3456, 3520), north up, 4 image
// pixels per square (the in-game map at 100%). Swap in your own tiles or render.
const MAP = { src: "/demo/world-map/misthalin.webp", size: 2048, x0: 2944, y1: 3520 };
const toImage = ([gx, gy]: [number, number]): [number, number] => [(gx - MAP.x0) * 4, (MAP.y1 - gy) * 4];

type Place = { name: string; at: [number, number]; kind: "region" | "town" | "water" };
const PLACES: Place[] = [
  { name: "Misthalin", at: [3170, 3330], kind: "region" },
  { name: "Asgarnia", at: [3010, 3310], kind: "region" },
  { name: "Kharidian Desert", at: [3330, 3070], kind: "region" },
  { name: "Lumbridge", at: [3222, 3240], kind: "town" },
  { name: "Draynor Village", at: [3093, 3270], kind: "town" },
  { name: "Al Kharid", at: [3293, 3196], kind: "town" },
  { name: "Varrock", at: [3213, 3450], kind: "town" },
  { name: "Port Sarim", at: [3030, 3240], kind: "town" },
  { name: "Falador", at: [2980, 3400], kind: "town" },
  { name: "River Lum", at: [3236, 3330], kind: "water" },
];

const AREAS = ["Gielinor Surface", "Ancient Cavern", "Ardougne Underground", "Asgarnia Ice Cave", "Braindeath Island", "Cam Torum", "Dorgesh-Kaan", "Dwarven Mines"];
const ZOOMS = [0.25, 0.5, 1, 2, 4];

/** One of the bottom bar's sprite buttons: the game's own button art, nudged down while pressed. */
function BarButton({ sprite: Sprite, label, pressed, onClick, style }: { sprite: React.ComponentType<{ className?: string }>; label: string; pressed?: boolean; onClick: () => void; style?: React.CSSProperties }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className="group shrink-0 cursor-pointer border-0 bg-transparent p-0 leading-none"
      style={style}
    >
      <Sprite className="block group-active:translate-y-(--osrs-px) group-aria-pressed:brightness-125" />
    </button>
  );
}

export default function WorldMapRecipe() {
  const [zoom, setZoom] = React.useState(2);
  // the view's centre, in map image pixels: Lumbridge to start
  const [centre, setCentre] = React.useState<[number, number]>(toImage([3222, 3218]));
  const [keyOpen, setKeyOpen] = React.useState(false);
  const [area, setArea] = React.useState(AREAS[0]);
  const [query, setQuery] = React.useState("");
  const view = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ x: number; y: number; centre: [number, number] } | null>(null);
  const z = ZOOMS[zoom];

  /** CSS px per map image pixel at zoom `zz` (the window's --osrs-px times the zoom). */
  const scale = (zz = z) => {
    const el = view.current;
    return el ? (Number.parseFloat(getComputedStyle(el).getPropertyValue("--osrs-px")) || 1) * zz : zz;
  };
  /** Keeps the view inside the map image. */
  const clamp = ([x, y]: [number, number], zz = z): [number, number] => {
    const el = view.current;
    const s = scale(zz);
    const hw = el ? el.clientWidth / s / 2 : 0;
    const hh = el ? el.clientHeight / s / 2 : 0;
    const fit = (v: number, h: number) => (h * 2 >= MAP.size ? MAP.size / 2 : Math.min(MAP.size - h, Math.max(h, v)));
    return [fit(x, hw), fit(y, hh)];
  };
  // zooming out can show past the edge: pull the view back in
  React.useLayoutEffect(() => setCentre((c) => clamp(c)), [zoom]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (name: string) => {
    const place = PLACES.find((p) => p.name.toLowerCase().includes(name.trim().toLowerCase()));
    if (!place || !name.trim()) return;
    setCentre(toImage(place.at));
    setZoom(2);
  };

  // where a map image pixel lands in the view, in game pixels from its top-left
  const at = ([x, y]: [number, number]) => ({ left: `calc(50% + ${(x - centre[0]) * z} * var(--osrs-px))`, top: `calc(50% + ${(y - centre[1]) * z} * var(--osrs-px))` });

  return (
    <div className="osrs flex justify-center p-6">
      <Window resizable style={{ width: px(512), height: px(334) }} minWidth={512} minHeight={240}>
        {/* the map: drag to pan */}
        <div
          ref={view}
          className="relative min-h-0 flex-1 cursor-grab touch-none overflow-hidden bg-[#2d3e52] select-none active:cursor-grabbing"
          onPointerDown={(e) => {
            if ((e.target as HTMLElement).closest("button")) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            drag.current = { x: e.clientX, y: e.clientY, centre };
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d) return;
            const s = scale();
            setCentre(clamp([d.centre[0] - (e.clientX - d.x) / s, d.centre[1] - (e.clientY - d.y) / s]));
          }}
          onPointerUp={() => (drag.current = null)}
          onPointerCancel={() => (drag.current = null)}
        >
          <img
            src={MAP.src}
            alt="World map of Misthalin"
            draggable={false}
            className="pointer-events-none absolute block max-w-none [image-rendering:pixelated]"
            style={{ ...at([0, 0]), width: px(MAP.size * z), height: px(MAP.size * z) }}
          />
          {PLACES.filter((p) => p.kind === "region" || z >= 0.5).map((p) => (
            <span
              key={p.name}
              className={
                p.kind === "region"
                  ? "osrs-text-bold pointer-events-none absolute -translate-1/2 whitespace-nowrap text-[color:var(--osrs-orange)]"
                  : "osrs-text pointer-events-none absolute -translate-1/2 whitespace-nowrap text-[color:var(--osrs-white)]"
              }
              style={at(toImage(p.at))}
            >
              {p.name}
            </span>
          ))}
          <button type="button" aria-label="Close" className="absolute cursor-pointer border-0 bg-transparent p-0 leading-none" style={{ top: px(1), right: px(5) }}>
            <WorldMapClose className="block" />
          </button>

          {/* the key: the map's icons and what they mark */}
          {keyOpen ? (
            <div className="absolute inset-y-0 right-0 flex bg-[color:var(--osrs-stone)] bg-[image:var(--osrs-texture-stone)]" style={{ width: px(185) }}>
              <WindowSeparator orientation="vertical" />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="osrs-text-bold text-center text-[color:var(--osrs-orange)]" style={{ padding: `${px(4)} 0` }}>
                  Key
                </div>
                <WindowSeparator />
                <ScrollArea className="min-h-0 flex-1">
                  <div className="osrs-text text-center text-[color:var(--osrs-white)]" style={{ paddingTop: px(3) }}>
                    Game features
                  </div>
                  <ul className="m-0 list-none p-0" style={{ padding: px(3) }}>
                    {Object.entries(MAP_ICONS).map(([label, Icon]) => (
                      <li key={label} className="osrs-text flex items-center text-[color:var(--osrs-orange)]" style={{ gap: px(4), height: px(16) }}>
                        <Icon className="shrink-0" />
                        {label}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </div>
          ) : null}
        </div>

        <WindowSeparator />
        {/* the bottom bar */}
        <div className="flex items-start" style={{ height: px(34), padding: `0 ${px(3)}`, gap: px(5) }}>
          <BarButton
            sprite={WorldMapOverviewButton}
            label="Overview"
            onClick={() => {
              setZoom(0);
              setCentre([MAP.size / 2, MAP.size / 2]);
            }}
            style={{ marginTop: px(3) }}
          />
          <Input
            aria-label="Search the map"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => e.key === "Enter" && go(query)}
            className="shrink-0 text-center placeholder:text-[color:var(--osrs-white)]"
            style={{ width: px(100), marginTop: px(7) }}
          />
          <Select value={area} onValueChange={(v) => v && setArea(String(v))}>
            <SelectTrigger aria-label="Map area" className="text-[color:var(--osrs-orange)]" style={{ width: px(202), marginTop: px(7) }} />
            <SelectContent>
              {AREAS.map((a) => (
                // only the surface is in this demo's map image
                <SelectItem key={a} value={a} disabled={a !== AREAS[0]}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="flex-1" />
          <BarButton sprite={WorldMapZoomOutButton} label="Zoom out" onClick={() => setZoom((v) => Math.max(0, v - 1))} style={{ marginTop: px(5) }} />
          <BarButton sprite={WorldMapZoomInButton} label="Zoom in" onClick={() => setZoom((v) => Math.min(ZOOMS.length - 1, v + 1))} style={{ marginTop: px(5) }} />
          <BarButton sprite={WorldMapKeyButton} label="Key" pressed={keyOpen} onClick={() => setKeyOpen((v) => !v)} style={{ marginTop: px(3) }} />
        </div>
      </Window>
    </div>
  );
}
