"use server";

import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { provideInitialLegalAdvice } from "@/ai/flows/provide-initial-legal-advice";

// Note: This function now requires the UID to be passed in.
export async function handleUserQuery(userId: string, queryText: string) {
  if (!userId) {
    return { error: "User not authenticated." };
  }

  try {
    // 1. Save user message to Firestore
    const userMessage = {
      role: "user" as const,
      content: queryText,
      createdAt: serverTimestamp(),
    };
    const chatCollectionRef = collection(db, `users/${userId}/chats`);
    const userMessageRef = await addDoc(chatCollectionRef, userMessage);

    // 2. Get AI response
    const aiResponseData = await provideInitialLegalAdvice({ query: queryText });
    
    // 3. Save AI response to Firestore
    const aiMessage = {
      role: "assistant" as const,
      content: aiResponseData,
      createdAt: serverTimestamp(),
      userMessageId: userMessageRef.id
    };
    await addDoc(chatCollectionRef, aiMessage);

    // No revalidatePath needed, client will update via snapshot listener
    return { success: true };
  } catch (error) {
    console.error("Error handling user query:", error);
    return { error: "Failed to process your query." };
  }
}


// Note: This function now requires the UID to be passed in.
export async function acceptDisclaimer(userId: string) {
  if (!userId) {
    return { error: "User not authenticated." };
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      acceptedDisclaimer: true,
    });
    // No revalidatePath needed, client will update via snapshot listener
    return { success: true };
  } catch (error) {
    console.error("Error accepting disclaimer:", error);
    return { error: "Failed to update your profile." };
  }
}
