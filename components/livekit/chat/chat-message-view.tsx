"use client";
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { type ReceivedChatMessage } from "@livekit/components-react";
import { cn } from "@/lib/utils";
import { ChatEntry } from "./chat-entry";
import { useAutoScroll } from "./hooks/useAutoScroll";

export type ChatProps = React.HTMLAttributes<HTMLDivElement> & {
  messages: ReceivedChatMessage[];
};

export const ChatMessageView = ({
  messages,
  className,
  ...props
}: ChatProps) => {
  const scrollContentRef = React.useRef<HTMLDivElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  useAutoScroll(scrollAreaRef, scrollContentRef);

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <ScrollArea
        ref={scrollAreaRef}
        className="h-[200px] w-[350px] rounded-md border p-4"
      >
        <span className="block whitespace-pre-wrap" ref={scrollContentRef}>
          {messages.map((message: ReceivedChatMessage) => (
            <ChatEntry key={message.id} entry={message} />
          ))}
        </span>
      </ScrollArea>
    </div>
  );
};
