import { cache } from 'react';
import { type ClassValue, clsx } from 'clsx';
import { Room } from 'livekit-client';
import { twMerge } from 'tailwind-merge';
import type { ReceivedChatMessage, TextStreamData } from '@livekit/components-react';
import { APP_CONFIG } from '@/app-config';
import type { AppConfig, SandboxConfig } from './types';

export const THEME_STORAGE_KEY = 'theme-mode';
export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

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

// https://react.dev/reference/react/cache#caveats
// > React will invalidate the cache for all memoized functions for each server request.
export const getAppConfig = cache(async (): Promise<AppConfig> => {
  if (process.env.NEXT_PUBLIC_APP_CONFIG_ENDPOINT) {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_APP_CONFIG_ENDPOINT, window.location.origin);
      const response = await fetch(url.toString(), {
        cache: 'no-store',
      });
      const sandboxConfig: SandboxConfig = await response.json();

      return {
        ...APP_CONFIG,
        ...sandboxConfig,
      };
    } catch (error) {
      console.error('!!!', error);
    }
  }

  return APP_CONFIG;
});
