"use server";

import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
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
    } catch (serverError: any) {
        const permissionError = new FirestorePermissionError({
            path: caseCollectionRef.path,
            operation: 'create',
            requestResourceData: caseData,
        });
        errorEmitter.emit('permission-error', permissionError);
        return { error: "Failed to create case. " + serverError.message };
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

  // No try-catch here, we want errors to be handled by the global listener
  addDoc(messagesCollectionRef, userMessage).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
        path: messagesCollectionRef.path,
        operation: 'create',
        requestResourceData: userMessage
    });
    errorEmitter.emit('permission-error', permissionError);
  });

  revalidatePath(`/dashboard?caseId=${caseId}`);

  // We can still proceed with the AI call optimistically
  const aiResponse = await provideInitialLegalAdvice({ query: queryText });

  const aiMessage = {
      role: "assistant" as const,
      content: aiResponse as any,
      createdAt: serverTimestamp(),
  };
  
  addDoc(messagesCollectionRef, aiMessage).catch((serverError) => {
      const permissionError = new FirestorePermissionError({
        path: messagesCollectionRef.path,
        operation: 'create',
        requestResourceData: aiMessage
      });
      errorEmitter.emit('permission-error', permissionError);
  });

  revalidatePath(`/dashboard?caseId=${caseId}`);
  return { success: true };
}
