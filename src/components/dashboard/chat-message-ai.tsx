
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Info, Milestone, DollarSign } from "lucide-react";
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
    preliminaryAnalysis?: string;
    financialAspects?: string;
    clarifyingQuestions?: string[];
    // Legacy support
    simpleAnswer?: string;
    relevantLegalSections?: string[];
    nextStep?: string;
  } | string;
  isLatestMessage: boolean;
}

export function ChatMessageAI({ content, isLatestMessage }: ChatMessageAIProps) {
  const [isTypingComplete, setIsTypingComplete] = useState(!isLatestMessage);

  const handleTypingComplete = useCallback(() => {
    setIsTypingComplete(true);
  }, []);

  useEffect(() => {
    if (!isLatestMessage && !isTypingComplete) {
      setIsTypingComplete(true);
    }
  }, [isLatestMessage, isTypingComplete]);

  // Handle string content or empty objects
  if (typeof content === 'string' || Object.keys(content).length === 0) {
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
            <p>{typeof content === 'string' ? content : "Thinking..."}</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle new mediation-focused response structure
  if (content.preliminaryAnalysis) {
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
                text={content.preliminaryAnalysis}
                className="lead"
                onComplete={handleTypingComplete}
              />
            ) : (
              <p className="lead">{content.preliminaryAnalysis}</p>
            )}

            {isTypingComplete && (
              <div className="mt-4 space-y-3 animate-in fade-in-50 duration-500">
                <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-md border">
                    <DollarSign className="h-5 w-5 mt-1 text-primary"/>
                    <div>
                        <h4 className="font-semibold">Financial Aspects</h4>
                        <p className="text-muted-foreground">{content.financialAspects}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-md border">
                    <Info className="h-5 w-5 mt-1 text-primary"/>
                    <div>
                        <h4 className="font-semibold">More Information Needed</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                            {content.clarifyingQuestions?.map((question, index) => (
                                <li key={index}>{question}</li>
                            ))}
                        </ul>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Fallback for legacy legal advice structure
  if (content.simpleAnswer) {
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
                                  {content.relevantLegalSections?.map((section, index) => (
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

  // Final fallback for unexpected content structure
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
            <p>{JSON.stringify(content)}</p>
          </div>
        </div>
      </div>
  );
}
