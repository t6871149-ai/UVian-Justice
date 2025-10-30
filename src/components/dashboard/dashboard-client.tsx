
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useReducer, useTransition } from "react";
import { collection, onSnapshot, query, orderBy, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "./header";
import { ChatWindow } from "./chat-window";
import { ChatInput } from "./chat-input";
import { handleUserQuery, acceptDisclaimer } from "@/actions/chat";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "@/lib/types";
import { DisclaimerDialog } from "../legal/disclaimer-dialog";
import type { User } from "firebase/auth";
import { errorEmitter } from "@/lib/error-emitter";
import { FirestorePermissionError } from "@/lib/firebase-errors";

type State = {
  messages: ChatMessage[];
  isLoading: boolean;
  userProfile: { acceptedDisclaimer?: boolean } | null;
  isProfileLoading: boolean;
};

type Action =
  | { type: "SET_MESSAGES"; payload: ChatMessage[] }
  | { type: "MESSAGES_LOADED" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER_PROFILE"; payload: State["userProfile"] }
  | { type: "ACCEPT_DISCLAIMER" }
  | { type: "SET_PROFILE_LOADING"; payload: boolean };

function dashboardReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "MESSAGES_LOADED":
        return { ...state, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER_PROFILE":
      return { ...state, userProfile: action.payload, isProfileLoading: false };
    case "ACCEPT_DISCLAIMER":
      return { ...state, userProfile: { ...state.userProfile, acceptedDisclaimer: true } };
    case "SET_PROFILE_LOADING":
        return { ...state, isProfileLoading: action.payload };
    default:
      return state;
  }
}

export function DashboardClient() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isQueryPending, startQueryTransition] = useTransition();
  const [isDisclaimerPending, startDisclaimerTransition] = useTransition();

  const [state, dispatch] = useReducer(dashboardReducer, {
    messages: [],
    isLoading: true,
    userProfile: null,
    isProfileLoading: true,
  });

  const showDisclaimer = !state.isProfileLoading && state.userProfile !== null && !state.userProfile.acceptedDisclaimer;

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    dispatch({ type: "SET_PROFILE_LOADING", payload: true });

    // Listen for user profile changes
    const userDocRef = doc(db, "users", user.uid);
    const unsubProfile = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        dispatch({ type: "SET_USER_PROFILE", payload: doc.data() });
      } else {
        // If doc doesn't exist, it might be a pending write or a permission error.
        // We set profile to a default and stop loading.
        dispatch({ type: "SET_USER_PROFILE", payload: { acceptedDisclaimer: false } });
      }
    }, (error) => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        dispatch({ type: "SET_PROFILE_LOADING", payload: false });
    });


    // Listen for chat history changes
    const chatCollectionRef = collection(db, `users/${user.uid}/chats`);
    const q = query(chatCollectionRef, orderBy("createdAt", "asc"));
    
    const unsubMessages = onSnapshot(q, (querySnapshot) => {
      const messages: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
         const data = doc.data();
         messages.push({ 
            id: doc.id, 
            ...data,
            createdAt: (data.createdAt as any)?.toDate() ?? new Date(),
         } as ChatMessage);
      });
      dispatch({ type: "SET_MESSAGES", payload: messages });
      // If we get a snapshot (even an empty one), we can consider messages loaded.
      dispatch({ type: "MESSAGES_LOADED" });
    }, (error) => {
        const permissionError = new FirestorePermissionError({
            path: chatCollectionRef.path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        // We can still stop loading, even if there's an error. The UI will just show no messages.
        dispatch({ type: "MESSAGES_LOADED" });
    });


    return () => {
      unsubProfile();
      unsubMessages();
    };
  }, [user, toast]);


  const onDisclaimerAccept = () => {
    if(!user) return;

    // Optimistically update the UI
    dispatch({ type: "ACCEPT_DISCLAIMER" });
    
    startDisclaimerTransition(async () => {
      const result = await acceptDisclaimer(user.uid);
       if(result.success) {
        toast({ title: "Thank you!", description: "You have accepted the disclaimer." });
      } else {
        // Errors are now handled by the global error emitter
      }
    });
  }

  const handleSendMessage = (message: string) => {
    if(!user) return;

    startQueryTransition(async () => {
      // Optimistically set loading, but the server action is non-blocking
      dispatch({ type: "SET_LOADING", payload: true });
      await handleUserQuery(user.uid, message);
      // Let the snapshot listener turn off loading state
    });
  };

  if (authLoading || !user || state.isProfileLoading) {
    return (
      <div className="flex flex-col h-screen">
        <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
          <Skeleton className="h-8 w-32" />
          <div className="ml-auto">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-20 w-3/4" />
          <Skeleton className="h-20 w-3/4 ml-auto" />
          <Skeleton className="h-20 w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <DisclaimerDialog open={showDisclaimer} onAccept={onDisclaimerAccept} isAccepting={isDisclaimerPending} />
      <Header user={user} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow messages={state.messages} isLoading={state.isLoading} />
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isQueryPending || state.isLoading}
        />
      </main>
    </div>
  );
}
