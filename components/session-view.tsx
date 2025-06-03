'use client';

import * as React from 'react';
import { ReceivedChatMessage } from '@livekit/components-react';
import { AgentAudioTile } from '@/components/livekit/agent-audio-tile';
import { AgentControlBar } from '@/components/livekit/agent-control-bar/agent-control-bar';
import { ChatEntry } from '@/components/livekit/chat/chat-entry';
import { ChatMessageView } from '@/components/livekit/chat/chat-message-view';
import useChatAndTranscription from '@/hooks/useChatAndTranscription';
import { useDebugMode } from '@/hooks/useDebug';
import { cn } from '@/lib/utils';

export default function SessionView() {
  const [chatOpen, setChatOpen] = React.useState(false);
  const { messages, send } = useChatAndTranscription();

  useDebugMode();

  async function handleSendMessage(message: string) {
    await send(message);
  }

  return (
    <main>
      {chatOpen && (
        <ChatMessageView className="appear-fade-in mx-auto min-h-svh w-full max-w-2xl px-3 pt-56 pb-48 delay-300 duration-1000 ease-out md:px-0">
          <div className="space-y-3 whitespace-pre-wrap">
            {messages.map((message: ReceivedChatMessage) => (
              <ChatEntry
                key={message.id}
                entry={message}
                className="appear-fade-in duration-2000 ease-out"
              />
            ))}
          </div>
        </ChatMessageView>
      )}

      <div className="bg-background mp-12 fixed top-0 right-0 left-0 h-40">
        {/* skrim */}
        <div className="from-background absolute bottom-0 left-0 h-12 w-full translate-y-full bg-gradient-to-b to-transparent" />
      </div>

      <div
        className={cn(
          'bg-background fixed left-1/2 z-50 rounded-2xl border border-transparent p-8 transition-[left,top,transform,shadow,border] duration-500 ease-out',
          chatOpen ? 'border-border top-24 drop-shadow-2xl/3' : 'top-1/2'
        )}
        style={{
          transform: chatOpen
            ? 'translate(-50%, -50%) scale(0.4)'
            : 'translate(-50%, -50%) scale(1)',
        }}
      >
        <AgentAudioTile />
      </div>

      <div className="bg-background appear-from-bottom fixed right-0 bottom-0 left-0 z-50 px-3 pb-3 delay-300 duration-300 ease-out md:px-12 md:pb-12">
        <div className="relative mx-auto w-full max-w-2xl">
          <div
            aria-hidden={messages.length > 0}
            className={cn(
              'appear-fade-in absolute inset-x-0 -top-12 delay-600 duration-2000 ease-in',
              messages.length === 0 ? 'opacity-100' : '!opacity-0'
            )}
          >
            <p className="animate-text-gradient from-foreground/20 via-foreground to-foreground/20 mx-auto bg-gradient-to-r bg-clip-text text-center text-sm font-semibold text-transparent">
              Agent is listening, ask it a question
            </p>
          </div>

          <AgentControlBar onChatOpenChange={setChatOpen} onSendMessage={handleSendMessage} />
        </div>
        {/* skrim */}
        <div className="from-background border-background absolute top-0 left-0 h-12 w-full -translate-y-full border-b-8 bg-gradient-to-t to-transparent" />
      </div>
    </main>
  );
}
