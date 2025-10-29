"use server";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { z } from "zod";
import { LoginSchema, SignUpSchema } from "@/lib/schemas";
import { doc, setDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

// This function is kept as a server action, but will be called from the client after a successful signup.
export async function createUserDocument(user: { uid: string; email: string | null; displayName?: string | null; photoURL?: string | null; }) {
  try {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      createdAt: new Date(),
      acceptedDisclaimer: false,
    }, { merge: true });
     revalidatePath('/dashboard');
    return { success: "User document created successfully!" };
  } catch (error: any) {
    console.error("Create user document error:", error);
    return { error: "Failed to create user document." };
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
