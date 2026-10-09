import { Button } from "@/registry/osrs/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTrigger } from "@/registry/osrs/ui/dialog";

export default function DialogDemo() {
  return (
    <div className="osrs osrs-texture-stone flex min-h-[calc(110*var(--osrs-px))] items-center justify-center p-6">
      <Dialog>
        <DialogTrigger render={<Button />}>Drop item</DialogTrigger>
        <DialogContent title="Are you sure?">
          <DialogDescription className="text-center">
            Drop <span className="text-[var(--osrs-menu-target)]">Abyssal whip</span>? It will appear on the floor for 60 seconds.
          </DialogDescription>
          <DialogFooter>
            <DialogClose render={<Button />}>Yes</DialogClose>
            <DialogClose render={<Button />}>No</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
