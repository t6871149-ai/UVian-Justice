"use server";

import { db } from "@/lib/firebase-server"; // Use ADMIN DB for writes
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { provideInitialLegalAdvice } from "@/ai/flows/provide-initial-legal-advice";

export async function createCase(userId: string, title: string, details: string) {
    if (!userId) {
        return { error: "User not authenticated." };
    }

    const caseCollectionRef = db.collection(`users/${userId}/cases`);
    const caseData = {
        title,
        details,
        createdAt: FieldValue.serverTimestamp(),
        userId,
    };
    
    try {
        const docRef = await caseCollectionRef.add(caseData);
        revalidatePath('/dashboard');
        return { success: true, caseId: docRef.id };
    } catch (serverError: any) {
       console.error("Error creating case:", serverError);
       throw serverError;
    }
}


export async function handleUserQuery(userId: string, caseId: string, queryText: string) {
  if (!userId || !caseId) {
    return { error: "User or case not identified." };
  }

  const messagesCollectionRef = db.collection(`users/${userId}/cases/${caseId}/messages`);
  
  const userMessage = {
    role: "user" as const,
    content: queryText,
    createdAt: FieldValue.serverTimestamp(),
  };

  // The server action will now handle writing the user message
  try {
    await messagesCollectionRef.add(userMessage);
    revalidatePath(`/dashboard?caseId=${caseId}`);
  } catch (serverError: any) {
    console.error("Error creating user message:", serverError);
    // Don't rethrow here, as we want to continue to the AI call
  }

  // We can still proceed with the AI call optimistically
  const aiResponse = await provideInitialLegalAdvice({ query: queryText });

  const aiMessage = {
      role: "assistant" as const,
      content: aiResponse as any,
      createdAt: FieldValue.serverTimestamp(),
  };
  
  // The server action will also handle writing the AI message
  try {
    await messagesCollectionRef.add(aiMessage);
    revalidatePath(`/dashboard?caseId=${caseId}`);
  } catch (serverError: any) {
     console.error("Error creating AI message:", serverError);
     // Don't rethrow, just log it. The user will see their message.
  }

  return { success: true };
}
