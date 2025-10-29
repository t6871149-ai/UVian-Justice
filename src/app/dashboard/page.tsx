import { getChatHistory } from "@/actions/chat";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { ChatMessage } from "@/lib/types";
import { auth } from "@/lib/firebase"; // We can't use this on the server for the current user
import { redirect } from "next/navigation";
import { getAuth } from "firebase/auth";
import { cookies } from "next/headers";
import { getTokens } from "next-firebase-auth-edge";
import { firebaseAdmin } from "@/lib/firebase-server";

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Gracefully handle missing server-side environment variables
  if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.error("Firebase server environment variables are not set. Redirecting to login.");
    redirect("/");
  }
  
  const tokens = await getTokens(cookies(), {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    cookieName: "AuthToken",
    cookieSignatureKeys: ["secret1", "secret2"],
    serviceAccount: {
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    },
  });

  if (!tokens) {
    redirect("/");
  }

  const initialMessages = await getChatHistory(tokens.decodedToken.uid);
  
  // Convert Timestamps to Dates
  const formattedMessages: ChatMessage[] = initialMessages.map(msg => ({
    ...msg,
    // Firestore Timestamps need to be converted to JS Dates
    createdAt: (msg.createdAt as any).toDate(),
  }));

  return <DashboardClient initialMessages={formattedMessages} />;
}
