import { type NextRequest } from "next/server";
import {
  getTokens,
  type Tokens,
} from "next-firebase-auth-edge";
import { cookies } from "next/headers";

const unauthenticatedPaths = ["/", "/signup"];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    
    // Check if the path requires authentication
    if (unauthenticatedPaths.includes(path)) {
        return;
    }
    
    // The code below is not yet implemented but shows how to get the user's tokens
    // You can use the user's tokens to check if they are authenticated and to get their user ID
    
    // const tokens = await getTokens(cookies(), {
    //     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    //     cookieName: "AuthToken",
    //     cookieSignatureKeys: ["secret1", "secret2"],
    //     serviceAccount: {
    //         clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    //         privateKey: process_env.FIREBASE_PRIVATE_KEY!,
    //         projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    //     },
    // });
}
