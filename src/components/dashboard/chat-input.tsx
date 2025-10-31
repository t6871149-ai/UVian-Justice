"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, isLoading, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="p-4 border-t bg-background">
      <form
        onSubmit={handleSubmit}
        className="relative max-w-4xl mx-auto"
      >
        <Textarea
          placeholder={disabled ? "Please select a case to start chatting" : "Ask a legal question based on Indian Law..."}
          className="pr-20"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
            }
          }}
          disabled={isLoading || disabled}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute top-1/2 right-3 -translate-y-1/2"
          disabled={isLoading || disabled || !message.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
