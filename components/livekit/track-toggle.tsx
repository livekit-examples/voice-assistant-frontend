"use client";
import {
  Microphone,
  MicrophoneSlash,
  VideoCamera,
  VideoCameraSlash,
} from "phosphor-react";
import { Toggle } from "@/components/ui/toggle";
import { useTrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";

export type TrackToggleProps = React.ComponentProps<typeof Toggle> & {
  source: Track.Source;
};

export function TrackToggle(props: TrackToggleProps) {
  const { enabled, pending, toggle } = useTrackToggle({
    source: props.source,
  });
  const variant = props.variant || "outline";
  return (
    <Toggle
      variant={variant}
      aria-label={`Toggle ${props.source}`}
      onPressedChange={() => {
        console.log("toggle change");
        toggle();
      }}
      disabled={pending}
      {...props}
    >
      {enabled ? (
        props.source === Track.Source.Microphone ? (
          <Microphone />
        ) : (
          <VideoCamera />
        )
      ) : props.source === Track.Source.Microphone ? (
        <MicrophoneSlash />
      ) : (
        <VideoCameraSlash />
      )}
      {props.children}
    </Toggle>
  );
}
