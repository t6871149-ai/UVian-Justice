"use server";

import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { errorEmitter } from "@/lib/error-emitter";
import { FirestorePermissionError } from "@/lib/firebase-errors";

// This function is kept as a server action, but will be called from the client after a successful signup.
export async function createUserDocument(user: { uid: string; email: string | null; displayName?: string | null; photoURL?: string | null; }) {
    const userDocRef = doc(db, "users", user.uid);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      acceptedDisclaimer: false,
    };

    try {
        await setDoc(userDocRef, userData, { merge: true });
        revalidatePath('/dashboard');
        return { success: "User document created/updated successfully!" };
    } catch (serverError: any) {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create', // or 'update' if we could distinguish
            requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
        return { error: `Failed to create user document: ${serverError.message}` };
    }
}


export async function signOutUser() {
  try {
    await signOut(auth);
    revalidatePath('/');
    return { success: "Signed out successfully!" };
  } catch (error: any) {
    return { error: "Failed to sign out." };
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
    .catch((serverError: any) => {
      const permissionError = new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'update',
        requestResourceData: updateData,
      });
      errorEmitter.emit('permission-error', permissionError);
    });

  // Return success optimistically, error will be handled by the listener
  return { success: true };
}
