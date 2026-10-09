// Shared ratings page (used by gallery/rate-app.tsx and gallery/icon-rate-app.tsx; bundled into one HTML
// file each by scripts/build-gallery-page.ts and published as Artifacts). Each rating is a document in the
// artifact's `ratings` store ({score, tags, note, round, updatedAt, previous}), which Claude reads back.
// Each page has a `round`; a rating saved in an earlier round is shown as context and moved into
// `previous` when the item is rated again, so earlier rounds are never overwritten.
import * as React from "react";

import { ToggleGroup, ToggleGroupItem } from "@/registry/osrs/ui/toggle-group";

/** One thing to rate. `group` drives the filter; `render` draws it inside the stage; `changed` says
 *  what changed since the last round. */
export type RatedItem = {
  id: string;
  title: string;
  group: string;
  groupLabel: string;
  brief: string;
  changed?: string;
  render: () => React.ReactElement;
  /** Optional: draw the item at `scale` for pixel pins (click a pixel to comment on it). */
  pinRender?: (scale: number) => React.ReactElement;
};
const INTERFACE_TAGS = ["Looks like the game", "Wrong colours", "Wrong frame", "Too empty", "Too busy", "Spacing off", "Component missing", "Copy off"];

type Past = { score?: number; tags?: string[]; note?: string; round?: number };
/** A comment on one pixel of an icon: x, y in the icon's own pixels (0,0 top left). */
type Pin = { x: number; y: number; note: string };
type Rating = Past & { updatedAt?: string; previous?: Past[]; pins?: Pin[] };
type DB = {
  collection(path: string): {
    onSnapshot(next: (s: { docs: { id: string; data(): Record<string, unknown> | undefined }[] }) => void, err?: (e: { code: string }) => void): () => void;
    doc(id: string): { set(d: Record<string, unknown>): Promise<void> };
  };
};
declare global {
  interface Window {
    claude?: { use(name: string): Promise<unknown> };
  }
}

function useRatings(round: number) {
  const [db, setDb] = React.useState<DB | null>(null);
  const [state, setState] = React.useState<"connecting" | "ready" | "offline">("connecting");
  const [ratings, setRatings] = React.useState<Record<string, Rating>>({});
  React.useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;
    const use = window.claude?.use;
    if (!use) {
      setState("offline");
      return;
    }
    use("db").then((d) => {
      if (cancelled) return;
      if (!d) return setState("offline");
      const store = d as DB;
      setDb(store);
      unsub = store.collection("ratings").onSnapshot(
        (snap) => {
          const next: Record<string, Rating> = {};
          for (const doc of snap.docs) next[doc.id] = (doc.data() ?? {}) as Rating;
          setRatings(next);
          setState("ready");
        },
        () => setState("offline"),
      );
    });
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);
  const save = React.useCallback(
    async (id: string, r: Rating) => {
      // carry an earlier round's rating into `previous` the first time this round is saved
      const stored = ratings[id];
      let previous = stored?.previous ?? [];
      if (stored && (stored.round ?? 1) < round && stored.score) {
        previous = [
          ...previous,
          {
            score: stored.score,
            tags: stored.tags ?? [],
            note: stored.note ?? "",
            round: stored.round ?? 1,
          },
        ];
      }
      const next: Rating = {
        score: r.score,
        tags: r.tags ?? [],
        note: r.note ?? "",
        pins: r.pins ?? [],
        round,
        previous,
        updatedAt: new Date().toISOString(),
      };
      if (next.score === undefined) delete next.score;
      setRatings((prev) => ({ ...prev, [id]: next }));
      if (!db) return;
      await db
        .collection("ratings")
        .doc(id)
        .set(next as Record<string, unknown>);
    },
    [db, ratings, round],
  );
  return { state, ratings, save };
}

function RatingControls({ id, rating, onSave, disabled, tags }: { id: string; rating: Rating; onSave: (r: Rating) => void; disabled: boolean; tags: string[] }) {
  const [note, setNote] = React.useState(rating.note ?? "");
  React.useEffect(() => setNote(rating.note ?? ""), [rating.note]);
  const commitNote = () => {
    if ((rating.note ?? "") !== note) onSave({ ...rating, note });
  };
  return (
    <div className="rate-controls osrs" style={{ ["--osrs-px" as string]: "1px" }}>
      <div className="rate-row">
        <span className="rate-label" id={`${id}-score`}>
          Score
        </span>
        <ToggleGroup
          aria-labelledby={`${id}-score`}
          value={rating.score ? [String(rating.score)] : []}
          onValueChange={(v) =>
            onSave({
              ...rating,
              score: v.length ? Number(v[v.length - 1]) : undefined,
            })
          }
          disabled={disabled}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <ToggleGroupItem key={n} value={String(n)} size="icon-sm" aria-label={`${n} out of 5`}>
              {n}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="rate-row">
        <span className="rate-label">Tags</span>
        <ToggleGroup multiple value={rating.tags ?? []} onValueChange={(v) => onSave({ ...rating, tags: v as string[] })} disabled={disabled} className="rate-tags">
          {tags.map((t) => (
            <ToggleGroupItem key={t} value={t} size="sm">
              {t}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <label className="rate-row rate-note">
        <span className="rate-label">Note</span>
        <textarea id={`${id}-note`} value={note} disabled={disabled} placeholder="What would make it look more like the game?" onChange={(e) => setNote(e.target.value)} onBlur={commitNote} rows={2} />
      </label>
    </div>
  );
}

const PIN_SCALE = 8;

/**
 * The icon drawn large; clicking a pixel drops a numbered pin there with its own note. Pins are
 * saved with the rating as icon-pixel coordinates.
 */
function PinBoard({ id, render, rating, onSave, disabled }: { id: string; render: (scale: number) => React.ReactElement; rating: Rating; onSave: (r: Rating) => void; disabled: boolean }) {
  const pins = rating.pins ?? [];
  const [drafts, setDrafts] = React.useState<string[]>(pins.map((p) => p.note));
  const [focus, setFocus] = React.useState<number | null>(null);
  React.useEffect(() => setDrafts((rating.pins ?? []).map((p) => p.note)), [rating.pins]);
  const boardRef = React.useRef<HTMLDivElement>(null);
  const noteRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  React.useEffect(() => {
    if (focus !== null) noteRefs.current[focus]?.focus();
  }, [focus, pins.length]);

  const place = (e: React.MouseEvent) => {
    if (disabled) return;
    const svg = boardRef.current?.querySelector("svg");
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const x = Math.floor(((e.clientX - box.left) / box.width) * vb.width);
    const y = Math.floor(((e.clientY - box.top) / box.height) * vb.height);
    if (x < 0 || y < 0 || x >= vb.width || y >= vb.height) return;
    const existing = pins.findIndex((p) => p.x === x && p.y === y);
    if (existing >= 0) return setFocus(existing);
    onSave({ ...rating, pins: [...pins, { x, y, note: "" }] });
    setFocus(pins.length);
  };
  const setNote = (i: number) => {
    if ((pins[i]?.note ?? "") === (drafts[i] ?? "")) return;
    onSave({
      ...rating,
      pins: pins.map((p, j) => (j === i ? { ...p, note: drafts[i] ?? "" } : p)),
    });
  };
  const remove = (i: number) => onSave({ ...rating, pins: pins.filter((_, j) => j !== i) });
  // pin markers sit over the pixel; the board is in icon pixels times PIN_SCALE
  return (
    <div className="pin-area">
      <div className="pin-board-wrap">
        <div ref={boardRef} className="pin-board" role="button" tabIndex={-1} aria-label="Click a pixel to comment on it" onClick={place} style={{ cursor: disabled ? "default" : "crosshair" }}>
          {render(PIN_SCALE)}
          {pins.map((p, i) => (
            <span
              key={i}
              className="pin"
              style={{
                left: p.x * PIN_SCALE,
                top: p.y * PIN_SCALE,
                width: PIN_SCALE,
                height: PIN_SCALE,
              }}
            >
              <span className="pin-num">{i + 1}</span>
            </span>
          ))}
        </div>
        <p className="pin-hint">{disabled ? "Pins can't be saved in this view" : "Click a pixel to comment on it"}</p>
      </div>
      {pins.length ? (
        <ol className="pin-list">
          {pins.map((p, i) => (
            <li key={i}>
              <span className="pin-num static">{i + 1}</span>
              <input
                ref={(el) => {
                  noteRefs.current[i] = el;
                }}
                id={`${id}-pin-${i}`}
                aria-label={`Note for pin ${i + 1}`}
                value={drafts[i] ?? ""}
                placeholder="What's wrong here?"
                disabled={disabled}
                onChange={(e) => setDrafts((d) => Object.assign([...d], { [i]: e.target.value }))}
                onBlur={() => setNote(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                }}
              />
              <button type="button" className="pin-remove" onClick={() => remove(i)} disabled={disabled} aria-label={`Remove pin ${i + 1}`}>
                Remove
              </button>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

export function RatingsPage({
  title,
  lede,
  items,
  tags = INTERFACE_TAGS,
  stageScale,
  round = 1,
}: {
  title: string;
  lede: string;
  items: RatedItem[];
  tags?: string[];
  stageScale?: boolean;
  /** The current round; ratings from earlier rounds show as context. */
  round?: number;
}) {
  const gallery = items;
  const { state, ratings: stored, save } = useRatings(round);
  // this round's ratings only; earlier ones are context
  const ratings = Object.fromEntries(Object.entries(stored).filter(([, r]) => (r.round ?? 1) === round));
  const lastRound = (id: string): Past | undefined => {
    const r = stored[id];
    if (!r) return undefined;
    if ((r.round ?? 1) < round) return r;
    return r.previous?.[r.previous.length - 1];
  };
  const groups = [...new Map(items.map((i) => [i.group, i.groupLabel])).entries()];
  const ARCHETYPES = [{ value: "all", label: "All" }, ...groups.map(([value, label]) => ({ value, label }))];
  const [filter, setFilter] = React.useState<string>("all");
  const [scale, setScale] = React.useState<"1" | "2">(() => (window.innerWidth >= 1200 ? "2" : "1"));
  const rated = gallery.filter((g) => ratings[g.id]?.score);
  const avg = rated.length ? rated.reduce((s, g) => s + (ratings[g.id].score ?? 0), 0) / rated.length : 0;
  const shown = gallery.filter((g) => filter === "all" || g.group === filter);
  return (
    <main className="page">
      <header className="page-head">
        <h1>
          {title}
          {round > 1 ? <span className="round"> · Round {round}</span> : null}
        </h1>
        <p className="lede">{lede}</p>
        <div className="toolbar osrs" style={{ ["--osrs-px" as string]: "1px" }}>
          <ToggleGroup value={[filter]} onValueChange={(v) => v.length && setFilter(String(v[v.length - 1]))}>
            {ARCHETYPES.map((a) => (
              <ToggleGroupItem key={a.value} value={a.value} size="sm">
                {a.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {stageScale !== false ? (
            <ToggleGroup value={[scale]} onValueChange={(v) => v.length && setScale(v[v.length - 1] as "1" | "2")} aria-label="Preview scale">
              <ToggleGroupItem value="1" size="sm">
                1x
              </ToggleGroupItem>
              <ToggleGroupItem value="2" size="sm">
                2x
              </ToggleGroupItem>
            </ToggleGroup>
          ) : null}
          <p className="summary" aria-live="polite">
            <strong>{rated.length}</strong> of {gallery.length} rated
            {rated.length ? (
              <>
                {" "}
                · average <strong>{avg.toFixed(1)}</strong>
              </>
            ) : null}
            {state === "offline" ? <span className="warn"> · Ratings can't be saved in this view</span> : null}
          </p>
        </div>
      </header>
      <ol className="list">
        {shown.map((g) => {
          const n = gallery.indexOf(g) + 1;
          const r = ratings[g.id] ?? {};
          const last = lastRound(g.id);
          return (
            <li key={g.id} className="item" id={g.id}>
              <div className="item-head">
                <span className="num">{n}</span>
                <h2>{g.title}</h2>
                <span className="kind">{g.groupLabel}</span>
                {r.score ? <span className="done">Rated {r.score}/5</span> : null}
              </div>
              <p className="brief">{g.brief}</p>
              {last?.score ? (
                <p className="last">
                  Round {last.round ?? 1}: <strong>{last.score}/5</strong>
                  {last.note ? <> · “{last.note}”</> : null}
                </p>
              ) : null}
              {g.changed ? (
                <p className="changed">
                  <strong>Changed:</strong> {g.changed}
                </p>
              ) : null}
              <div className="stage osrs osrs-text" style={{ ["--osrs-px" as string]: `${scale}px` }}>
                {g.render()}
              </div>
              {g.pinRender ? <PinBoard id={g.id} render={g.pinRender} rating={r} onSave={(next) => save(g.id, next)} disabled={state === "offline"} /> : null}
              <RatingControls id={g.id} rating={r} onSave={(next) => save(g.id, next)} disabled={state === "offline"} tags={tags} />
            </li>
          );
        })}
      </ol>
    </main>
  );
}
