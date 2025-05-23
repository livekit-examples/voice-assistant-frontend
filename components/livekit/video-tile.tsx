import React from 'react';
import { VideoTrack } from '@livekit/components-react';
import { cn } from '@/lib/utils';

export function VideoTile({ className, ...props }: React.ComponentProps<typeof VideoTrack>) {
  /** we want object-contain by default to ensure what the user sees is what they broadcast */
  return <VideoTrack className={cn('h-full w-full object-contain', className)} {...props} />;
}
