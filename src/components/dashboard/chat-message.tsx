import { type ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatMessageAI } from "./chat-message-ai";
import { ChatMessageUser } from "./chat-message-user";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === "user") {
    return <ChatMessageUser content={message.content as string} />;
  }
  
  if (message.role === "assistant") {
    return <ChatMessageAI content={message.content as any} />;
  }

  return null;
}
