import { BarVisualizer, useVoiceAssistant } from "@livekit/components-react";
import { useEffect } from "react";

export function AgentAudioTile() {
  const agent = useVoiceAssistant();

  useEffect(() => {
    console.log("agent.state", agent.state);
  }, [agent.state]);
  return (
    <BarVisualizer
      className="w-auto h-full flex gap-2 items-center justify-center"
      trackRef={agent.audioTrack}
      state={agent.state}
      barCount={5}
      options={{ minHeight: 5 }}
    >
      <span className="w-5 h-full bg-muted data-[lk-highlighted=true]:bg-foreground data-[lk-muted=true]:bg-muted origin-center rounded-2xl"></span>
    </BarVisualizer>
  );
}
