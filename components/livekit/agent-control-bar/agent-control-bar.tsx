"use client";

import * as React from "react";
import { Track } from "livekit-client";
import { Button } from "@/components/ui/button";
import {
  ChatTextIcon,
  PhoneDisconnectIcon,
} from "@phosphor-icons/react/dist/ssr";
import { TrackToggle } from "../track-toggle";
import { DeviceSelect } from "../device-select";
import { BarVisualizer } from "@livekit/components-react";
import { cn } from "@/lib/utils";
import {
  useAgentControlBar,
  UseAgentControlBarProps,
} from "./hooks/use-agent-control-bar";
import { Toggle } from "@/components/ui/toggle";
import { ChatInput } from "@/components/livekit/chat/chat-input";

export interface AgentControlBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    UseAgentControlBarProps {
  onSendMessage?: (message: string) => Promise<void>;
  onChatOpenChange?: (open: boolean) => void;
}

/**
 * A control bar specifically designed for voice assistant interfaces
 */
export function AgentControlBar({
  controls,
  saveUserChoices = true,
  onDeviceError,
  onSendMessage,
  onChatOpenChange,
  className,
  ...props
}: AgentControlBarProps) {
  const {
    visibleControls,
    micTrackRef,
    microphoneOnChange,
    handleDisconnect,
    handleDeviceChange,
    handleError,
  } = useAgentControlBar({
    controls,
    saveUserChoices,
    onDeviceError,
  });

  const [chatOpen, setChatOpen] = React.useState(false);
  const [isSendingMessage, setIsSendingMessage] = React.useState(false);

  const handleSendMessage = async (message: string) => {
    setIsSendingMessage(true);
    try {
      await onSendMessage?.(message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  React.useEffect(() => {
    onChatOpenChange?.(chatOpen);
  }, [chatOpen, onChatOpenChange]);

  return (
    <div
      className={cn(
        "flex flex-col rounded-md bg-background p-2.5 shadow-sm",
        className
      )}
      aria-label="Voice assistant controls"
      {...props}
    >
      {chatOpen && (
        <>
          <div className={`flex w-full overflow-hidden`}>
            <ChatInput
              className="w-full"
              onSend={handleSendMessage}
              disabled={isSendingMessage}
            />
          </div>
          <div className="w-full h-px bg-border mt-2 mb-2" />
        </>
      )}

      <div className="flex w-full gap-1">
        {visibleControls.microphone && (
          <div className="flex items-center gap-0">
            <TrackToggle
              className="border-r-0 rounded-r-none relative w-auto"
              source={Track.Source.Microphone}
            >
              <BarVisualizer
                className="w-auto h-full flex gap-0.5 items-center justify-center"
                trackRef={micTrackRef}
                barCount={5}
                options={{ minHeight: 5 }}
              >
                <span className="w-0.5 h-full data-lk-highlighted:bg-foreground data-lk-muted:bg-muted origin-center rounded-2xl"></span>
              </BarVisualizer>
            </TrackToggle>
            <DeviceSelect
              className="border-l-0 rounded-l-none"
              variant="small"
              kind="audioinput"
              onActiveDeviceChange={handleDeviceChange}
              onError={handleError}
            />
          </div>
        )}

        {visibleControls.chat && (
          <Toggle
            aria-label="Toggle chat"
            variant="outline"
            size="sm"
            pressed={chatOpen}
            onPressedChange={setChatOpen}
            className="h-full aspect-square"
          >
            <ChatTextIcon />
          </Toggle>
        )}

        {visibleControls.leave && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDisconnect}
            className="font-mono"
          >
            <PhoneDisconnectIcon />
            END CALL
          </Button>
        )}
      </div>
    </div>
  );
}
