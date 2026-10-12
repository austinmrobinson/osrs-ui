import { Chatbox, ChatboxInput, ChatboxMessages, ChatboxTabs, ChatMessage } from "@/registry/osrs/ui/chatbox";

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
      <Chatbox className="relative">
        <ChatboxMessages>
          <ChatMessage>Welcome to Old School RuneScape.</ChatMessage>
          <ChatMessage color="#0000ff" name="Zezima" nameColor="#000">buying gf 10k</ChatMessage>
          <ChatMessage color="#7f0000">You have a funny feeling like you&apos;re being followed.</ChatMessage>
          <ChatMessage color="#0000ff" name="Woox" nameColor="#000">gz on 99!</ChatMessage>
          <ChatMessage color="#7f0000">Congratulations, you&apos;ve just advanced your Cooking level. You are now level 99.</ChatMessage>
          <ChatMessage color="#7f007f" name="From B0aty" nameColor="#7f007f">see u at the duel arena</ChatMessage>
        </ChatboxMessages>
        <ChatboxInput name="Austin" />
      </Chatbox>
      <ChatboxTabs tabs={TABS} report defaultValue="all" />
    </div>
  );
}
