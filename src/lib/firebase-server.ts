import "server-only";
import * as admin from "firebase-admin";

import { env } from "@/env";
import { getApps } from "firebase-admin/app";

export const firebaseAdmin =
  getApps().find((app) => app?.name === "firebase-admin") ??
  admin.initializeApp(
    {
      credential: admin.credential.cert({
        projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines from the environment variable
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    },
    "firebase-admin"
  );

export const auth = admin.auth(firebaseAdmin);
export const db = admin.firestore(firebaseAdmin);
