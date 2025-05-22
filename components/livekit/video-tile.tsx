import { cn } from "@/lib/utils";
import { VideoTrack } from "@livekit/components-react";
import React from "react";

export function VideoTile({
  className,
  ...props
}: React.ComponentProps<typeof VideoTrack>) {
  /** we want object-contain by default to ensure what the user sees is what they broadcast */
  return (
    <VideoTrack
      className={cn("w-full h-full object-contain", className)}
      {...props}
    />
  );
}
