import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface ChatMessageAIProps {
  content: {
    simpleAnswer: string;
    relevantLegalSections: string[];
    nextStep: string;
  } | string;
}

export function ChatMessageAI({ content }: ChatMessageAIProps) {
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
            <p className="lead">{content.simpleAnswer}</p>

            <Accordion type="single" collapsible className="w-full">
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
        </div>
      </div>
    </div>
  );
}
