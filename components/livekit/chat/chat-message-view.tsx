'use client';

import * as React from 'react';
import { type ReceivedChatMessage } from '@livekit/components-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChatEntry } from './chat-entry';
import { useAutoScroll } from './hooks/useAutoScroll';

interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: ReceivedChatMessage[];
  className?: string;
}

export const ChatMessageView = ({ messages, className, ...props }: ChatProps) => {
  const scrollContentRef = React.useRef<HTMLDivElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  useAutoScroll(scrollAreaRef, scrollContentRef);

  return (
    <div className={cn('relative', className)} {...props}>
      <div className="absolute inset-0">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div ref={scrollContentRef} className="block space-y-3 py-5 whitespace-pre-wrap">
            {messages.map((message: ReceivedChatMessage) => (
              <ChatEntry key={message.id} entry={message} />
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="from-background absolute top-0 left-0 h-5 w-full bg-gradient-to-b to-transparent" />
      <div className="from-background absolute bottom-0 left-0 h-5 w-full bg-gradient-to-t to-transparent" />
    </div>
  );
};
