import { Button } from "./ui/button";
import { CodeBlockIcon } from "@phosphor-icons/react/dist/ssr";

export function Welcome({ onStartCall }: { onStartCall: () => void }) {
  return (
    <div className="mx-auto text-center">
      <CodeBlockIcon size={64} weight="bold" className="mx-auto mb-4" />
      <h1 className="font-semibold">Voice Agent Quick Start</h1>
      <p className="font-medium pt-1 text-muted-foreground max-w-prose">
        Start a call to chat with your voice agent.
        <br />
        Need help getting set up? Check out the{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.livekit.io/agents/start/voice-ai/"
          className="underline underline-offset-4"
        >
          agent guide
        </a>
        .
      </p>
      <Button
        size="lg"
        onClick={onStartCall}
        className="font-bold font-mono mt-12 w-64"
      >
        START CALL
      </Button>
    </div>
  );
}
