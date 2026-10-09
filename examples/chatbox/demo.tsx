import { Chatbox, ChatMessage } from "@/registry/osrs/ui/chatbox";

export default function ChatboxDemo() {
  return (
    <div className="osrs flex justify-center p-6">
      <Chatbox className="flex flex-col justify-end" style={{ width: "calc(300 * var(--osrs-px))", height: "calc(80 * var(--osrs-px))", padding: "calc(6 * var(--osrs-px)) calc(8 * var(--osrs-px))" }}>
        <ChatMessage>Welcome to Old School RuneScape.</ChatMessage>
        <ChatMessage color="#7f0000">The chatbox frame is a 9-slice, so it fits any size.</ChatMessage>
      </Chatbox>
    </div>
  );
}
