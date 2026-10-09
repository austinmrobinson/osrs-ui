// Blume Footer slot: credits as a chatbox game message.
import { Chatbox, ChatMessage } from "@/registry/osrs/ui/chatbox";

export default function Footer() {
  return (
    <footer className="mx-auto flex w-full justify-center px-4 py-8" style={{ ["--osrs-px" as string]: "1px" }}>
      <Chatbox className="flex w-full max-w-[1038px] flex-col justify-center" style={{ height: "auto", width: "100%", padding: "10px 14px" }}>
        <ChatMessage color="#7f0000">
          Created using intellectual property belonging to Jagex Limited under the terms of Jagex&apos;s Fan Content Policy. This content
          is not endorsed by or affiliated with Jagex.
        </ChatMessage>
        <ChatMessage>
          Fonts: <a href="https://github.com/RuneStar/fonts" style={{ color: "#0000ff" }}>RuneStar</a> (CC0) · Sprites:{" "}
          <a href="https://github.com/melkypie/resource-packs" style={{ color: "#0000ff" }}>melkypie/resource-packs</a> · Item icons:{" "}
          <a href="https://oldschool.runescape.wiki" style={{ color: "#0000ff" }}>OSRS Wiki</a>
        </ChatMessage>
      </Chatbox>
    </footer>
  );
}
