'use client';

import * as React from 'react';
import { Room, RoomEvent } from 'livekit-client';
import { toast } from 'sonner';
import { RoomAudioRenderer, RoomContext, StartAudio } from '@livekit/components-react';
import SessionView from '@/components/session-view';
import { Toaster } from '@/components/ui/sonner';
import { Welcome } from '@/components/welcome';
import useConnectionDetails from '@/hooks/useConnectionDetails';

export default function Home() {
  const [sessionStarted, setSessionStarted] = React.useState(false);

  const connectionDetails = useConnectionDetails();

  const room = React.useMemo(() => new Room(), []);

  React.useEffect(() => {
    const onDisconnected = () => {
      setSessionStarted(false);
    };
    const onMediaDevicesError = (error: Error) => {
      toast('Encountered an error with your media devices', {
        description: `${error.name}: ${error.message}`,
        action: {
          label: 'Retry',
          onClick: () => setSessionStarted(false),
        },
      });
    };
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);
    room.on(RoomEvent.Disconnected, onDisconnected);
    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
    };
  }, [room]);

  React.useEffect(() => {
    if (sessionStarted && room.state === 'disconnected' && connectionDetails) {
      Promise.all([
        // TODO: enable preconnect audio once released
        room.localParticipant.setMicrophoneEnabled(true),
        room.connect(connectionDetails.serverUrl, connectionDetails.participantToken),
      ]).catch((error) => {
        toast('There was an error connecting to the agent', {
          description: `${error.name}: ${error.message}`,
          action: {
            label: 'Retry',
            onClick: () => setSessionStarted(false),
          },
        });
      });
    }
    return () => {
      room.disconnect();
    };
  }, [room, sessionStarted, connectionDetails]);

  return (
    <div className="flex min-h-svh flex-col justify-center">
      {sessionStarted ? (
        <RoomContext.Provider value={room}>
          <SessionView />
          <RoomAudioRenderer />
          <StartAudio label="Start Audio" />
        </RoomContext.Provider>
      ) : (
        <Welcome onStartCall={() => setSessionStarted(true)} />
      )}
      <Toaster />
    </div>
  );
}
