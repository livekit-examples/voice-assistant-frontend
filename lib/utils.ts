import { clsx, type ClassValue } from "clsx";
import { Room } from "livekit-client";
import {
  ReceivedChatMessage,
  type TextStreamData,
} from "@livekit/components-react";
import { twMerge } from "tailwind-merge";

export const THEME_STORAGE_KEY = "theme-mode";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transcriptionToChatMessage(
  textStream: TextStreamData,
  room: Room
): ReceivedChatMessage {
  return {
    id: textStream.streamInfo.id,
    timestamp: textStream.streamInfo.timestamp,
    message: textStream.text,
    from:
      textStream.participantInfo.identity === room.localParticipant.identity
        ? room.localParticipant
        : Array.from(room.remoteParticipants.values()).find(
            (p) => p.identity === textStream.participantInfo.identity
          ),
  };
}
