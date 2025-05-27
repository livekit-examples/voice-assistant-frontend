'use client';

import { Track } from 'livekit-client';
import { useTrackToggle } from '@livekit/components-react';
import {
  MicrophoneIcon,
  MicrophoneSlashIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Toggle } from '@/components/ui/toggle';

export type TrackToggleProps = React.ComponentProps<typeof Toggle> & {
  source: Parameters<typeof useTrackToggle>[0]['source'];
};

export function TrackToggle(props: TrackToggleProps) {
  const { enabled, pending, toggle } = useTrackToggle({
    source: props.source,
  });
  const variant = props.variant || 'outline';
  return (
    <Toggle
      variant={variant}
      aria-label={`Toggle ${props.source}`}
      onPressedChange={() => {
        console.log('toggle change');
        toggle();
      }}
      disabled={pending}
      {...props}
    >
      {enabled ? (
        props.source === Track.Source.Microphone ? (
          <MicrophoneIcon weight="bold" />
        ) : (
          <VideoCameraIcon weight="bold" />
        )
      ) : props.source === Track.Source.Microphone ? (
        <MicrophoneSlashIcon weight="bold" />
      ) : (
        <VideoCameraSlashIcon weight="bold" />
      )}
      {props.children}
    </Toggle>
  );
}
