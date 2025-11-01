"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatMessage } from "./chat-message";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, FileText, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";

interface ChatWindowProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  caseSelected: boolean;
  onNewCase: () => void;
}

export function ChatWindow({ messages, isLoading, caseSelected, onNewCase }: ChatWindowProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const isAtBottom = useRef(true);

  const handleScroll = () => {
    const viewport = viewportRef.current;
    if (viewport) {
      const { scrollHeight, scrollTop, clientHeight } = viewport;
      // Consider it "at bottom" if it's within a few pixels, to account for rounding.
      isAtBottom.current = scrollHeight - scrollTop - clientHeight < 5;
    }
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport && isAtBottom.current) {
        viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: "smooth",
        });
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 p-4" viewportRef={viewportRef} onScroll={handleScroll}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {!caseSelected && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-20 animate-in fade-in-50 duration-500">
                <FileText className="h-12 w-12 mb-4" />
                <h2 className="text-xl font-semibold">No Case Selected</h2>
                <p className="mb-4">Select a case from the sidebar or create a new one to begin.</p>
                <Button onClick={onNewCase}>
                    <PlusCircle className="mr-2"/>
                    Create New Case
                </Button>
            </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage 
                key={message.id} 
                message={message} 
                isLatestMessage={index === messages.length - 1}
            />
          ))
        )}
        {isLoading && messages.length === 0 && (
            <>
                <div className="flex items-start gap-4 justify-end">
                    <div className="space-y-2 flex-1 pt-2 items-end flex flex-col">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-1/2" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                 <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1 pt-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-16 w-3/4" />
                    </div>
                </div>
            </>
        )}
        {isLoading && messages.length > 0 && (
             <div className="flex items-start gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <Avatar>
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <Bot />
                    </AvatarFallback>
                </Avatar>
                <div className="grid gap-1 flex-1 pt-2">
                    <p className="font-semibold">Nyay Sahayak AI</p>
                    <div className="bg-card p-4 rounded-lg border flex items-center space-x-2">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-300"></div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </ScrollArea>
  );
}
// Add Avatar and AvatarFallback to ChatWindow for the thinking indicator
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
