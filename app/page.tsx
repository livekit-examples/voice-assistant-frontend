"use client";

import * as React from "react";
import { Welcome } from "@/components/welcome";
import SessionView from "@/components/session-view";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  const [callStarted, setCallStarted] = React.useState(false);

  const room = React.useMemo(() => new Room(), []);

  React.useEffect(() => {
    if (callStarted && room.state === "disconnected") {
      room
        .connect(
          process.env.NEXT_PUBLIC_LIVEKIT_URL,
          process.env.NEXT_PUBLIC_LIVEKIT_TOKEN
        )
        .catch((error) => {
          console.error("this should toast");
          toast("There was an error connecting to the agent", {
            description: error.message,
            action: {
              label: "Retry",
              onClick: () => setCallStarted(false),
            },
          });
        });
    }
    return () => {
      room.disconnect();
    };
  }, [room, callStarted]);

  return (
    <div className="flex flex-col h-svh">
      {/** TODO: Add a connecting state */}
      {callStarted ? (
        <RoomContext.Provider value={room}>
          <SessionView />
        </RoomContext.Provider>
      ) : (
        <Welcome onStartCall={() => setCallStarted(true)} />
      )}
      <Toaster />
    </div>
  );
}
