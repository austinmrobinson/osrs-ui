import { Chatbox, ChatboxTabs, ChatMessage } from "@/registry/osrs/ui/chatbox";
import { ScrollArea } from "@/registry/osrs/ui/scroll-area";

const TABS = [
  { value: "all", label: "All" },
  { value: "game", label: "Game", status: "Filtered", statusColor: "var(--osrs-yellow)" },
  { value: "public", label: "Public", status: "On" },
  { value: "private", label: "Private", status: "Friends", statusColor: "var(--osrs-yellow)" },
  { value: "channel", label: "Channel", status: "On" },
  { value: "clan", label: "Clan", status: "On" },
  { value: "trade", label: "Trade", status: "On" },
];

export default function ChatRecipe() {
  return (
    <div className="osrs flex flex-col items-center p-6">
      <Chatbox className="flex flex-col" style={{ padding: "calc(6 * var(--osrs-px)) calc(8 * var(--osrs-px))" }}>
        <ScrollArea className="flex-1">
          <div className="flex flex-col justify-end">
            <ChatMessage>Welcome to Old School RuneScape.</ChatMessage>
            <ChatMessage color="#0000ff" name="Zezima" nameColor="#000">buying gf 10k</ChatMessage>
            <ChatMessage color="#7f0000">You have a funny feeling like you're being followed.</ChatMessage>
            <ChatMessage color="#0000ff" name="Woox" nameColor="#000">gz on 99!</ChatMessage>
            <ChatMessage color="#7f0000">Congratulations, you've just advanced your Cooking level. You are now level 99.</ChatMessage>
            <ChatMessage color="#7f007f" name="From B0aty" nameColor="#7f007f">see u at the duel arena</ChatMessage>
            <ChatMessage>
              <span style={{ color: "#000" }}>Austin: </span>
              <span style={{ color: "#0000ff" }}>*</span>
            </ChatMessage>
          </div>
        </ScrollArea>
      </Chatbox>
      <ChatboxTabs tabs={TABS} defaultValue="all" />
    </div>
  );
}
