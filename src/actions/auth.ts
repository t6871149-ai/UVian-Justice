"use server";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Keep client auth for signOut
import { db } from "@/lib/firebase-server"; // Use ADMIN DB for writes
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

// This function now uses the Admin SDK to create the user document securely.
export async function createUserDocument(user: { uid: string; email: string | null; displayName?: string | null; photoURL?: string | null; }) {
    const userDocRef = db.collection("users").doc(user.uid);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      createdAt: FieldValue.serverTimestamp(),
      acceptedDisclaimer: false,
    };

    try {
        await userDocRef.set(userData, { merge: true });
        revalidatePath('/dashboard');
        return { success: "User document created/updated successfully!" };
    } catch (serverError: any) {
        console.error("Error creating user document:", serverError);
        // Re-throwing the error to make it visible.
        throw serverError;
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

  const userDocRef = db.collection('users').doc(userId);
  const updateData = { acceptedDisclaimer: true };

  try {
    await userDocRef.update(updateData);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (serverError: any) {
    console.error("Error accepting disclaimer:", serverError);
    // Re-throwing the error to make it visible.
    throw serverError;
  }
}
