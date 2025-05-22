import {
  useTrackTranscription,
  useVoiceAssistant,
} from "@livekit/components-react";
import { useMemo } from "react";
import useLocalMicTrack from "@/hooks/useLocalMicTrack";
import { CombinedTranscription } from "@/lib/types";

export default function useCombinedTranscriptions(): CombinedTranscription[] {
  const { agentTranscriptions } = useVoiceAssistant();

  const micTrackRef = useLocalMicTrack();
  const { segments: userTranscriptions } = useTrackTranscription(micTrackRef);

  const combinedTranscriptions = useMemo(() => {
    return [
      ...agentTranscriptions.map((val) => {
        return { ...val, role: "assistant" } as CombinedTranscription;
      }),
      ...userTranscriptions.map((val) => {
        return { ...val, role: "user" } as CombinedTranscription;
      }),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
  }, [agentTranscriptions, userTranscriptions]);

  return combinedTranscriptions;
}
