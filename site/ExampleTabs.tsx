"use client";

// The Preview / Code pane of a docs example (components/blume/Component.astro), drawn with the
// library's own Tabs (variant="panel", the Collection Log tabs). Both panels share one height,
// which Component.astro sets from the preview frame's reported height.
import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";
import { CopyButton } from "@/registry/osrs/ui/code-block";
import { cx, stage } from "./styles";

/** The panel is the Collection Log's content area: the window's stone a step darker (fixed, so it
 *  lines up with the page's), inside the tab's light edge (#5d5848) and a dark outline; 1px of
 *  padding keeps the preview frame inside the edge. */
const panel = cx(stage, "overflow-hidden bg-fixed p-px shadow-[inset_0_0_0_1px_#5d5848,0_0_0_1px_var(--color-rs-line)]");

export default function ExampleTabs({
  previewSrc,
  title,
  codeHtml,
  height,
  labels,
}: {
  previewSrc: string;
  title: string;
  codeHtml: string;
  height: number;
  labels: { preview: string; code: string };
}) {
  const codeRef = React.useRef<HTMLDivElement>(null);
  // controlled, with each panel's visibility set here: both panels stay mounted (the frame keeps
  // its state), and only the selected one is shown
  const [tab, setTab] = React.useState("preview");
  return (
    // the same stone tabs as the Assets page, at the search field's height; the selected tab sits
    // over the panel's top edge, so it opens into the panel
    <Tabs value={tab} onValueChange={(v) => setTab(String(v))} className="[--osrs-px:1px]" data-osrs-example="">
      <TabsList className="relative z-1 -mb-px items-end p-0 *:[[role=tab]]:h-[30px] *:[[role=tab]]:flex-none *:[[role=tab]]:px-4">
        <TabsTrigger value="preview">{labels.preview}</TabsTrigger>
        <TabsTrigger value="code">{labels.code}</TabsTrigger>
      </TabsList>
      <TabsContent
        value="preview"
        keepMounted
        className={cx("osrs-tabs-panel-body", panel)}
        data-osrs-example-panel=""
        style={{ height, display: tab === "preview" ? undefined : "none" }}
      >
        <iframe className="size-full" data-blume-example-frame="" loading="lazy" src={previewSrc} title={title} />
      </TabsContent>
      <TabsContent
        value="code"
        keepMounted
        className={cx("osrs-tabs-panel-body", panel)}
        data-osrs-example-panel=""
        style={{ height, display: tab === "code" ? undefined : "none" }}
      >
        <div className="relative h-full">
          {/* Shiki's markup, in the site's code colours (site/code-theme.ts) on the panel's fill */}
          <div
            ref={codeRef}
            className="h-full font-code text-rs-code text-shadow-none [&_pre]:m-0 [&_pre]:h-full [&_pre]:overflow-auto [&_pre]:py-3 [&_pre]:ps-4 [&_pre]:pe-12 [&_pre]:text-[color:var(--shiki-dark,var(--color-rs-white))] [&_span]:text-[color:var(--shiki-dark,inherit)]"
            // Shiki's own background is dropped so the panel's fill shows
            dangerouslySetInnerHTML={{ __html: codeHtml.replace(/background-color:[^;"]*;?/, "") }}
          />
          <CopyButton label="Copy code" value={() => codeRef.current?.innerText ?? ""} className="absolute top-1.5 right-2.5 z-2" />
        </div>
      </TabsContent>
    </Tabs>
  );
}
