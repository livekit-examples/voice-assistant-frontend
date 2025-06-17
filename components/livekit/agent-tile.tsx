import { forwardRef } from 'react';
import { AgentState, BarVisualizer, TrackReference } from '@livekit/components-react';
import { cn } from '@/lib/utils';

interface AgentAudioTileProps {
  state: AgentState;
  audioTrack: TrackReference;
  className?: string;
}

export const AgentTile = forwardRef<HTMLDivElement, AgentAudioTileProps>(
  ({ state, audioTrack, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        <BarVisualizer
          barCount={5}
          state={state}
          options={{ minHeight: 5 }}
          trackRef={audioTrack}
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
      </div>
    );
  }
);
