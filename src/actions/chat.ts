
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
  // This is a placeholder as the AI flow is not fully integrated yet.
  console.log("User query received:", queryText);

  const chatCollectionRef = collection(db, `users/${userId}/chats`);
  const userMessage = {
    role: "user" as const,
    content: queryText,
    createdAt: serverTimestamp(),
  };

  addDoc(chatCollectionRef, userMessage).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: chatCollectionRef.path,
      operation: 'create',
      requestResourceData: userMessage,
    });
    errorEmitter.emit('permission-error', permissionError);
  });

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

  try {
    await updateDoc(userDocRef, updateData);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (serverError: any) {
      const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: updateData,
      });
      errorEmitter.emit('permission-error', permissionError);
      return { error: "Failed to accept disclaimer." };
  }
}
