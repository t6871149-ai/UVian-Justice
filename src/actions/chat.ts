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

  const userMessage = {
    role: "user" as const,
    content: queryText,
    createdAt: serverTimestamp(),
  };
  const chatCollectionRef = collection(db, `users/${userId}/chats`);
  
  // This is an optimistic update, so we don't await it on the server.
  // We'll catch permission errors and report them.
  addDoc(chatCollectionRef, userMessage).then(async (userMessageRef) => {
     // 2. Get AI response
    const aiResponseData = await provideInitialLegalAdvice({ query: queryText });
    
    // 3. Save AI response to Firestore
    const aiMessage = {
      role: "assistant" as const,
      content: aiResponseData,
      createdAt: serverTimestamp(),
      userMessageId: userMessageRef.id
    };
    const aiMessageRef = collection(db, `users/${userId}/chats`);
    addDoc(aiMessageRef, aiMessage).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: aiMessageRef.path,
            operation: 'create',
            requestResourceData: aiMessage,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  }).catch((serverError) => {
      const permissionError = new FirestorePermissionError({
          path: chatCollectionRef.path,
          operation: 'create',
          requestResourceData: userMessage,
      });
      errorEmitter.emit('permission-error', permissionError);
  });

  // We revalidate the path to hint to Next.js to refetch data, but the UI update is optimistic via snapshots.
  revalidatePath('/dashboard');
  return { success: true };
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
  
  return { success: true };
}
