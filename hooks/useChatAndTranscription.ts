import {
  useChat,
  useRoomContext,
  type ReceivedChatMessage,
} from "@livekit/components-react";
import { useMemo } from "react";
import useCombinedTranscriptions from "@/hooks/useCombinedTranscriptions";
import { transcriptionToChatMessage } from "@/lib/utils";

export default function useChatAndTranscription() {
  const combinedTranscriptions = useCombinedTranscriptions();
  const chat = useChat();
  const room = useRoomContext();

  const mergedTranscriptions = useMemo(() => {
    const merged: Array<ReceivedChatMessage> = [
      ...combinedTranscriptions.map((transcription) =>
        transcriptionToChatMessage(transcription, room)
      ),
      ...chat.chatMessages,
    ];
    return merged.sort((a, b) => a.timestamp - b.timestamp);
  }, [combinedTranscriptions, chat.chatMessages]);

  return { messages: mergedTranscriptions, send: chat.send };
}
