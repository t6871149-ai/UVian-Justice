import { type ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatMessageAI } from "./chat-message-ai";
import { ChatMessageUser } from "./chat-message-user";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {message.role === "user" && <ChatMessageUser content={message.content as string} />}
      {message.role === "assistant" && <ChatMessageAI content={message.content as any} />}
    </div>
  )
}
