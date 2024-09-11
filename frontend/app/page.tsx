"use client";

import {
  LiveKitRoom,
  useToken,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
} from "@livekit/components-react";
import { useCallback, useMemo, useState } from "react";
import { MediaDeviceFailure } from "livekit-client";

function SimpleVoiceAssistant() {
  const { state, audioTrack } = useVoiceAssistant();
  return (
    <BarVisualizer
      state={state}
      barCount={7}
      trackRef={audioTrack}
      style={{ width: "75vw", height: "300px" }}
    />
  );
}

export default function Page() {
  const [shouldConnect, setShouldConnect] = useState(false);

  const handlePreJoinSubmit = useCallback(async () => {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT,
      window.location.origin
    );
    const connectionDetailsResp = await fetch(url.toString());
    const connectionDetailsData = await connectionDetailsResp.json();
  }, []);

  const onDeviceFailure = (e?: MediaDeviceFailure) => {
    console.error(e);
    alert(
      "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
    );
  };

  return (
    <main data-lk-theme="default" className="">
      <LiveKitRoom
        audio={true}
        token={token}
        connect={shouldConnect}
        serverUrl={}
        onMediaDeviceFailure={onDeviceFailure}
        onDisconnected={() => setShouldConnect(false)}
        className=""
      >
        <div className="">
          {shouldConnect ? (
            <SimpleVoiceAssistant />
          ) : (
            <button
              className="lk-button"
              onClick={() => setShouldConnect(true)}
            >
              Connect
            </button>
          )}
        </div>
        <VoiceAssistantControlBar />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </main>
  );
}
