"use client";

// Five layout studies for the docs' ⌘K search window, drawn with the library at the game's scale.
// Static mock-ups (a typed query, one highlighted result), not wired up: pick one, then build it in
// site/Search.tsx. View one at /blume-examples/previews/search-layouts?v=1 … 10.
import * as React from "react";

import { Card } from "@/registry/osrs/ui/card";
import { chevronSprites } from "@/registry/osrs/ui/chevron-sprites";
import { DescriptionItem, DescriptionList } from "@/registry/osrs/ui/description-list";
import { Input } from "@/registry/osrs/ui/input";
import { List, ListItem, ListItemContent, ListItemDescription, ListItemMedia, ListItemTitle } from "@/registry/osrs/ui/list";
import { NavItem, NavList } from "@/registry/osrs/ui/nav-list";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";
import { Window, WindowBody, WindowClose, WindowHeader } from "@/registry/osrs/ui/window";
import { PreviewImage } from "@/site/PreviewImage";
import INDEX from "@/site/search-index.generated.json";

type Entry = { route: string; title: string; description: string; summary: string; section: string; outline: { text: string; depth: number }[]; previews: string[] };
const PAGES = INDEX as Entry[];
const px = (n: number) => `calc(${n} * var(--osrs-px))`;

// the mock query and its results; Slider is highlighted
const QUERY = "sl";
const RESULTS = ["/components/slider", "/components/select", "/components/scroll-area", "/components/skill-tile", "/components/skill-icons", "/recipes/skill-guide", "/recipes/settings", "/recipes/all-settings"]
  .map((r) => PAGES.find((p) => p.route === r))
  .filter((p): p is Entry => !!p);
const ACTIVE = RESULTS[0];
const W = 760;
const H = 440;

const Field = () => <Input readOnly value={QUERY} aria-label="Search" style={{ width: "100%", height: px(24) }} />;
const Stage = ({ page, height }: { page: Entry; height: number }) => (
  <div className="flex items-center justify-center [&_img]:max-h-[min(100%,260px)] [&_img]:max-w-[min(100%,440px)]" style={{ height: px(height), flex: "none" }}>
    {page.previews[0] ? <PreviewImage page={page.previews[0]} /> : null}
  </div>
);
const Outline = ({ page }: { page: Entry }) => (
  <List>
    {page.outline.slice(0, 6).map((o, i) => (
      <ListItem key={i} style={{ paddingLeft: px(6 + o.depth * 10) }}>
        {o.text}
      </ListItem>
    ))}
  </List>
);
const Head = ({ page }: { page: Entry }) => (
  <div className="flex min-w-0 flex-col" style={{ gap: px(2) }}>
    <span style={{ color: "#c8b28c" }}>{page.section}</span>
    <span className="osrs-text-bold" style={{ color: "var(--osrs-white)" }}>
      {page.title}
    </span>
    <span className="truncate">{page.description}</span>
  </div>
);
const Rows = ({ summary = true }: { summary?: boolean }) => (
  <List>
    {RESULTS.map((p) => (
      <ListItem key={p.route} selected={p === ACTIVE}>
        {summary ? (
          <ListItemContent className="min-w-0">
            <ListItemTitle>{p.title}</ListItemTitle>
            <ListItemDescription className="truncate">{p.summary}</ListItemDescription>
          </ListItemContent>
        ) : (
          p.title
        )}
      </ListItem>
    ))}
  </List>
);

/** 1 · Collection Log: section filters as the log's panel tabs, list on the left, the page on the right. */
function CollectionLog() {
  return (
    <WindowBody className="flex flex-col" style={{ gap: px(6) }}>
      <Field />
      <Tabs variant="panel" defaultValue="all" className="min-h-0 flex-1">
        <TabsList>
          {["All", "Components", "Recipes", "Getting Started"].map((t) => (
            <TabsTrigger key={t} value={t.toLowerCase()}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all" className="flex min-h-0 flex-1" style={{ gap: px(6), padding: px(6) }}>
          <ScrollArea style={{ width: px(230), height: "100%" }}>
            <Rows />
          </ScrollArea>
          <div className="flex min-w-0 flex-1 flex-col" style={{ gap: px(6) }}>
            <Head page={ACTIVE} />
            <Stage page={ACTIVE} height={120} />
            <Outline page={ACTIVE} />
          </div>
        </TabsContent>
      </Tabs>
    </WindowBody>
  );
}

/** 2 · Page sheet (Notion): a dense title list, and the page itself in miniature: title, its example
 *  under Preview / Code tabs, then each section as a band, like the docs page. */
function PageSheet() {
  return (
    <WindowBody className="flex flex-col" style={{ gap: px(6) }}>
      <Field />
      <div className="flex min-h-0 flex-1" style={{ gap: px(6) }}>
        <ScrollArea style={{ width: px(170), height: "100%" }}>
          <Rows summary={false} />
        </ScrollArea>
        <div className="osrs-well flex min-w-0 flex-1 flex-col overflow-hidden" style={{ padding: px(10), gap: px(6) }}>
          <span style={{ color: "#c8b28c" }}>{ACTIVE.section}</span>
          <span className="osrs-text-bold" style={{ color: "var(--osrs-white)", fontSize: px(24), lineHeight: 1 }}>
            {ACTIVE.title}
          </span>
          <span className="truncate">{ACTIVE.description}</span>
          <Tabs variant="panel" defaultValue="preview">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="flex items-center justify-center" style={{ height: px(110) }}>
              {ACTIVE.previews[0] ? <PreviewImage page={ACTIVE.previews[0]} /> : null}
            </TabsContent>
          </Tabs>
          {ACTIVE.outline
            .filter((o) => o.depth === 0)
            .slice(1, 4)
            .map((o) => (
              <div key={o.text} className="osrs-section-title" style={{ textAlign: "left", paddingLeft: px(6) }}>
                {o.text}
              </div>
            ))}
        </div>
      </div>
    </WindowBody>
  );
}

/** 3 · Stage first: the highlighted result's preview across the top, results and its outline below. */
function StageFirst() {
  return (
    <WindowBody className="flex flex-col" style={{ gap: px(6) }}>
      <Field />
      <Stage page={ACTIVE} height={140} />
      <div className="flex min-h-0 flex-1" style={{ gap: px(6) }}>
        <ScrollArea className="flex-1" style={{ height: "100%" }}>
          <Rows />
        </ScrollArea>
        <div className="flex flex-col" style={{ width: px(260), gap: px(6) }}>
          <Head page={ACTIVE} />
          <Outline page={ACTIVE} />
        </div>
      </div>
    </WindowBody>
  );
}

/** 4 · Card grid: every result is a card with its preview, like the overview pages; the highlighted
 *  card's description and sections in a strip along the bottom. */
function CardGrid() {
  return (
    <WindowBody className="flex flex-col" style={{ gap: px(6) }}>
      <Field />
      <div className="grid min-h-0 flex-1 grid-cols-4 content-start" style={{ gap: px(6) }}>
        {RESULTS.map((p) => (
          <Card key={p.route} variant="flat" selected={p === ACTIVE} className="items-center overflow-hidden" style={{ height: px(118), gap: px(4) }}>
            <span className="flex min-h-0 flex-1 items-center justify-center overflow-hidden" style={{ width: "100%" }}>
              {p.previews[0] ? <PreviewImage page={p.previews[0]} /> : null}
            </span>
            <span className="osrs-text-bold" style={{ color: "var(--osrs-white)" }}>
              {p.title}
            </span>
          </Card>
        ))}
      </div>
      <div className="osrs-well flex items-center" style={{ padding: px(6), gap: px(10) }}>
        <span className="osrs-text-bold flex-none" style={{ color: "var(--osrs-white)" }}>
          {ACTIVE.title}
        </span>
        <span className="min-w-0 flex-1 truncate">{ACTIVE.description}</span>
        <span className="flex-none" style={{ color: "#c8b28c" }}>
          {ACTIVE.outline.length} sections
        </span>
      </div>
    </WindowBody>
  );
}

/** 5 · Rich rows: each result row carries a small item-slot-sized thumbnail of its preview; the
 *  right side is a large stage over a key / value summary and the outline. */
function RichRows() {
  return (
    <WindowBody className="flex" style={{ gap: px(6) }}>
      <Tabs orientation="vertical" defaultValue="All" className="flex-row">
        <NavList style={{ width: px(84) }}>
          {["All", "Components", "Recipes", "Guides"].map((s) => (
            <NavItem key={s} value={s}>
              {s}
            </NavItem>
          ))}
        </NavList>
      </Tabs>
      <div className="flex min-w-0 flex-1 flex-col" style={{ gap: px(6) }}>
        <Field />
        <div className="flex min-h-0 flex-1" style={{ gap: px(6) }}>
          <ScrollArea style={{ width: px(250), height: "100%" }}>
            <List>
              {RESULTS.map((p) => (
                <ListItem key={p.route} selected={p === ACTIVE}>
                  <ListItemMedia>
                    <span className="osrs-well flex items-center justify-center overflow-hidden" style={{ width: px(36), height: px(32) }}>
                      {p.previews[0] ? <PreviewImage page={p.previews[0]} /> : null}
                    </span>
                  </ListItemMedia>
                  <ListItemContent className="min-w-0">
                    <ListItemTitle>{p.title}</ListItemTitle>
                    <ListItemDescription className="truncate">{p.summary}</ListItemDescription>
                  </ListItemContent>
                </ListItem>
              ))}
            </List>
          </ScrollArea>
          <div className="flex min-w-0 flex-1 flex-col" style={{ gap: px(6) }}>
            <Stage page={ACTIVE} height={130} />
            <DescriptionList striped>
              <DescriptionItem label="Page">{ACTIVE.title}</DescriptionItem>
              <DescriptionItem label="Section">{ACTIVE.section}</DescriptionItem>
              <DescriptionItem label="Sections">{ACTIVE.outline.length}</DescriptionItem>
            </DescriptionList>
            <Outline page={ACTIVE} />
          </div>
        </div>
      </div>
    </WindowBody>
  );
}


// ---- Round 2: from #5. The search field is the window's header; results are plain rows (title and
// summary, no thumbnails, no side nav); the right side is the result drawn as a page, framed like
// Notion's page card, with the component front and centre like Framer's.

/** The window with the search field as its header: the field across the top, the close button after it. */
function SearchWindow({ children }: { children: React.ReactNode }) {
  return (
    <Window frame="rivets" style={{ width: W, height: H }}>
      <WindowHeader className="osrs-search-header" end={<WindowClose />} start={<Input readOnly value={QUERY} aria-label="Search" style={{ width: px(W - 60), height: px(24) }} />} />
      {children}
    </Window>
  );
}
const Results = () => (
  <ScrollArea style={{ width: px(250), height: "100%", flex: "none" }}>
    <Rows />
  </ScrollArea>
);
const Sections = ({ page, bands = false }: { page: Entry; bands?: boolean }) =>
  bands ? (
    <div className="flex flex-col" style={{ gap: px(4) }}>
      {page.outline
        .filter((o) => o.depth === 0)
        .slice(0, 4)
        .map((o) => (
          <div key={o.text} className="osrs-section-title" style={{ textAlign: "left", paddingLeft: px(6) }}>
            {o.text}
          </div>
        ))}
    </div>
  ) : (
    <Outline page={page} />
  );
const Title = ({ page, big = false }: { page: Entry; big?: boolean }) => (
  <>
    <span style={{ color: "#c8b28c" }}>{page.section}</span>
    <span className="osrs-text-bold" style={{ color: "var(--osrs-white)", fontSize: big ? px(24) : undefined, lineHeight: big ? 1.1 : undefined }}>
      {page.title}
    </span>
    <span className="truncate">{page.description}</span>
  </>
);
const Preview = ({ page, height }: { page: Entry; height: number }) => (
  <div className="flex items-center justify-center" style={{ height: px(height), flex: "none", background: "rgb(0 0 0 / 0.32)", boxShadow: "inset 0 0 0 1px #1f1a14" }}>
    {page.previews[0] ? <PreviewImage page={page.previews[0]} /> : null}
  </div>
);

/** 6 · Page card: the result as a page in the thin tan frame (Notion's card): a cover band holding
 *  the component, then title, description and the outline. */
function PageCard() {
  return (
    <SearchWindow>
      <WindowBody className="flex" style={{ gap: px(8) }}>
        <Results />
        <div className="osrs-framed osrs-frame-tan-border flex min-w-0 flex-1 flex-col overflow-hidden" style={{ padding: px(10), gap: px(4), background: "rgb(0 0 0 / 0.12)" }}>
          <Preview page={ACTIVE} height={130} />
          <div className="flex flex-col" style={{ gap: px(2), marginTop: px(4) }}>
            <Title page={ACTIVE} big />
          </div>
          <Sections page={ACTIVE} />
        </div>
      </WindowBody>
    </SearchWindow>
  );
}

/** 7 · Page window: the result as a small window of its own (the docs page is one): its title in a
 *  header bar, the component in the body, the sections as Settings bands. */
function PageWindow() {
  return (
    <SearchWindow>
      <WindowBody className="flex" style={{ gap: px(8) }}>
        <Results />
        <Window frame="tan" className="min-w-0 flex-1" style={{ height: "100%" }}>
          <WindowHeader>{ACTIVE.title}</WindowHeader>
          <WindowBody className="flex flex-col overflow-hidden" style={{ gap: px(6) }}>
            <span className="truncate text-center">{ACTIVE.description}</span>
            <Preview page={ACTIVE} height={120} />
            <Sections page={ACTIVE} bands />
          </WindowBody>
        </Window>
      </WindowBody>
    </SearchWindow>
  );
}

/** 8 · Cover page (closest to Notion): the component fills a cover across the top of the page card,
 *  the big title sits under it, and the sections are an outline with chevrons like Notion's toggles. */
function CoverPage() {
  return (
    <SearchWindow>
      <WindowBody className="flex" style={{ gap: px(8) }}>
        <Results />
        <div className="osrs-well flex min-w-0 flex-1 flex-col overflow-hidden" style={{ padding: 0 }}>
          <Preview page={ACTIVE} height={150} />
          <div className="flex flex-col" style={{ gap: px(4), padding: px(10) }}>
            <Title page={ACTIVE} big />
            <div className="flex flex-col" style={{ gap: px(3), marginTop: px(4) }}>
              {ACTIVE.outline.slice(0, 5).map((o) => (
                <span key={o.text} className="flex items-center" style={{ gap: px(4), paddingLeft: px(o.depth * 12) }}>
                  <chevronSprites.yellowRightSingle style={{ width: px(8), height: px(8) }} />
                  {o.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </WindowBody>
    </SearchWindow>
  );
}

/** 9 · Mini page: the docs page itself in miniature, framed: large title, the Preview / Code panel
 *  under it with the component, then each section as the page's band. */
function MiniPage() {
  return (
    <SearchWindow>
      <WindowBody className="flex" style={{ gap: px(8) }}>
        <Results />
        <div className="osrs-framed osrs-frame-tan-border flex min-w-0 flex-1 flex-col overflow-hidden" style={{ padding: px(12), gap: px(6) }}>
          <Title page={ACTIVE} big />
          <Tabs variant="panel" defaultValue="preview">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="flex items-center justify-center" style={{ height: px(100) }}>
              {ACTIVE.previews[0] ? <PreviewImage page={ACTIVE.previews[0]} /> : null}
            </TabsContent>
          </Tabs>
          <Sections page={ACTIVE} bands />
        </div>
      </WindowBody>
    </SearchWindow>
  );
}

/** 10 · Stage with page card (Framer + Notion): the component large on a stone stage filling the
 *  right side, and the page as a framed card along the stage's foot: title, description, sections. */
function StagePage() {
  return (
    <SearchWindow>
      <WindowBody className="flex" style={{ gap: px(8) }}>
        <Results />
        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden" style={{ background: "rgb(0 0 0 / 0.32)", boxShadow: "inset 0 0 0 1px #1f1a14" }}>
          <div className="flex flex-1 items-center justify-center">{ACTIVE.previews[0] ? <PreviewImage page={ACTIVE.previews[0]} /> : null}</div>
          <div className="osrs-framed osrs-frame-tan-border flex flex-col" style={{ margin: px(8), padding: px(10), gap: px(4), background: "var(--osrs-stone)" }}>
            <Title page={ACTIVE} />
            <span style={{ color: "#c8b28c" }}>{ACTIVE.outline.map((o) => o.text).join(" · ")}</span>
          </div>
        </div>
      </WindowBody>
    </SearchWindow>
  );
}

const LAYOUTS: Record<string, [string, () => React.ReactNode]> = {
  "1": ["Search - Collection Log", CollectionLog],
  "2": ["Search - Page", PageSheet],
  "3": ["Search - Stage", StageFirst],
  "4": ["Search - Cards", CardGrid],
  "5": ["Search - Rich rows", RichRows],
  "6": ["", PageCard],
  "7": ["", PageWindow],
  "8": ["", CoverPage],
  "9": ["", MiniPage],
  "10": ["", StagePage],
};

export default function SearchLayouts() {
  const [v, setV] = React.useState<string | null>(null);
  React.useEffect(() => setV(new URLSearchParams(window.location.search).get("v") ?? "1"), []);
  if (!v) return <div style={{ width: 1, height: 1 }} />;
  const [title, Body] = LAYOUTS[v] ?? LAYOUTS["1"];
  return (
    <div className="osrs osrs-text" data-preview={`search-${v}`} style={{ ["--osrs-px" as string]: "1px", padding: 24 }}>
      {/* round 2 layouts draw their own window, with the search field as its header */}
      {title ? (
        <Window frame="rivets" style={{ width: W, height: H }}>
          <WindowHeader end={<WindowClose />}>{title}</WindowHeader>
          <Body />
        </Window>
      ) : (
        <Body />
      )}
    </div>
  );
}
