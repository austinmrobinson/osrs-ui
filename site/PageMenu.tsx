"use client";

// "On this page": the game's hamburger button at the right of the breadcrumb row (the menu sprite at
// 36px, its bars at their own size), opening the game's right-click menu: a black header strip, then
// white rows that turn yellow when pointed at, or while their section is the one being read. A
// Base UI menu, so it opens above the page in a portal, closes on a click outside or Escape, and
// takes the arrow keys.
import * as React from "react";
import { Menu } from "@base-ui/react/menu";

import { buttonSprites } from "@/registry/osrs/ui/button-sprites";
import { SpriteButton } from "@/registry/osrs/ui/sprite-button";

type Heading = { slug: string; text: string };

/** The section being read: the last heading above a line a little below the header. */
function useCurrentSection(headings: Heading[]) {
  const [current, setCurrent] = React.useState<string | null>(null);
  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let at: string | null = null;
      for (const h of headings) {
        const el = document.getElementById(h.slug);
        if (el && el.getBoundingClientRect().top <= 120) at = h.slug;
      }
      setCurrent(at ?? headings[0]?.slug ?? null);
    };
    const schedule = () => (frame ||= requestAnimationFrame(update));
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [headings]);
  return current;
}

export default function PageMenu({ headings }: { headings: Heading[] }) {
  const current = useCurrentSection(headings);
  return (
    // not modal: a modal menu locks the page scroll, and the scrollbar disappearing shifts the page
    <Menu.Root modal={false}>
      <Menu.Trigger
        data-silent=""
        render={
          <SpriteButton
            sprite={buttonSprites.menu}
            activeSprite={buttonSprites.menuSelected}
            size="md"
            slice={4}
            inset={4}
            fill={[17, 13]}
            aria-label="On this page"
            title="On this page"
            className="absolute top-1/2 right-0 -translate-y-1/2 [--osrs-px:1px]"
          />
        }
      />
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={2} className="z-50">
          <Menu.Popup className="osrs-menu osrs-text max-h-[70vh] min-w-[180px] overflow-y-auto text-start outline-none [--osrs-px:1px]">
            <p className="osrs-menu-header m-0">On this page</p>
            {headings.map((h) => (
              <Menu.Item
                key={h.slug}
                render={<a href={`#${h.slug}`} aria-current={h.slug === current ? "location" : undefined} />}
                className="osrs-menu-item block py-px text-rs-white no-underline outline-none hover:text-rs-yellow data-highlighted:text-rs-yellow aria-[current=location]:text-rs-yellow"
              >
                {h.text}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
