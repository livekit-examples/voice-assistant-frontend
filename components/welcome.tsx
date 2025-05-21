import { Button } from "./ui/button";
import { CodeBlock } from "@phosphor-icons/react/dist/ssr";

export function Welcome({ onStartCall }: { onStartCall: () => void }) {
  return (
    <div className="flex flex-col gap-4 h-full w-full mx-auto items-center justify-center">
      <CodeBlock size={64} />
      <h1 className="font-bold">Voice Agent Quick Start</h1>
      <p className="text-muted-foreground max-w-96 text-center">
        Start a call to chat with your voice agent. Need help getting set up?
        Check out the agent guide.
      </p>
      <Button className="font-mono" onClick={onStartCall}>
        START CALL
      </Button>
    </div>
  );
}
