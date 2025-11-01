
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { TypingEffect } from "../ui/typing-effect";
import { useState, useEffect, useCallback } from "react";

interface ChatMessageAIProps {
  content: {
    simpleAnswer: string;
    relevantLegalSections: string[];
    nextStep: string;
  } | string;
  isLatestMessage: boolean; // Prop to identify the last message
}

export function ChatMessageAI({ content, isLatestMessage }: ChatMessageAIProps) {
  // If it's not the latest message, it should be complete from the start.
  const [isTypingComplete, setIsTypingComplete] = useState(!isLatestMessage);

  const handleTypingComplete = useCallback(() => {
    setIsTypingComplete(true);
  }, []);

  useEffect(() => {
    // This effect ensures that if a message is no longer the latest,
    // it snaps to the completed state.
    if (!isLatestMessage && !isTypingComplete) {
      setIsTypingComplete(true);
    }
  }, [isLatestMessage, isTypingComplete]);


  if (typeof content === 'string' || !content.simpleAnswer) {
    // Handle legacy string content or incomplete objects
    return (
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <Bot />
          </AvatarFallback>
        </Avatar>
        <div className="grid gap-1 flex-1">
          <p className="font-semibold">Nyay Sahayak AI</p>
          <div className="bg-card p-3 rounded-lg border">
            <p>{typeof content === 'string' ? content : JSON.stringify(content)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarFallback className="bg-secondary text-secondary-foreground">
          <Bot />
        </AvatarFallback>
      </Avatar>
      <div className="grid gap-1 flex-1">
        <p className="font-semibold">Nyay Sahayak AI</p>
        <div className="bg-card p-4 rounded-lg border prose prose-sm max-w-none">
            {!isTypingComplete ? (
                 <TypingEffect
                    text={content.simpleAnswer}
                    className="lead"
                    onComplete={handleTypingComplete}
                />
            ) : (
                <p className="lead">{content.simpleAnswer}</p>
            )}

            {isTypingComplete && (
                <Accordion type="single" collapsible className="w-full mt-4 animate-in fade-in-50 duration-500">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Relevant Legal Sections</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-wrap gap-2">
                                {content.relevantLegalSections.map((section, index) => (
                                    <Badge key={index} variant="secondary">{section}</Badge>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Suggested Next Step</AccordionTrigger>
                        <AccordionContent>
                            <p>{content.nextStep}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
      </div>
    </div>
  );
}
