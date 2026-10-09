import { Button } from "@/registry/osrs/ui/button";
import { chevronSprites } from "@/registry/osrs/ui/chevron-sprites";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/registry/osrs/ui/dropdown-menu";
import { SplitButton } from "@/registry/osrs/ui/split-button";

export default function SplitButtonDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex p-6">
      <SplitButton className="w-[calc(200*var(--osrs-px))]">
        <Button>Withdraw all</Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button size="icon" aria-label="Withdraw a tab" />}>
            <chevronSprites.yellowDownSingle />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Tab 1</DropdownMenuItem>
            <DropdownMenuItem>Tab 2</DropdownMenuItem>
            <DropdownMenuItem>Tab 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SplitButton>
    </div>
  );
}
