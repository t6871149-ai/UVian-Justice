"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatMessage } from "./chat-message";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatWindowProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {messages.map((message, index) => (
          <ChatMessage key={message.id || index} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-3/4" />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
