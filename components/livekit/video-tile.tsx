import React from 'react';
import { motion } from 'motion/react';
import { VideoTrack } from '@livekit/components-react';
import { cn } from '@/lib/utils';

const MotionVideoTrack = motion.create(VideoTrack);

export const VideoTile = ({
  trackRef,
  className,
  ref,
}: React.ComponentProps<typeof VideoTrack>) => {
  return (
    <div className={cn('bg-muted overflow-hidden rounded-md', className)}>
      <MotionVideoTrack
        ref={ref}
        trackRef={trackRef}
        width={trackRef?.publication.dimensions?.width ?? 0}
        height={trackRef?.publication.dimensions?.height ?? 0}
        className={cn('h-full w-auto')}
      />
    </div>
  );
};
