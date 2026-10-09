import * as React from "react";

import { cn } from "@/lib/utils";
import { skillIcons, type SkillSpriteName } from "@/components/ui/skill-icons";

/** An XP drop: small skill icon(s) and the amount gained. */
function XpDrop({
  skills,
  amount,
  className,
  ...props
}: React.ComponentProps<"div"> & { skills: SkillSpriteName[]; amount: number }) {
  return (
    <div data-slot="xp-drop" className={cn("osrs-text flex items-center gap-[calc(2*var(--osrs-px))]", className)} style={{ color: "var(--osrs-white)" }} {...props}>
      {skills.map((s) => {
        const Icon = skillIcons[s];
        return <Icon key={s} style={{ width: "calc(17 * var(--osrs-px))", height: "calc(17 * var(--osrs-px))" }} />;
      })}
      <span>{amount.toLocaleString("en-US")}</span>
    </div>
  );
}

export { XpDrop };
