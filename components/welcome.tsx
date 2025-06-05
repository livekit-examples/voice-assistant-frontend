import { CodeBlockIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/ui/button';

interface WelcomeProps {
  startButtonText: string;
  onStartCall: () => void;
}

export function Welcome({ startButtonText, onStartCall }: WelcomeProps) {
  return (
    <div className="mx-auto flex h-svh flex-col items-center justify-center text-center">
      <CodeBlockIcon size={64} weight="bold" className="mx-auto mb-4" />
      <h1 className="font-semibold">Voice Agent Quick Start</h1>
      <p className="text-muted-foreground max-w-prose pt-1 font-medium">
        Start a call to chat with your voice agent.
        <br />
        Need help getting set up? Check out the{' '}
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
      <Button size="lg" onClick={onStartCall} className="mt-12 w-64 font-mono">
        {startButtonText}
      </Button>
    </div>
  );
}
