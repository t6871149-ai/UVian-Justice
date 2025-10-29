"use server";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { z } from "zod";
import { LoginSchema, SignUpSchema } from "@/lib/schemas";
import { doc, setDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function signUpWithEmail(values: z.infer<typeof SignUpSchema>) {
  try {
    const validatedFields = SignUpSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields." };
    }

    const { email, password } = validatedFields.data;
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      acceptedDisclaimer: false,
    });
    
    revalidatePath('/dashboard');
    return { success: "User created successfully!" };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function signInWithEmail(values: z.infer<typeof LoginSchema>) {
  try {
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid fields." };
    }

    const { email, password } = validatedFields.data;
    await signInWithEmailAndPassword(auth, email, password);
    revalidatePath('/dashboard');
    return { success: "Signed in successfully!" };
  } catch (error: any) {
     console.error("Sign in error:", error);
    if (error.code === 'auth/invalid-credential') {
      return { error: "Invalid email or password." };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Create user document in Firestore if it doesn't exist
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      acceptedDisclaimer: false,
    }, { merge: true }); // Merge to avoid overwriting existing data

    revalidatePath('/dashboard');
    return { success: "Signed in with Google successfully!" };
  } catch (error: any) {
    console.error("Google sign in error:", error);
    return { error: error.message || "Failed to sign in with Google." };
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
