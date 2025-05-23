"use client";

import * as React from "react";

import { AgentControlBar } from "@/components/livekit/agent-control-bar/agent-control-bar";
import { ChatMessageView } from "@/components/livekit/chat/chat-message-view";
import { AgentAudioTile } from "@/components/livekit/agent-audio-tile";
import useChatAndTranscription from "@/hooks/useChatAndTranscription";

export default function SessionView() {
  const [chatOpen, setChatOpen] = React.useState(false);
  const { messages, send } = useChatAndTranscription();

  return (
    <main className="relative flex-1 flex flex-col gap-4 min-h-[450px] p-12">
      <div className="flex-1 flex flex-col items-center justify-center min-h-[200px]">
        <AgentAudioTile />
        <p className="text-transparent text-sm font-semibold bg-gradient-to-r from-black via-[#ACACAC] to-black bg-clip-text text-center animate-text-gradient">
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
          className="max-w-2xl w-full"
        />
      </div>
    </main>
  );
}
