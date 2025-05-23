'use client';

import * as React from 'react';
import { type ReceivedChatMessage } from '@livekit/components-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChatEntry } from './chat-entry';
import { useAutoScroll } from './hooks/useAutoScroll';

export type ChatProps = React.HTMLAttributes<HTMLDivElement> & {
  messages: ReceivedChatMessage[];
};

export const ChatMessageView = ({ messages, className, ...props }: ChatProps) => {
  const scrollContentRef = React.useRef<HTMLDivElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  useAutoScroll(scrollAreaRef, scrollContentRef);

  return (
    <div className={cn('flex w-full max-w-2xl flex-col justify-end gap-2', className)} {...props}>
      <ScrollArea ref={scrollAreaRef}>
        <div ref={scrollContentRef} className="block space-y-3 whitespace-pre-wrap">
          {messages.map((message: ReceivedChatMessage) => (
            <ChatEntry key={message.id} entry={message} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
