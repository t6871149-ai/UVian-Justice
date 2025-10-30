import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

interface ChatMessageAIProps {
  content: string;
}

export function ChatMessageAI({ content }: ChatMessageAIProps) {
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
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
}
