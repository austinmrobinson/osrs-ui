// The footer: one line under the same bevelled divider as the header, expanding to the full Fan
// Content Policy statement and the credits. The collapsed line carries "not endorsed by or
// affiliated with Jagex", so the expanded text doesn't repeat it.
import { iconSprites } from "@/registry/osrs/ui/icon-sprites";
import { cx, dividerAbove, link } from "./styles";

export default function Footer() {
  return (
    <footer className={cx("osrs-text flex flex-col gap-1 px-5 py-4 text-rs-orange [--osrs-px:1px]", dividerAbove)}>
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <span>Unofficial fan content, not endorsed by or affiliated with Jagex.</span>
          <span className="inline-flex flex-none items-center gap-1.5 group-hover:text-rs-white">
            Credits
            <iconSprites.orangeDownArrow className="group-open:rotate-180" />
          </span>
        </summary>
        <div className="mt-2 flex flex-col gap-1.5">
          <p className="osrs-muted m-0">
            Created using intellectual property belonging to Jagex Limited under the terms of Jagex&apos;s Fan Content Policy.
          </p>
          <p className="osrs-muted m-0">The code is MIT; the traced art is Jagex&apos;s.</p>
          <p className="m-0">
            Made by <a className={link} href="https://github.com/austinmrobinson">Austin Robinson</a> · Fonts:{" "}
            <a className={link} href="https://github.com/RuneStar/fonts">RuneStar</a> (CC0) · Sprites:{" "}
            <a className={link} href="https://github.com/melkypie/resource-packs">melkypie/resource-packs</a> · Item icons and data:{" "}
            <a className={link} href="https://oldschool.runescape.wiki">OSRS Wiki</a> · Code font:{" "}
            <a className={link} href="https://departuremono.com">Departure Mono</a> by Helena Zhang (SIL OFL)
          </p>
        </div>
      </details>
    </footer>
  );
}
