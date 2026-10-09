// Blume Logo slot: the total-level icon and the site name in Bold 12.
import { TotalIcon } from "@/registry/osrs/ui/skill-icons";

export default function Logo({ site }: { site?: { title?: string } }) {
  return (
    <a href="/" className="osrs-text flex items-center gap-2" style={{ textDecoration: "none", fontFamily: "var(--osrs-font-bold)" }}>
      <TotalIcon scale={1} />
      <span style={{ fontSize: 16 }}>{site?.title ?? "OSRS UI"}</span>
    </a>
  );
}
