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
        <ChatMessageView className="mx-auto min-h-svh w-full max-w-2xl pt-56 pb-48">
          <div className="space-y-3 whitespace-pre-wrap">
            {messages.map((message: ReceivedChatMessage) => (
              <ChatEntry key={message.id} entry={message} />
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
          'fixed left-1/2 z-50 rounded-xl border border-transparent p-8 transition-[left,top,transform,shadow,border] duration-500 ease-out',
          chatOpen ? 'shadow-3xl border-border top-24 shadow-md' : 'top-1/2'
        )}
        style={{
          transform: chatOpen
            ? 'translate(-50%, -50%) scale(0.4)'
            : 'translate(-50%, -50%) scale(1)',
        }}
      >
        <AgentAudioTile />
      </div>

      <div className="bg-background fixed right-0 bottom-0 left-0 z-50 px-12 pb-12">
        <div className="mx-auto w-full max-w-2xl">
          {messages.length === 0 && (
            <p className="animate-text-gradient from-foreground/20 via-foreground to-foreground/20 mx-auto mb-6 bg-gradient-to-r bg-clip-text text-sm font-semibold text-transparent">
              Agent is listening, ask it a question
            </p>
          )}
          <AgentControlBar onChatOpenChange={setChatOpen} onSendMessage={handleSendMessage} />
        </div>
        {/* skrim */}
        <div className="from-background border-background absolute top-0 left-0 h-12 w-full -translate-y-full border-b-8 bg-gradient-to-t to-transparent" />
      </div>
    </main>
  );
}
