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
    <main className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
      <div className="flex items-center justify-between">
        {chatOpen && <ChatMessageView messages={messages} />}
      </div>
      <div className="flex items-center justify-center min-h-[200px] relative">
        <AgentAudioTile />
      </div>
      <div className="flex items-center justify-center min-h-[200px] relative">
        <AgentControlBar onSendMessage={send} onChatOpenChange={setChatOpen} />
      </div>
    </main>
  );
}
