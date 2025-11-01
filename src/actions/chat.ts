
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
        // Revalidate the dashboard path to update the case list
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

  // This server action is now only responsible for getting the AI response
  // and writing it to Firestore. The user's message is added on the client.

  try {
    const aiResponse = await provideInitialLegalAdvice({ query: queryText });

    const aiMessage = {
        role: "assistant" as const,
        content: aiResponse as any,
        createdAt: FieldValue.serverTimestamp(),
    };
    
    const messagesCollectionRef = db.collection(`users/${userId}/cases/${caseId}/messages`);
    await messagesCollectionRef.add(aiMessage);

    // No revalidation needed here, as onSnapshot on the client handles UI updates.
    return { success: true };

  } catch (serverError: any) {
     console.error("Error getting AI response or writing message:", serverError);
     // We can optionally return an error to the client to be displayed.
     return { error: "The AI assistant failed to respond. Please try again." };
  }
}
