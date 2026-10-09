// Blume Card override: a notched OSRS card, optionally a link.
import * as React from "react";

import { cardVariants } from "@/registry/osrs/ui/card";

export default function Card({ title, href, children }: { title?: string; href?: string; icon?: unknown; children?: React.ReactNode }) {
  const className = `${cardVariants({ variant: "flat" })} osrs-site-card`;
  const body = (
    <>
      {title ? <span className="osrs-site-card-title">{title}</span> : null}
      {children ? <div className="osrs-site-card-body">{children}</div> : null}
    </>
  );
  return href ? (
    <a href={href} className={className} style={{ ["--osrs-px" as string]: "2px" }}>
      {body}
    </a>
  ) : (
    <div className={className} style={{ ["--osrs-px" as string]: "2px" }}>
      {body}
    </div>
  );
}
