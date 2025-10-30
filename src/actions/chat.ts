
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
import { errorEmitter } from "@/lib/error-emitter";
import { FirestorePermissionError } from "@/lib/firebase-errors";

// Note: This function now requires the UID to be passed in.
export async function handleUserQuery(userId: string, queryText: string) {
  if (!userId) {
    return { error: "User not authenticated." };
  }

  const chatCollectionRef = collection(db, `users/${userId}/chats`);

  // Create the user message object first
  const userMessage = {
    role: "user" as const,
    content: queryText,
    createdAt: serverTimestamp(),
  };

  try {
    // 1. Save user's message and get its reference
    const userMessageRef = await addDoc(chatCollectionRef, userMessage).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: chatCollectionRef.path,
            operation: 'create',
            requestResourceData: userMessage,
        });
        errorEmitter.emit('permission-error', permissionError);
        // Re-throw to be caught by the outer try-catch
        throw serverError;
    });

    // 2. Get AI response
    const aiResponseData = await provideInitialLegalAdvice({ query: queryText });

    // 3. Create the AI message object
    const aiMessage = {
      role: "assistant" as const,
      content: aiResponseData, // The entire structured object
      createdAt: serverTimestamp(),
      userMessageId: userMessageRef.id
    };

    // 4. Save AI response to Firestore, linking it to the user's message
    addDoc(chatCollectionRef, aiMessage).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: chatCollectionRef.path,
            operation: 'create',
            requestResourceData: aiMessage,
        });
        errorEmitter.emit('permission-error', permissionError);
    });

    // Revalidate the path to hint at data changes
    revalidatePath('/dashboard');
    return { success: true };

  } catch (error: any) {
    console.error("Error handling user query:", error);
    // Don't re-emit a permission error if it was already handled and re-thrown
    if (!(error instanceof FirestorePermissionError)) {
        // To ensure we still try to provide a permission error if that's the cause
        const permissionError = new FirestorePermissionError({
            path: chatCollectionRef.path,
            operation: 'create',
            requestResourceData: userMessage, // It might have failed on the user message part
        });
        errorEmitter.emit('permission-error', permissionError);
    }
    
    return { error: "Failed to process your query." };
  }
}


// Note: This function now requires the UID to be passed in.
export async function acceptDisclaimer(userId: string) {
  if (!userId) {
    return { error: "User not authenticated." };
  }

  const userDocRef = doc(db, 'users', userId);
  const updateData = { acceptedDisclaimer: true };

  updateDoc(userDocRef, updateData).catch((serverError) => {
      const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: updateData,
      });
      errorEmitter.emit('permission-error', permissionError);
  });
  
  revalidatePath('/dashboard');
  return { success: true };
}
