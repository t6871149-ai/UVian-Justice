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

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 p-4" viewportRef={viewportRef}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {!caseSelected && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-20">
                <FileText className="h-12 w-12 mb-4" />
                <h2 className="text-xl font-semibold">No Case Selected</h2>
                <p className="mb-4">Select a case from the sidebar or create a new one to begin.</p>
                <Button onClick={onNewCase}>
                    <PlusCircle className="mr-2"/>
                    Create New Case
                </Button>
            </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
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
             <div className="flex items-start gap-4">
             <Skeleton className="h-10 w-10 rounded-full flex items-center justify-center">
                <Bot className="text-muted-foreground" />
             </Skeleton>
            <div className="space-y-2 flex-1 pt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-3/4" />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
