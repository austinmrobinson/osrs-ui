import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/registry/osrs/ui/context-menu";

export default function ContextMenuDemo() {
  return (
    <div className="osrs p-6">
      <ContextMenu>
        <ContextMenuTrigger className="osrs-texture-stone osrs-text flex h-[calc(110*var(--osrs-px))] w-[calc(220*var(--osrs-px))] items-center justify-center">
          Right-click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem target="Bank booth">Bank</ContextMenuItem>
          <ContextMenuItem target="Bank booth">Collect</ContextMenuItem>
          <ContextMenuItem>Walk here</ContextMenuItem>
          <ContextMenuItem target="Bank booth">Examine</ContextMenuItem>
          <ContextMenuItem>Cancel</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
