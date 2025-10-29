import type { ProvideInitialLegalAdviceOutput } from "@/ai/flows/provide-initial-legal-advice";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, ChevronsRight, Gavel, FileText, Bot } from "lucide-react";

interface ChatMessageAIProps {
  content: ProvideInitialLegalAdviceOutput;
}

export function ChatMessageAI({ content }: ChatMessageAIProps) {
  if (!content) return null;

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
          <Accordion type="multiple" defaultValue={["simple-answer", "relevant-sections", "next-step"]} className="w-full">
            <AccordionItem value="simple-answer">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Gavel className="h-4 w-4" />
                  Simple Answer
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                {content.simpleAnswer}
              </AccordionContent>
            </AccordionItem>
            
            {content.relevantLegalSections && content.relevantLegalSections.length > 0 && (
              <AccordionItem value="relevant-sections">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Relevant Legal Sections
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {content.relevantLegalSections.map((section, index) => (
                      <li key={index} className="text-sm">{section}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}

            {content.nextStep && (
              <AccordionItem value="next-step">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <ChevronsRight className="h-4 w-4" />
                    Next Step
                  </div>
                </AccordionTrigger>
                <AccordionContent className="prose prose-sm max-w-none">
                  {content.nextStep}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
