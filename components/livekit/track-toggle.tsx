'use client';

import { Track } from 'livekit-client';
import { useTrackToggle } from '@livekit/components-react';
import {
  MicrophoneIcon,
  MicrophoneSlashIcon,
  MonitorArrowUpIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
} from '@phosphor-icons/react/dist/ssr';
import { Toggle } from '@/components/ui/toggle';

export type TrackToggleProps = React.ComponentProps<typeof Toggle> & {
  source: Parameters<typeof useTrackToggle>[0]['source'];
};

function getSourceIcon(source: Track.Source, enabled: boolean) {
  switch (source) {
    case Track.Source.Microphone:
      return enabled ? <MicrophoneIcon weight="bold" /> : <MicrophoneSlashIcon weight="bold" />;
    case Track.Source.Camera:
      return enabled ? <VideoCameraIcon weight="bold" /> : <VideoCameraSlashIcon weight="bold" />;
    case Track.Source.ScreenShare:
      return <MonitorArrowUpIcon weight="bold" />;
  }
}

export function TrackToggle({ source, ...props }: TrackToggleProps) {
  const { enabled, pending, toggle } = useTrackToggle({ source });
  const icon = getSourceIcon(source, enabled);

  return (
    <Toggle
      pressed={enabled}
      disabled={pending}
      aria-label={`Toggle ${source}`}
      onPressedChange={toggle}
      {...props}
    >
      {icon}
      {props.children}
    </Toggle>
  );
}
