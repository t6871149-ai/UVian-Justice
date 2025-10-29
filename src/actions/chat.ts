"use server";

import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { provideInitialLegalAdvice } from "@/ai/flows/provide-initial-legal-advice";
import type { ChatMessage } from "@/lib/types";

// Note: This function now requires the UID to be passed in.
export async function handleUserQuery(userId: string, queryText: string) {
  if (!userId) {
    return { error: "User not authenticated." };
  }

  try {
    // 1. Save user message to Firestore
    const userMessage = {
      role: "user" as const,
      content: queryText,
      createdAt: serverTimestamp(),
    };
    const chatCollectionRef = collection(db, `users/${userId}/chats`);
    await addDoc(chatCollectionRef, userMessage);

    // 2. Get AI response
    const aiResponseData = await provideInitialLegalAdvice({ query: queryText });
    
    // 3. Save AI response to Firestore
    const aiMessage = {
      role: "assistant" as const,
      content: aiResponseData,
      createdAt: serverTimestamp(),
    };
    await addDoc(chatCollectionRef, aiMessage);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error handling user query:", error);
    return { error: "Failed to process your query." };
  }
}

// Note: This function now requires the UID to be passed in.
export async function getChatHistory(userId: string): Promise<ChatMessage[]> {
  if (!userId) {
    return [];
  }

  try {
    const chatCollectionRef = collection(db, `users/${userId}/chats`);
    const q = query(chatCollectionRef, orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);

    const messages: ChatMessage[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as ChatMessage);
    });

    return messages;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
}

// Note: This function now requires the UID to be passed in.
export async function getUserProfile(userId: string) {
  if (!userId) {
    return null;
  }
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

// Note: This function now requires the UID to be passed in.
export async function acceptDisclaimer(userId: string) {
  if (!userId) {
    return { error: "User not authenticated." };
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      acceptedDisclaimer: true,
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error accepting disclaimer:", error);
    return { error: "Failed to update your profile." };
  }
}
