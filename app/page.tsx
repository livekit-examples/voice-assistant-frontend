"use client";

import * as React from "react";
import { Welcome } from "@/components/welcome";
import SessionView from "@/components/session-view";
import { Room, RoomEvent } from "livekit-client";
import {
  RoomAudioRenderer,
  RoomContext,
  StartAudio,
} from "@livekit/components-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import useConnectionDetails from "@/hooks/useConnectionDetails";

export default function Home() {
  const [sessionStarted, setSessionStarted] = React.useState(false);

  const connectionDetails = useConnectionDetails();

  const room = React.useMemo(() => {
    const r = new Room();
    r.on(RoomEvent.Disconnected, () => {
      setSessionStarted(false);
    });
    return r;
  }, []);

  React.useEffect(() => {
    if (sessionStarted && room.state === "disconnected" && connectionDetails) {
      Promise.all([
        // TODO: enable preconnect audio once released
        room.localParticipant.setMicrophoneEnabled(true),
        room.connect(
          connectionDetails.serverUrl,
          connectionDetails.participantToken
        ),
      ]).catch((error) => {
        toast("There was an error connecting to the agent", {
          description: error.message,
          action: {
            label: "Retry",
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
    <div className="flex flex-col h-svh">
      {sessionStarted ? (
        <RoomContext.Provider value={room}>
          <SessionView />
          <RoomAudioRenderer />‚
          <StartAudio label="Start Audio" />
        </RoomContext.Provider>
      ) : (
        <Welcome onStartCall={() => setSessionStarted(true)} />
      )}
      <Toaster />
    </div>
  );
}
