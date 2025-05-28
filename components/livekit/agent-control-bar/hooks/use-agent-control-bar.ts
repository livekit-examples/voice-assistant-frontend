import * as React from 'react';
import { Track } from 'livekit-client';
import {
  useLocalParticipant,
  useLocalParticipantPermissions,
  usePersistentUserChoices,
  useRoomContext,
} from '@livekit/components-react';
import { usePublishPermissions } from './use-publish-permissions';

export interface UseAgentControlBarProps {
  controls?: {
    microphone?: boolean;
    screenShare?: boolean;
    chat?: boolean;
    camera?: boolean;
    leave?: boolean;
  };
  saveUserChoices?: boolean;
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
}

export function useAgentControlBar({
  controls,
  saveUserChoices = true,
  onDeviceError,
}: UseAgentControlBarProps) {
  const visibleControls = {
    leave: true,
    ...controls,
  };
  const { microphoneTrack, localParticipant } = useLocalParticipant();
  const publishPermissions = usePublishPermissions();
  const room = useRoomContext();

  const micTrackRef = React.useMemo(() => {
    return {
      participant: localParticipant,
      source: Track.Source.Microphone,
      publication: microphoneTrack,
    };
  }, [localParticipant, microphoneTrack]);

  visibleControls.microphone ??= publishPermissions.microphone;
  visibleControls.screenShare ??= publishPermissions.screenShare;
  visibleControls.camera ??= publishPermissions.camera;
  visibleControls.chat ??= publishPermissions.data;

  const { saveAudioInputEnabled, saveAudioInputDeviceId } = usePersistentUserChoices({
    preventSave: !saveUserChoices,
  });

  const microphoneOnChange = React.useCallback(
    (enabled: boolean, isUserInitiated: boolean) => {
      if (isUserInitiated) {
        saveAudioInputEnabled(enabled);
      }
    },
    [saveAudioInputEnabled]
  );

  const handleDisconnect = React.useCallback(() => {
    if (room) {
      room.disconnect();
    }
  }, [room]);

  const handleDeviceChange = React.useCallback(
    (deviceId: string) => {
      saveAudioInputDeviceId(deviceId ?? 'default');
    },
    [saveAudioInputDeviceId]
  );

  const handleError = React.useCallback(
    (error: Error) => {
      onDeviceError?.({ source: Track.Source.Microphone, error });
    },
    [onDeviceError]
  );

  return {
    visibleControls,
    micTrackRef,
    microphoneOnChange,
    handleDisconnect,
    handleDeviceChange,
    handleError,
  };
}
