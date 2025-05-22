import {
  useChat,
  useRoomContext,
  type ReceivedChatMessage,
  useTranscriptions,
  type TextStreamData,
} from "@livekit/components-react";
import { useMemo } from "react";

import { transcriptionToChatMessage } from "@/lib/utils";

export default function useChatAndTranscription() {
  const transcriptions: TextStreamData[] = useTranscriptions();
  const chat = useChat();
  const room = useRoomContext();

  const mergedTranscriptions = useMemo(() => {
    const merged: Array<ReceivedChatMessage> = [
      ...transcriptions.map((transcription) =>
        transcriptionToChatMessage(transcription, room)
      ),
      ...chat.chatMessages,
    ];
    return merged.sort((a, b) => a.timestamp - b.timestamp);
  }, [transcriptions, chat.chatMessages, room]);

  return { messages: mergedTranscriptions, send: chat.send };
}
