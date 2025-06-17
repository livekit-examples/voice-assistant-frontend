import { forwardRef } from 'react';
import { TrackReference, VideoTrack } from '@livekit/components-react';

interface AgentAudioTileProps {
  videoTrack: TrackReference;
  className?: string;
}

export const AvatarTile = forwardRef<HTMLDivElement, AgentAudioTileProps>(
  ({ videoTrack, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        <VideoTrack
          trackRef={videoTrack}
          width={videoTrack?.publication.dimensions?.width ?? 0}
          height={videoTrack?.publication.dimensions?.height ?? 0}
          className="rounded-md"
        />
      </div>
    );
  }
);
