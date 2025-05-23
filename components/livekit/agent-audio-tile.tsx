import { BarVisualizer, useVoiceAssistant } from "@livekit/components-react";
import { useEffect } from "react";

export function AgentAudioTile() {
  const agent = useVoiceAssistant();

  useEffect(() => {
    console.log("agent.state", agent.state);
  }, [agent.state]);
  return (
    <BarVisualizer
      className="flex-1 w-auto h-[200px] flex gap-4 items-center justify-center"
      trackRef={agent.audioTrack}
      state={agent.state}
      barCount={5}
      options={{ minHeight: 5 }}
    >
      <span className="w-12 min-h-12 bg-muted data-[lk-highlighted=true]:bg-foreground data-[lk-muted=true]:bg-muted origin-center rounded-full transition-colors duration-250 ease-linear"></span>
    </BarVisualizer>
  );
}
