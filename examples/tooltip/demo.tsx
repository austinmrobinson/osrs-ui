import { Button } from "@/registry/osrs/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/osrs/ui/tooltip";

export default function TooltipDemo() {
  return (
    <div className="osrs osrs-texture-stone flex justify-center p-10">
      <Tooltip>
        <TooltipTrigger render={<Button />}>
          Hover me
        </TooltipTrigger>
        <TooltipContent>A highly polished stone button.</TooltipContent>
      </Tooltip>
    </div>
  );
}
