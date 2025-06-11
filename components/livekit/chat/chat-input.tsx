import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps extends React.HTMLAttributes<HTMLFormElement> {
  onSend?: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, className, disabled, ...props }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onSubmit?.(e);
    onSend?.(message);
    setMessage('');
    inputRef.current?.focus();
  };

  const isDisabled = disabled || message.trim().length === 0;

  return (
    <form
      {...props}
      onSubmit={handleSubmit}
      className={cn('flex items-center gap-2 rounded-md pl-1 text-sm', className)}
    >
      <input
        ref={inputRef}
        type="text"
        className="flex-1 focus:outline-none"
        placeholder="Type something..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
      />
      <Button
        size="sm"
        type="submit"
        variant={isDisabled ? 'secondary' : 'primary'}
        disabled={isDisabled}
        className="font-mono"
      >
        SEND
      </Button>
    </form>
  );
}
