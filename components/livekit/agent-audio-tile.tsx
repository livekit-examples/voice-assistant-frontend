import { useEffect } from 'react';
import { BarVisualizer, useVoiceAssistant } from '@livekit/components-react';
import { cn } from '@/lib/utils';

interface AgentAudioTileProps {
  className?: string;
}

export function AgentAudioTile({ className }: AgentAudioTileProps) {
  const agent = useVoiceAssistant();

  useEffect(() => {
    console.log('agent.state', agent.state);
  }, [agent.state]);

  return (
    <BarVisualizer
      trackRef={agent.audioTrack}
      state={agent.state}
      barCount={5}
      options={{ minHeight: 5 }}
      className={cn('flex h-[200px] items-center justify-center gap-4', className)}
    >
      <span
        className={cn([
          'bg-muted min-h-12 w-12 rounded-full',
          'origin-center transition-colors duration-250 ease-linear',
          'data-[lk-highlighted=true]:bg-foreground data-[lk-muted=true]:bg-muted',
        ])}
      />
    </BarVisualizer>
  );
}
