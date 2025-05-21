import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";

interface ChatInputProps extends React.HTMLAttributes<HTMLDivElement> {
  onSend?: (message: string) => void;
}

export function ChatInput({ onSend, className, ...props }: ChatInputProps) {
  const [message, setMessage] = useState<string>("");
  const handleSend = () => {
    onSend?.(message);
    setMessage("");
  };
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md pl-1 text-sm",
        className
      )}
      {...props}
    >
      <input
        type="text"
        className="flex-1 focus:outline-none"
        placeholder="Type something..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        size="sm"
        disabled={message.trim().length === 0}
        className="font-mono"
        onClick={handleSend}
      >
        SEND
      </Button>
    </div>
  );
}
