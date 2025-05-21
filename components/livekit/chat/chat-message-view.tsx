"use client";
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { type ReceivedChatMessage } from "@livekit/components-react";
import { cn } from "@/lib/utils";
import { ChatEntry } from "./chat-entry";

export type ChatProps = React.HTMLAttributes<HTMLDivElement> & {
  messages: ReceivedChatMessage[];
};

export const ChatMessageView = ({
  messages,
  className,
  ...props
}: ChatProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
        {messages.map((message: ReceivedChatMessage) => (
          <ChatEntry key={message.id} entry={message} />
        ))}
      </ScrollArea>
    </div>
  );
};
