import type { Timestamp } from "firebase/firestore";
import type { ProvideInitialLegalAdviceOutput } from "@/ai/flows/provide-initial-legal-advice";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string | ProvideInitialLegalAdviceOutput;
  createdAt: Timestamp | Date;
}
