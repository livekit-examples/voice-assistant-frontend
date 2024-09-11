"use client";

import {
  LiveKitRoom,
  useToken,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
} from "@livekit/components-react";

export function VoiceAssistant(props: { token: string }) {
  <LiveKitRoom
    audio={true}
    token={token}
    connect={shouldConnect}
    serverUrl={process.env.NEXT_PUBLIC_LK_SERVER_URL}
    onMediaDeviceFailure={onDeviceFailure}
    onDisconnected={() => setShouldConnect(false)}
    className=""
  >
    <div className="">
      {shouldConnect ? (
        <SimpleVoiceAssistant />
      ) : (
        <button className="lk-button" onClick={() => setShouldConnect(true)}>
          Connect
        </button>
      )}
    </div>
    <VoiceAssistantControlBar />
    <RoomAudioRenderer />
  </LiveKitRoom>;
}
