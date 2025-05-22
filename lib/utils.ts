import { clsx, type ClassValue } from "clsx";
import { Room, ParticipantKind } from "livekit-client";
import { ReceivedChatMessage } from "@livekit/components-react";
import { twMerge } from "tailwind-merge";
import { CombinedTranscription } from "./types";

export const THEME_STORAGE_KEY = "theme-mode";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transcriptionToChatMessage(
  transcription: CombinedTranscription,
  room: Room
): ReceivedChatMessage {
  return {
    id: transcription.id,
    timestamp: transcription.firstReceivedTime,
    message: transcription.text,
    from:
      transcription.role === "user"
        ? room.localParticipant
        : Array.from(room.remoteParticipants.values()).find(
            (p) => p.kind === ParticipantKind.AGENT
          ),
  };
}
