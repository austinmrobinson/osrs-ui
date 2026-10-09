// MDX <IconList> / <IconListItem>: Skill Guide style rows (item icon, orange title, "Label: value"
// detail) built from the library List, with our pixel icons (pixel-icons/*.txt).
import * as React from "react";

import { List, ListItem, ListItemContent, ListItemDetail, ListItemIcon, ListItemTitle } from "@/registry/osrs/ui/list";
import { pixelIcons, type PixelIconName } from "./pixel-icons";

export function IconList({ children }: { children?: React.ReactNode }) {
  return (
    <List className="osrs-site-icon-list not-prose" style={{ ["--osrs-px" as string]: "1px" }}>
      {children}
    </List>
  );
}

export function IconListItem({
  icon,
  title,
  label,
  children,
}: {
  icon: PixelIconName;
  title: React.ReactNode;
  label?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const Icon = pixelIcons[icon];
  return (
    <ListItem>
      <ListItemIcon>{Icon ? <Icon /> : null}</ListItemIcon>
      <ListItemContent>
        <ListItemTitle>{title}</ListItemTitle>
        {children ? <ListItemDetail label={label}>{children}</ListItemDetail> : null}
      </ListItemContent>
    </ListItem>
  );
}

export default IconList;
