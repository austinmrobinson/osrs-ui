import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";

export default function TabsDemo() {
  return (
    <div className="osrs osrs-texture-stone p-6">
      <Tabs defaultValue="bosses" className="osrs-text mx-auto w-[calc(220*var(--osrs-px))]">
        <TabsList>
          <TabsTrigger value="bosses">Bosses</TabsTrigger>
          <TabsTrigger value="raids">Raids</TabsTrigger>
          <TabsTrigger value="clues">Clues</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
        <div className="osrs-well min-h-[calc(60*var(--osrs-px))] p-[calc(6*var(--osrs-px))]">
          <TabsContent value="bosses">Abyssal Sire, Alchemical Hydra, Araxxor…</TabsContent>
          <TabsContent value="raids">Chambers of Xeric, Theatre of Blood, Tombs of Amascut</TabsContent>
          <TabsContent value="clues">Beginner, Easy, Medium, Hard, Elite, Master</TabsContent>
          <TabsContent value="other">Miscellaneous</TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
