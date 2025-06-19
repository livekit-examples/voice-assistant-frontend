import { CodeBlockIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/ui/button';

interface WelcomeProps {
  disabled: boolean;
  startButtonText: string;
  onStartCall: () => void;
}

export const Welcome = ({
  disabled,
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeProps) => {
  return (
    <div
      ref={ref}
      inert={disabled}
      className="fixed inset-0 z-10 mx-auto flex h-svh flex-col items-center justify-center text-center"
    >
      <CodeBlockIcon size={64} className="mx-auto mb-4" />
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
          Voice AI quickstart
        </a>
        .
      </p>
      <Button variant="primary" size="lg" onClick={onStartCall} className="mt-12 w-64 font-mono">
        {startButtonText}
      </Button>
    </div>
  );
};
