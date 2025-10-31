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

export async function createCase(userId: string, title: string, details: string) {
    if (!userId) {
        return { error: "User not authenticated." };
    }

    const caseCollectionRef = collection(db, `users/${userId}/cases`);
    const caseData = {
        title,
        details,
        createdAt: serverTimestamp(),
        userId,
    };
    
    try {
        const docRef = await addDoc(caseCollectionRef, caseData);
        revalidatePath('/dashboard');
        return { success: true, caseId: docRef.id };
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: caseCollectionRef.path,
            operation: 'create',
            requestResourceData: caseData,
        });
        errorEmitter.emit('permission-error', permissionError);
        return { error: "Failed to create case due to a database error." };
    }
}


export async function handleUserQuery(userId: string, caseId: string, queryText: string) {
  if (!userId || !caseId) {
    return { error: "User or case not identified." };
  }

  const messagesCollectionRef = collection(db, `users/${userId}/cases/${caseId}/messages`);
  
  const userMessage = {
    role: "user" as const,
    content: queryText,
    createdAt: serverTimestamp(),
  };

  try {
    // 1. Save the user's message
    const userMessageRef = await addDoc(messagesCollectionRef, userMessage);
    revalidatePath(`/dashboard?caseId=${caseId}`);

    // 2. Call the AI
    const aiResponse = await provideInitialLegalAdvice({ query: queryText });

    // 3. Save the AI's response
    const aiMessage = {
        role: "assistant" as const,
        content: aiResponse,
        createdAt: serverTimestamp(),
    };
    await addDoc(messagesCollectionRef, aiMessage);

    revalidatePath(`/dashboard?caseId=${caseId}`);
    return { success: true };

  } catch (error: any) {
    console.error("Error in handleUserQuery:", error);
    // Determine the path for the error message
    const path = `users/${userId}/cases/${caseId}/messages`;
    const permissionError = new FirestorePermissionError({
        path: path,
        operation: 'create',
    });
    errorEmitter.emit('permission-error', permissionError);
    return { error: "An error occurred while processing your request." };
  }
}


export async function acceptDisclaimer(userId: string) {
  if (!userId) {
    return { error: "User not authenticated." };
  }

  const userDocRef = doc(db, 'users', userId);
  const updateData = { acceptedDisclaimer: true };

  updateDoc(userDocRef, updateData)
    .then(() => {
        revalidatePath('/dashboard');
    })
    .catch((serverError) => {
      const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: updateData,
      });
      errorEmitter.emit('permission-error', permissionError);
  });
  
  return { success: true };
}
