
"use server";

import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { errorEmitter } from "@/lib/error-emitter";
import { FirestorePermissionError } from "@/lib/firebase-errors";

// This function is kept as a server action, but will be called from the client after a successful signup or login.
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
        // Use await to ensure the database operation completes or throws an error.
        await setDoc(userDocRef, userData, { merge: true });
        revalidatePath('/dashboard');
        return { success: "User document created/updated successfully!" };
    } catch (serverError: any) {
        // Construct the detailed permission error and emit it.
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create', // This covers both create and merge/update for this logic
            requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
        // We return an error object here to be more explicit, although the primary error handling is via the emitter.
        return { error: `Failed to create/update user document: ${serverError.message}` };
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
