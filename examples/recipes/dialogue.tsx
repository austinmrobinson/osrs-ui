"use client";

import * as React from "react";

import { NpcDialogue, OptionDialogue } from "@/registry/osrs/ui/chatbox";

const SCRIPT = [
  { name: "Hans", side: "left" as const, text: "Hello. What are you doing here?" },
  { name: "You", side: "right" as const, text: "I'm looking for whoever is in charge of this place." },
  { name: "Hans", side: "left" as const, text: "Who, the Duke? He's in his study, on the first floor." },
];

export default function DialogueRecipe() {
  const [step, setStep] = React.useState(0);
  const line = SCRIPT[step];
  return (
    <div className="osrs flex flex-col items-center p-6" style={{ gap: "calc(8 * var(--osrs-px))" }}>
      {line ? (
        <NpcDialogue name={line.name} side={line.side} onContinue={() => setStep((s) => s + 1)}>
          {line.text}
        </NpcDialogue>
      ) : (
        <OptionDialogue
          options={["Can you tell me how long I've been here?", "I'm looking for the Duke.", "Nothing, thanks."]}
          onSelect={() => setStep(0)}
        />
      )}
    </div>
  );
}
