"use client";
import * as React from "react";

import { AgentControlBar } from "@/components/livekit/agent-control-bar/agent-control-bar";
import { useChat } from "@livekit/components-react";
import { ChatMessageView } from "./livekit/chat/chat-message-view";

export default function SessionView() {
  const chat = useChat();
  const [chatOpen, setChatOpen] = React.useState(false);
  return (
    <main>
      <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
        <div className="flex items-center justify-between">
          {chatOpen && <ChatMessageView messages={chat.chatMessages} />}
        </div>
        <div className="flex items-center justify-center min-h-[200px] relative">
          <AgentControlBar
            onSendMessage={chat.send}
            onChatOpenChange={setChatOpen}
          />
        </div>
      </div>
    </main>
  );
}
