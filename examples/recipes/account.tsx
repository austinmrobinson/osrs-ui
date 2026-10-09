"use client";

import { Button } from "@/registry/osrs/ui/button";
import { SidePanel, SidePanelContent } from "@/registry/osrs/ui/side-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/osrs/ui/tooltip";
import { glyphSprites } from "@/registry/osrs/ui/glyph-sprites";
import { BOTTOM_TABS, TOP_TABS } from "@/site/demo-data/game";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;

function AccountButton({ label, Icon }: { label: string; Icon: (typeof glyphSprites)[keyof typeof glyphSprites] }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="tile" tone="white" className="w-full justify-between" style={{ minHeight: px(26) }} />}>
        <Icon />
        {label}
        <Icon />
      </TooltipTrigger>
      <TooltipContent variant="interface" side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export default function AccountRecipe() {
  return (
    <div className="osrs flex justify-center p-6">
      <SidePanel top={TOP_TABS} bottom={BOTTOM_TABS} defaultValue="account">
        <SidePanelContent value="account" style={{ width: px(178) }}>
          <Tabs variant="panel" defaultValue="account">
            <TabsList>
              <TabsTrigger value="account" aria-label="Account"><glyphSprites.accountTabIcon /></TabsTrigger>
              <TabsTrigger value="community" aria-label="Community"><glyphSprites.communityTabIcon /></TabsTrigger>
              <TabsTrigger value="links" aria-label="Useful links"><glyphSprites.linksTabIcon /></TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="osrs-text flex flex-col items-center text-center" style={{ gap: px(4) }}>
              <span className="osrs-text-bold">Account</span>
              <span>Membership: 29 days left</span>
              <AccountButton label="Open Store" Icon={glyphSprites.storeIcon} />
              <AccountButton label="Bond Pouch" Icon={glyphSprites.bondIcon} />
              <span>Inbox: 4 unread messages</span>
              <AccountButton label="View Inbox" Icon={glyphSprites.inboxIcon} />
              <span>Name: Zezima</span>
              <AccountButton label="Name Changer" Icon={glyphSprites.nameChangerIcon} />
            </TabsContent>
            <TabsContent value="community" className="osrs-text osrs-text-bold text-center">Community</TabsContent>
            <TabsContent value="links" className="osrs-text osrs-text-bold text-center">Useful Links</TabsContent>
          </Tabs>
        </SidePanelContent>
      </SidePanel>
    </div>
  );
}
