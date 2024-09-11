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
  const [details, setDetails] = useState<any>(undefined);

  const handlePreJoinSubmit = useCallback(async () => {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT!,
      window.location.origin
    );
    const connectionDetailsResp = await fetch(url.toString());
    const connectionDetailsData = await connectionDetailsResp.json();
    console.log({ connectionDetailsData });

    setDetails(connectionDetailsData);
  }, []);

  const onDeviceFailure = (e?: MediaDeviceFailure) => {
    console.error(e);
    alert(
      "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
    );
  };

  return (
    <main data-lk-theme="default" className="">
      {details ? (
        <LiveKitRoom
          audio={true}
          token={details.participantToken}
          connect={shouldConnect}
          serverUrl={details.serverUrl}
          onMediaDeviceFailure={onDeviceFailure}
          onDisconnected={() => setShouldConnect(false)}
          className=""
        >
          <div className="">
            <SimpleVoiceAssistant />
          </div>
          <VoiceAssistantControlBar />
          <RoomAudioRenderer />
        </LiveKitRoom>
      ) : (
        <button className="lk-button" onClick={() => handlePreJoinSubmit()}>
          Connect
        </button>
      )}
    </main>
  );
}
