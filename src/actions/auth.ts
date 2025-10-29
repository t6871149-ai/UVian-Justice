"use server";

import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
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
      createdAt: new Date(),
      acceptedDisclaimer: false,
    };

    setDoc(userDocRef, userData, { merge: true }).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });

    revalidatePath('/dashboard');
    return { success: "User document created successfully!" };
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
