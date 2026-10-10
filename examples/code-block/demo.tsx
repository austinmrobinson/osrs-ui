import { CodeBlock, CopyButton } from "@/registry/osrs/ui/code-block";

export default function CodeBlockDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text flex w-full flex-col gap-[calc(8*var(--osrs-px))] p-6">
      <CodeBlock copyLabel="Copy the install command">npx shadcn@latest add https://osrsui.com/r/button.json</CodeBlock>
      <span className="flex items-center gap-[calc(4*var(--osrs-px))]">
        Bank PIN hint <CopyButton value="Remember your PIN" label="Copy the hint" />
      </span>
    </div>
  );
}
