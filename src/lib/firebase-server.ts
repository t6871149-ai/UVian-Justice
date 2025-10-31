import "server-only";
import { initializeApp, getApps, credential } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

import { env } from "@/env";

const firebaseAdminApp =
  getApps().find((app) => app?.name === "firebase-admin") ??
  initializeApp(
    {
      credential: credential.cert({
        projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines from the environment variable
        privateKey: env.FIRE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    },
    "firebase-admin"
  );

export const auth = getAuth(firebaseAdminApp);
export const db = getFirestore(firebaseAdminApp);
