import { useEffect } from 'react';
import { BarVisualizer, useVoiceAssistant } from '@livekit/components-react';

export function AgentAudioTile() {
  const agent = useVoiceAssistant();

  useEffect(() => {
    console.log('agent.state', agent.state);
  }, [agent.state]);
  return (
    <BarVisualizer
      className="flex h-[200px] w-auto flex-1 items-center justify-center gap-4"
      trackRef={agent.audioTrack}
      state={agent.state}
      barCount={5}
      options={{ minHeight: 5 }}
    >
      <span className="bg-muted data-[lk-highlighted=true]:bg-foreground data-[lk-muted=true]:bg-muted min-h-12 w-12 origin-center rounded-full transition-colors duration-250 ease-linear"></span>
    </BarVisualizer>
  );
}
