// Done / not done marks, as in Bank settings and Ironman setup.
import { StatusIcon } from "@/registry/osrs/ui/status-icon";

export default function StatusIconDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex flex-col gap-[calc(4*var(--osrs-px))] p-6">
      {[
        [true, "You have a Bank PIN."],
        [true, "Two-factor authentication is on."],
        [false, "No recovery delay set."],
      ].map(([ok, label]) => (
        <div key={label as string} className="flex items-center gap-[calc(6*var(--osrs-px))]">
          <StatusIcon status={ok ? "done" : "failed"} />
          <span style={{ color: ok ? "var(--osrs-green)" : undefined }}>{label as string}</span>
        </div>
      ))}
    </div>
  );
}
