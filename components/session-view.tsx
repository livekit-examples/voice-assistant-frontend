'use client';

import * as React from 'react';
import { AgentAudioTile } from '@/components/livekit/agent-audio-tile';
import { AgentControlBar } from '@/components/livekit/agent-control-bar/agent-control-bar';
import { ChatMessageView } from '@/components/livekit/chat/chat-message-view';
import useChatAndTranscription from '@/hooks/useChatAndTranscription';

export default function SessionView() {
  const [chatOpen, setChatOpen] = React.useState(false);
  const { messages, send } = useChatAndTranscription();

  return (
    <main className="relative flex max-h-svh min-h-[450px] flex-1 flex-col items-center gap-4 overflow-y-hidden p-12">
      <div className="flex max-w-2xl flex-1 flex-col items-center justify-center">
        <AgentAudioTile className="h-[300px]" />
        {messages.length === 0 && (
          <p className="animate-text-gradient bg-gradient-to-r from-black via-[#ACACAC] to-black bg-clip-text text-center text-sm font-semibold text-transparent">
            Agent is listening, ask it a question
          </p>
        )}
      </div>
      {chatOpen && (
        <ChatMessageView
          messages={messages}
          className="min-h-[300px] w-full max-w-2xl flex-1 overflow-hidden"
        />
      )}
      <div className="w-full max-w-2xl shrink-0 grow-0">
        <AgentControlBar onSendMessage={send} onChatOpenChange={setChatOpen} />
      </div>
    </main>
  );
}
