import "server-only";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { credential } from "firebase-admin";

import { env } from "@/env";

function requireEnv(name: string, value: string | undefined): string {
  if (!value || value.length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const firebaseAdminApp =
  getApps().find((app) => app?.name === "firebase-admin") ??
  initializeApp(
    {
      credential: credential.cert({
        projectId: requireEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
        clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL", env.FIREBASE_CLIENT_EMAIL),
        // Replace escaped newlines from the environment variable
        privateKey: requireEnv("FIREBASE_PRIVATE_KEY", env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, "\n"),
      }),
    },
    "firebase-admin"
  );

export const auth = getAuth(firebaseAdminApp);
export const db = getFirestore(firebaseAdminApp);
