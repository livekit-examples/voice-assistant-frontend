'use client';

import * as React from 'react';
import { Track } from 'livekit-client';
import { BarVisualizer } from '@livekit/components-react';
import { ChatTextIcon, PhoneDisconnectIcon } from '@phosphor-icons/react/dist/ssr';
import { ChatInput } from '@/components/livekit/chat/chat-input';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import { DeviceSelect } from '../device-select';
import { TrackToggle } from '../track-toggle';
import { UseAgentControlBarProps, useAgentControlBar } from './hooks/use-agent-control-bar';

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
    // microphoneOnChange,
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
      aria-label="Voice assistant controls"
      className={cn('bg-background flex flex-col rounded-md border p-3 shadow-md', className)}
      {...props}
    >
      {chatOpen && (
        <>
          <div className={`flex w-full overflow-hidden`}>
            <ChatInput onSend={handleSendMessage} disabled={isSendingMessage} className="w-full" />
          </div>
          <hr className="my-3" />
        </>
      )}
      <div className="flex flex-row justify-between gap-1">
        <div className="flex w-full gap-1">
          {visibleControls.microphone && (
            <div className="flex items-center gap-0">
              <TrackToggle
                className="peer relative w-auto rounded-r-none border-r-0"
                source={Track.Source.Microphone}
              >
                <BarVisualizer
                  className="flex h-full w-auto items-center justify-center gap-0.5"
                  trackRef={micTrackRef}
                  barCount={12}
                  options={{ minHeight: 5 }}
                >
                  <span className="data-lk-highlighted:bg-foreground data-lk-muted:bg-muted h-full w-0.5 origin-center rounded-2xl"></span>
                </BarVisualizer>
              </TrackToggle>
              <DeviceSelect
                className="peer-data-[state=on]:border-button-foreground rounded-l-none border-l-0"
                size="sm"
                kind="audioinput"
                onActiveDeviceChange={handleDeviceChange}
                onError={handleError}
              />
            </div>
          )}

          {visibleControls.camera && (
            <div className="flex items-center gap-0">
              <TrackToggle
                className="peer relative w-auto rounded-r-none border-r-0"
                source={Track.Source.Camera}
              />
              <DeviceSelect
                className="peer-data-[state=on]:border-button-foreground rounded-l-none border-l-0"
                size="sm"
                kind="videoinput"
                onActiveDeviceChange={handleDeviceChange}
                onError={handleError}
              />
            </div>
          )}

          {visibleControls.screenShare && (
            <div className="flex items-center gap-0">
              <TrackToggle className="relative w-auto" source={Track.Source.ScreenShare} />
            </div>
          )}

          {visibleControls.chat && (
            <Toggle
              aria-label="Toggle chat"
              variant="outline"
              pressed={chatOpen}
              onPressedChange={setChatOpen}
              className="aspect-square h-full"
            >
              <ChatTextIcon weight="bold" />
            </Toggle>
          )}
        </div>
        {visibleControls.leave && (
          <Button variant="destructive" onClick={handleDisconnect} className="font-mono">
            <PhoneDisconnectIcon weight="bold" />
            END CALL
          </Button>
        )}
      </div>
    </div>
  );
}
