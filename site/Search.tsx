"use client";

// The site's search (in the header, components/shell/Header.astro), built from the library and the
// osrs-interface skill. A riveted window (Dialog) whose top is the search field; below it the
// results (a title over a one-line summary) and the highlighted page: its pre-rendered preview large
// on a stone stage (Framer-style), with the page as a framed card along the stage's foot (Notion-
// style: section, title, description, its sections). Every page gets the same regions at fixed
// sizes, so moving through results never shifts anything.
// Index: site/search-index.generated.json (scripts/build-search.ts).
import * as React from "react";

import { Dialog, DialogContent } from "@/registry/osrs/ui/dialog";
import { List, ListItem, ListItemContent, ListItemDescription, ListItemTitle } from "@/registry/osrs/ui/list";
import { PreviewImage } from "./PreviewImage";
import { NpcDialogue } from "@/registry/osrs/ui/chatbox";
import { KeyIcon } from "./key-icons";
import { HansChathead } from "./demo-data/chatheads";
import { SearchIcon } from "./header-icons";
import { SearchField } from "@/registry/osrs/ui/search-field";
import { Shortcut } from "@/registry/osrs/ui/shortcut";
import PREVIEWS from "./previews.generated.json";
import { cx, edge, stage, textShadow, well } from "./styles";
import INDEX from "./search-index.generated.json";

type Entry = {
  route: string;
  title: string;
  description: string;
  summary: string;
  section: string;
  headings: string[];
  outline: { text: string; depth: number }[];
  previews: string[];
  example?: string;
};
const PAGES = INDEX as Entry[];
const SIZES = PREVIEWS as Record<string, { src: string; width: number; height: number }>;

// roughly the stage's inside (site.css: the right pane less the page card and padding)
const STAGE = { width: 600, height: 300 };
/** A lone preview small enough is shown at 2x (the PNG's own pixels), so a button reads like a button. */
const doubled = (key: string) => SIZES[key] && SIZES[key].width * 2 <= STAGE.width && SIZES[key].height * 2 <= STAGE.height;

/** Fetch every preview once, so the stage never sits empty while arrowing through results. */
let preloaded = false;
function preloadPreviews() {
  if (preloaded) return;
  preloaded = true;
  for (const p of Object.values(SIZES)) new Image().src = p.src;
}

/** Title matches first, then words in the description and headings. */
function search(query: string): Entry[] {
  const q = query.trim().toLowerCase();
  if (!q) return PAGES;
  const words = q.split(/\s+/);
  return PAGES.map((p) => {
    const title = p.title.toLowerCase();
    const rest = `${p.description} ${p.headings.join(" ")} ${p.section}`.toLowerCase();
    let score = 0;
    if (title === q) score += 100;
    else if (title.startsWith(q)) score += 60;
    else if (title.includes(q)) score += 40;
    for (const w of words) if (title.includes(w)) score += 10;
      else if (rest.includes(w)) score += 3;
      else return { p, score: -1 };
    return { p, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.p);
}

/** The page card / sheet text rows: one line each, cut off with an ellipsis. */
const row = "m-0 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap";

/** The highlighted page: its preview large on the stage, and the page as a card along the foot.
 *  A page with nothing to preview (Installation, Assets…) is shown as the page itself instead: the
 *  card rises into a narrower sheet centred on the stage, with its full outline. */
function PagePreview({ page }: { page: Entry | undefined }) {
  const pane = cx("relative min-h-0 min-w-0 overflow-hidden", stage, edge);
  if (!page) return <div className={cx(pane, "flex items-center justify-center text-rs-dim")}>No pages match.</div>;
  const sections = page.outline.filter((o) => o.depth === 0);
  if (!page.previews.length)
    return (
      <article className={cx(pane, "flex items-end justify-center px-6 pt-6 max-[720px]:hidden")}>
        <div className="osrs-framed osrs-frame-tan-border flex h-full w-[min(100%,440px)] flex-col gap-1 overflow-hidden bg-rs-stone px-4 py-3.5 [mask-image:linear-gradient(to_bottom,#000_calc(100%-32px),transparent)]">
          <p className={cx(row, "leading-[18px] text-rs-muted")}>{page.section}</p>
          <h2 className="m-0 truncate font-rs-bold text-rs-2x leading-9 text-rs-white">{page.title}</h2>
          <p className="m-0 leading-5 text-rs-orange">{page.description}</p>
          <List className="mt-2">
            {page.outline.map((o, i) => (
              <ListItem key={i} className={cx("block h-5 min-h-0 truncate px-2 leading-5", o.depth === 1 && "ps-[22px] text-[#c9c0ad]")}>
                {o.text}
              </ListItem>
            ))}
          </List>
        </div>
      </article>
    );
  const count = page.previews.length;
  return (
    <article className={cx(pane, "grid grid-rows-[minmax(0,1fr)_auto] max-[720px]:hidden")}>
      {/* its own preview, or three of the pages an overview lists */}
      <div
        className={cx(
          "flex min-h-0 items-center justify-center gap-4 overflow-hidden p-4",
          "[&_img]:h-auto [&_img]:max-h-full [&_img]:min-w-0 [&_img]:object-contain",
          count === 3 ? "[&_img]:max-w-[calc((100%-32px)/3)]" : "[&_img]:max-w-full",
        )}
      >
        {count === 1 && doubled(page.previews[0]) ? (
          <span key={page.previews[0]} className="inline-flex [zoom:2]">
            <PreviewImage page={page.previews[0]} />
          </span>
        ) : (
          page.previews.map((key) => <PreviewImage key={key} page={key} />)
        )}
      </div>
      <div className="osrs-framed osrs-frame-tan-border m-2 grid grid-rows-[18px_22px_20px_18px] gap-0.5 bg-rs-stone px-3 py-2.5">
        <p className={cx(row, "leading-[18px] text-rs-muted")}>{page.section}</p>
        <h2 className={cx(row, "font-rs-bold text-rs leading-[22px] text-rs-white")}>{page.title}</h2>
        <p className={cx(row, "leading-5 text-rs-orange")} title={page.description}>
          {page.description}
        </p>
        <p className={cx(row, "leading-[18px] text-rs-muted")}>{sections.map((o) => o.text).join(" · ")}</p>
      </div>
    </article>
  );
}


/**
 * The part of the screen you can see, while `active`. No CSS unit tracks the on-screen keyboard: on
 * iOS it slides over the page without resizing it (svh, dvh and vh all ignore it), so the visual
 * viewport is the only measure of the space above it. Returns its height and offset as
 * --search-h / --search-top, or nothing while it's the full window (so 100svh applies).
 */
function useVisibleViewport(active: boolean): React.CSSProperties | undefined {
  const [box, setBox] = React.useState<{ h: number; top: number } | null>(null);
  React.useEffect(() => {
    const vv = window.visualViewport;
    if (!active || !vv) return setBox(null);
    const update = () => setBox(vv.height < window.innerHeight - 1 ? { h: vv.height, top: vv.offsetTop } : null);
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [active]);
  return box ? ({ ["--search-h" as string]: `${box.h}px`, ["--search-top" as string]: `${box.top}px` } as React.CSSProperties) : undefined;
}

export default function Search() {
  const [open, setOpen] = React.useState(false);
  const fit = useVisibleViewport(open);
  // the shortcut hint names the key the platform uses
  const [mac, setMac] = React.useState(true);
  React.useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const results = React.useMemo(() => search(query), [query]);
  const listRef = React.useRef<HTMLDivElement>(null);

  // ⌘K / Ctrl+K, and "/" outside text fields, open search
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  React.useEffect(() => setActive(0), [query]);
  React.useEffect(() => void (open && preloadPreviews()), [open]);
  React.useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (page?: Entry) => {
    if (page) window.location.href = page.route;
  };
  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") (e.preventDefault(), setActive((i) => Math.min(results.length - 1, i + 1)));
    else if (e.key === "ArrowUp") (e.preventDefault(), setActive((i) => Math.max(0, i - 1)));
    else if (e.key === "Enter") (e.preventDefault(), go(results[active]));
  };

  // the header trigger: below lg the metal icon button, from lg a search field with the shortcut keys
  const keys = (
    <Shortcut className="ms-auto" keys={[mac ? <KeyIcon key="mod" glyph="command" label="Command" /> : <KeyIcon key="mod" glyph="control" label="Control" />, "K"]} />
  );
  return (
    <Dialog open={open} onOpenChange={(o) => (setOpen(o), o || setQuery(""))}>
      {/* below lg, a plain pixel icon like the header's other buttons */}
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="osrs-hit-area group inline-grid size-7 cursor-pointer place-items-center border-0 bg-transparent p-0 text-rs-orange hover:text-rs-white lg:hidden"
      >
        <SearchIcon className="group-active:translate-px" />
      </button>
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen(true)}
        className={cx("group hidden h-[30px] w-full cursor-pointer items-center gap-2 border-0 px-2.5 text-start text-rs-orange [--osrs-px:1px] hover:text-rs-white lg:flex", well, textShadow)}
      >
        Search…
        {keys}
      </button>
      <DialogContent
        showCloseButton={false}
        aria-label="Search"
        // phones: the whole screen, from the top, as tall as the visible area (100svh, or the space
        // above the keyboard while it's open; see useVisibleViewport)
        style={fit}
        className="flex h-[min(560px,88dvh)] w-[min(960px,94vw)] max-w-[min(960px,94vw)] flex-col gap-1 p-2.5 sm:max-w-[min(960px,94vw)] [--osrs-px:1px] max-sm:top-(--search-top,0px) max-sm:bottom-auto max-sm:m-0 max-sm:h-(--search-h,100svh) max-sm:w-full max-sm:max-w-full"
      >
        <SearchField
          autoFocus
          size="lg"
          placeholder="Search components, recipes…"
          value={query}
          onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
          onKeyDown={onInputKey}
          aria-label="Search the docs"
          className={cx("flex-none", "[&>input]:bg-rs-stone-dark [&>input]:bg-[image:linear-gradient(rgb(0_0_0/0.32),rgb(0_0_0/0.32)),var(--osrs-texture-stone)] [&>input]:bg-[size:auto,176px_120px]", "[&>input]:shadow-[inset_0_0_0_1px_var(--color-rs-separator),0_0_0_1px_var(--color-rs-line)]")}
          end={<Shortcut>Esc</Shortcut>}
        />
        {results.length === 0 ? (
          // nothing found: Hans, who's walked every path in Lumbridge, hasn't seen it either
          <div className={cx("flex min-h-0 flex-1 items-center justify-center", stage, edge)}>
            <NpcDialogue
              name="Hans"
              head={<HansChathead />}
              continueLabel="Click here to search again"
              onContinue={() => setQuery("")}
            >
              I&apos;ve walked every path round this castle and never seen a page called &ldquo;{query.trim()}&rdquo;. Try another word?
            </NpcDialogue>
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 grid-cols-[300px_minmax(0,1fr)] gap-1 max-[720px]:grid-cols-1">
            <div className={cx("min-h-0 overflow-y-auto p-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", edge)} ref={listRef}>
              <List>
                {results.map((page, index) => (
                  <ListItem
                    key={page.route}
                    data-index={index}
                    selected={index === active}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go(page)}
                    className="h-10 min-h-0 cursor-pointer gap-0 px-2 py-[3px]"
                  >
                    <ListItemContent className="min-w-0 flex-1">
                      <ListItemTitle className={cx("truncate leading-[17px]", index === active && "text-rs-white")}>{page.title}</ListItemTitle>
                      <ListItemDescription className="truncate leading-[17px] [&>span]:text-[#c9c0ad]">{page.summary}</ListItemDescription>
                    </ListItemContent>
                  </ListItem>
                ))}
              </List>
            </div>
            <PagePreview page={results[active]} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
