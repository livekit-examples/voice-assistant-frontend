'use client';

import * as React from 'react';
import { Track } from 'livekit-client';
import { BarVisualizer } from '@livekit/components-react';
import { ChatTextIcon, PhoneDisconnectIcon } from '@phosphor-icons/react/dist/ssr';
import { ChatInput } from '@/components/livekit/chat/chat-input';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { DeviceSelect } from '../device-select';
import { TrackToggle } from '../track-toggle';
import { UseAgentControlBarProps, useAgentControlBar } from './hooks/use-agent-control-bar';

export interface AgentControlBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    UseAgentControlBarProps {
  capabilities: AppConfig['capabilities'];
  onSendMessage?: (message: string) => Promise<void>;
  onChatOpenChange?: (open: boolean) => void;
}

/**
 * A control bar specifically designed for voice assistant interfaces
 */
export function AgentControlBar({
  controls,
  saveUserChoices = true,
  capabilities,
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
      className={cn(
        'bg-background flex flex-col rounded-[31px] p-3 shadow-[0_0_4px_rgba(0,0,0,0.05)] drop-shadow-md/3',
        className
      )}
      {...props}
    >
      {capabilities.suportsChatInput && (
        <div
          inert={!chatOpen}
          className={cn(
            'overflow-hidden transition-[height] duration-300 ease-out',
            chatOpen ? 'h-[57px]' : 'h-0'
          )}
        >
          <div className="flex h-8 w-full">
            <ChatInput onSend={handleSendMessage} disabled={isSendingMessage} className="w-full" />
          </div>
          <hr className="my-3" />
        </div>
      )}

      <div className="flex flex-row justify-between gap-1">
        <div className="flex gap-1">
          {visibleControls.microphone && (
            <div className="flex items-center gap-0">
              <TrackToggle
                variant="primary"
                source={Track.Source.Microphone}
                className="peer/track group/track relative w-auto pr-3 pl-3 md:rounded-r-none md:border-r-0 md:pr-1"
              >
                <BarVisualizer
                  barCount={5}
                  trackRef={micTrackRef}
                  options={{ minHeight: 5 }}
                  className="flex h-full w-auto items-center justify-center gap-0.5"
                >
                  <span
                    className={cn([
                      'h-full w-0.5 origin-center rounded-2xl',
                      'group-data-[state=on]/track:bg-fg1 group-data-[state=off]/track:bg-destructive-foreground',
                      'data-lk-muted:bg-muted',
                    ])}
                  ></span>
                </BarVisualizer>
              </TrackToggle>
              <DeviceSelect
                size="sm"
                kind="audioinput"
                onError={handleError}
                onActiveDeviceChange={handleDeviceChange}
                className={cn([
                  'peer-data-[state=off]/track:text-destructive-foreground',
                  'hover:text-fg1 focus:text-fg1',
                  'hover:peer-data-[state=off]/track:text-destructive-foreground focus:peer-data-[state=off]/track:text-destructive-foreground',
                  'hidden rounded-l-none md:block',
                ])}
              />
            </div>
          )}

          {capabilities.suportsVideoInput && visibleControls.camera && (
            <div className="flex items-center gap-0">
              <TrackToggle
                variant="primary"
                source={Track.Source.Camera}
                className="peer/track relative w-auto pr-3 pl-3 md:rounded-r-none md:border-r-0 md:pr-1"
              />
              <DeviceSelect
                size="sm"
                kind="videoinput"
                onError={handleError}
                onActiveDeviceChange={handleDeviceChange}
                className={cn([
                  'peer-data-[state=off]/track:text-destructive-foreground',
                  'hover:text-fg1 focus:text-fg1',
                  'hover:peer-data-[state=off]/track:text-destructive-foreground focus:peer-data-[state=off]/track:text-destructive-foreground',
                  'hidden rounded-l-none md:block',
                ])}
              />
            </div>
          )}

          {capabilities.suportsScreenShare && visibleControls.screenShare && (
            <div className="flex items-center gap-0">
              <TrackToggle
                variant="secondary"
                className="relative w-auto"
                source={Track.Source.ScreenShare}
              />
            </div>
          )}

          {visibleControls.chat && (
            <Toggle
              variant="secondary"
              aria-label="Toggle chat"
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
            <span className="hidden md:inline">END CALL</span>
            <span className="inline md:hidden">END</span>
          </Button>
        )}
      </div>
    </div>
  );
}
