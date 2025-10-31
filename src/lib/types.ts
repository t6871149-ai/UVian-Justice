import type { Timestamp } from "firebase/firestore";

export interface Case {
  id: string;
  title: string;
  details: string;
  createdAt: Timestamp | Date;
  userId: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string | { simpleAnswer: string; relevantLegalSections: string[]; nextStep: string; };
  createdAt: Timestamp | Date;
}

export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete';
    requestResourceData?: any;
};
