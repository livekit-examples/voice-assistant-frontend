import { forwardRef } from 'react';
import { VideoTrack, VoiceAssistant } from '@livekit/components-react';

interface AgentAudioTileProps {
  agent: VoiceAssistant;
  className?: string;
}

export const AvatarTile = forwardRef<HTMLDivElement, AgentAudioTileProps>(
  ({ agent, className }, ref) => {
    const { videoTrack } = agent;

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
