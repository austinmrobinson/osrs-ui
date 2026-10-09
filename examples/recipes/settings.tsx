import { Checkbox } from "@/registry/osrs/ui/checkbox";
import { Interface, InterfaceClose, InterfaceContent, InterfaceHeader, InterfaceTitle } from "@/registry/osrs/ui/interface";
import { RadioGroup, RadioGroupItem } from "@/registry/osrs/ui/radio-group";
import { Separator } from "@/registry/osrs/ui/separator";
import { Slider } from "@/registry/osrs/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/osrs/ui/tabs";

const px = (n: number) => `calc(${n} * var(--osrs-px))`;

function Row({ id, children, checked }: { id: string; children: React.ReactNode; checked?: boolean }) {
  return (
    <label htmlFor={id} className="flex items-center justify-between" style={{ padding: `${px(2)} 0` }}>
      <span>{children}</span>
      <Checkbox id={id} defaultChecked={checked} />
    </label>
  );
}

export default function SettingsRecipe() {
  return (
    <div className="osrs flex justify-center p-6">
      <Interface style={{ width: px(330), height: px(300) }}>
        <InterfaceHeader>
          <InterfaceTitle>Settings</InterfaceTitle>
          <InterfaceClose />
        </InterfaceHeader>
        <InterfaceContent>
          <Tabs defaultValue="controls" className="flex-1">
            <TabsList>
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
            </TabsList>
            <div className="osrs-well flex-1" style={{ padding: px(6), minHeight: px(200) }}>
              <TabsContent value="controls">
                <Row id="shift" checked>Shift click to drop items</Row>
                <Row id="esc">Esc closes the current interface</Row>
                <Row id="middle" checked>Middle mouse button rotates camera</Row>
                <Separator style={{ margin: `${px(4)} 0` }} />
                <span>Player 'Attack' options:</span>
                <RadioGroup defaultValue="right" style={{ marginTop: px(4) }}>
                  {[["right", "Right-click where stronger"], ["left", "Left-click where available"], ["hidden", "Hidden"]].map(([v, l]) => (
                    <label key={v} className="flex items-center" style={{ gap: px(4) }}>
                      <RadioGroupItem value={v} />
                      {l}
                    </label>
                  ))}
                </RadioGroup>
              </TabsContent>
              <TabsContent value="audio" className="flex flex-col" style={{ gap: px(8) }}>
                {["Music volume", "Sound effects", "Area sounds"].map((l, i) => (
                  <div key={l} className="flex flex-col" style={{ gap: px(2) }}>
                    <span>{l}</span>
                    <Slider defaultValue={[80, 50, 30][i]} />
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="display">
                <Row id="roofs" checked>Hide roofs</Row>
                <Row id="fps">Show FPS</Row>
                <Row id="xp" checked>XP drops</Row>
              </TabsContent>
            </div>
          </Tabs>
        </InterfaceContent>
      </Interface>
    </div>
  );
}
