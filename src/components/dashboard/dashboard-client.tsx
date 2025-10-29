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

type State = {
  messages: ChatMessage[];
  isLoading: boolean;
  userProfile: { acceptedDisclaimer?: boolean } | null;
  isProfileLoading: boolean;
};

type Action =
  | { type: "SET_MESSAGES"; payload: ChatMessage[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER_PROFILE"; payload: State["userProfile"] }
  | { type: "SET_PROFILE_LOADING"; payload: boolean };

function dashboardReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER_PROFILE":
      return { ...state, userProfile: action.payload };
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
    isLoading: false,
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
    const unsubProfile = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        dispatch({ type: "SET_USER_PROFILE", payload: doc.data() });
      } else {
        dispatch({ type: "SET_USER_PROFILE", payload: { acceptedDisclaimer: false } });
      }
      dispatch({ type: "SET_PROFILE_LOADING", payload: false });
    }, (error) => {
        console.error("Error fetching user profile:", error);
        toast({ title: "Error", description: "Could not load your profile.", variant: "destructive"});
        dispatch({ type: "SET_PROFILE_LOADING", payload: false });
    });


    // Listen for chat history changes
    const chatCollectionRef = collection(db, `users/${user.uid}/chats`);
    const q = query(chatCollectionRef, orderBy("createdAt", "asc"));
    
    dispatch({ type: "SET_LOADING", payload: true });
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
      dispatch({ type: "SET_LOADING", payload: false });
    }, (error) => {
        console.error("Error fetching chat history:", error);
        toast({ title: "Error", description: "Could not load chat history.", variant: "destructive"});
        dispatch({ type: "SET_LOADING", payload: false });
    });


    return () => {
      unsubProfile();
      unsubMessages();
    };
  }, [user, toast]);


  const onDisclaimerAccept = () => {
    if(!user) return;
    startDisclaimerTransition(async () => {
      const result = await acceptDisclaimer(user.uid);
       if(result.success) {
        toast({ title: "Thank you!", description: "You have accepted the disclaimer." });
      } else {
        toast({ title: "Error", description: result.error, variant: 'destructive' });
      }
    });
  }

  const handleSendMessage = (message: string) => {
    if(!user) return;

    startQueryTransition(async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      const result = await handleUserQuery(user.uid, message);
      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
      // Real-time listener will update messages, just need to turn off loading
      dispatch({ type: "SET_LOADING", payload: false });
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
          isLoading={isQueryPending}
        />
      </main>
    </div>
  );
}
