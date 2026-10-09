import { Card, CardContent, CardHeader } from "@/registry/osrs/ui/card";

export default function CardDemo() {
  return (
    <div className="osrs osrs-texture-stone grid grid-cols-3 gap-[calc(6*var(--osrs-px))] p-6">
      <Card className="items-center text-center">
        <span className="osrs-text-small">Combat Level:</span>
        <span style={{ color: "var(--osrs-green)" }}>126</span>
      </Card>
      <Card variant="offer" style={{ minHeight: "calc(70 * var(--osrs-px))" }}>
        <CardHeader>Buy</CardHeader>
        <CardContent className="items-center justify-center">Offer card</CardContent>
      </Card>
      <Card variant="outline" className="items-center justify-center">Outline</Card>
    </div>
  );
}
