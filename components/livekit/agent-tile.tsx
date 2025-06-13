import { forwardRef } from 'react';
import { BarVisualizer, useVoiceAssistant } from '@livekit/components-react';
import { cn } from '@/lib/utils';
import { VideoTile } from './video-tile';

interface AgentAudioTileProps {
  className?: string;
}

export const AgentTile = forwardRef<HTMLDivElement, AgentAudioTileProps>(({ className }, ref) => {
  const agent = useVoiceAssistant();

  if (!agent) {
    return null;
  }

  return (
    <div ref={ref} className={className}>
      {agent.videoTrack ? (
        <VideoTile ref={ref} trackRef={agent.videoTrack} />
      ) : (
        <BarVisualizer
          barCount={5}
          state={agent.state}
          options={{ minHeight: 5 }}
          trackRef={agent.audioTrack}
          className={cn('flex aspect-video w-40 items-center justify-center gap-1')}
        >
          <span
            className={cn([
              'bg-muted min-h-4 w-4 rounded-full',
              'origin-center transition-colors duration-250 ease-linear',
              'data-[lk-highlighted=true]:bg-foreground data-[lk-muted=true]:bg-muted',
            ])}
          />
        </BarVisualizer>
      )}
    </div>
  );
});
