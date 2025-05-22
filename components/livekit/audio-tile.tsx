import { BarVisualizer, useVoiceAssistant } from "@livekit/components-react";
import { useEffect } from "react";

export default function AgentAudioTile() {
  const agent = useVoiceAssistant();

  useEffect(() => {
    console.log("agent.audioTrack", agent.audioTrack);
  }, [agent.audioTrack]);
  return (
    <BarVisualizer
      className="w-auto h-full flex gap-2 items-center justify-center"
      trackRef={agent.audioTrack}
      state={agent.state}
      barCount={5}
      options={{ minHeight: 5 }}
    >
      <span className="w-5 h-full data-lk-highlighted:bg-foreground data-lk-muted:bg-muted origin-center rounded-2xl"></span>
    </BarVisualizer>
  );
}
