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
    <main className="relative flex min-h-[450px] flex-1 flex-col gap-4 p-12">
      <div className="flex min-h-[200px] flex-1 flex-col items-center justify-center">
        <AgentAudioTile />
        <p className="animate-text-gradient bg-gradient-to-r from-black via-[#ACACAC] to-black bg-clip-text text-center text-sm font-semibold text-transparent">
          Agent is listening, ask it a question
        </p>
      </div>
      {chatOpen && (
        <div className="flex items-center justify-center">
          <ChatMessageView messages={messages} />
        </div>
      )}
      <div className="flex items-center justify-center">
        <AgentControlBar
          onSendMessage={send}
          onChatOpenChange={setChatOpen}
          className="w-full max-w-2xl"
        />
      </div>
    </main>
  );
}
