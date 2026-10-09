import { Step, Steps } from "@/registry/osrs/ui/steps";

export default function StepsDemo() {
  return (
    <div className="osrs osrs-texture-stone osrs-text w-full p-6">
      <Steps>
        <Step n={1} title="Talk to the Cook">
          He&apos;s in the kitchen of Lumbridge Castle.
        </Step>
        <Step n={2} title="Gather the ingredients">
          A bucket of milk, a pot of flour and an egg.
        </Step>
        <Step n={3} title="Bring them back">
          The Duke&apos;s birthday cake is saved.
        </Step>
      </Steps>
    </div>
  );
}
