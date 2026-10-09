import * as React from "react";

import { cn } from "@/lib/utils";
import { px } from "@/lib/osrs";
import { statsSprites } from "@/components/ui/stats-sprites";
import { skillIcons, type SkillSpriteName } from "@/components/ui/skill-icons";

/** A stats-tab tile: skill icon, current level over base level. */
function SkillTile({
  skill,
  level,
  boosted,
  selected,
  className,
  style,
  ...props
}: React.ComponentProps<"button"> & { skill: Exclude<SkillSpriteName, "total">; level: number; boosted?: number; selected?: boolean }) {
  const Icon = skillIcons[skill];
  const Left = selected ? statsSprites.tileHalfLeftSelected : statsSprites.tileHalfLeft;
  const Right = selected ? statsSprites.tileHalfRightWithSlashSelected : statsSprites.tileHalfRightWithSlash;
  return (
    <button
      type="button"
      data-slot="skill-tile"
      aria-label={`${skill} level ${level}`}
      className={cn("osrs-skill-tile relative block border-0 bg-transparent p-0", className)}
      style={{ width: px(62), height: px(32), ...style }}
      {...props}
    >
      <Left className="absolute" style={{ left: px(-2), top: px(-2) }} />
      <Right className="absolute" style={{ left: px(28), top: px(-2) }} />
      <Icon className="absolute" style={{ left: px(3), top: px(4) }} />
      <span className="osrs-text osrs-text-small absolute" style={{ left: px(31), top: px(2), color: "var(--osrs-yellow)" }}>
        {boosted ?? level}
      </span>
      <span className="osrs-text osrs-text-small absolute" style={{ left: px(44), top: px(14), color: "var(--osrs-yellow)" }}>
        {level}
      </span>
    </button>
  );
}

/** The "Total level" tile that closes the stats grid. */
function TotalLevelTile({ total, className, style, ...props }: React.ComponentProps<"div"> & { total: number }) {
  return (
    <div
      data-slot="total-level-tile"
      className={cn("relative", className)}
      style={{ width: px(62), height: px(32), ...style }}
      {...props}
    >
      <statsSprites.tileHalfLeft className="absolute" style={{ left: px(-2), top: px(-2) }} />
      <statsSprites.tileHalfRight className="absolute" style={{ left: px(28), top: px(-2) }} />
      <span
        className="osrs-text osrs-text-small absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ color: "var(--osrs-yellow)", lineHeight: px(12) }}
      >
        <span>Total level:</span>
        <span>{total}</span>
      </span>
    </div>
  );
}

export { SkillTile, TotalLevelTile };
