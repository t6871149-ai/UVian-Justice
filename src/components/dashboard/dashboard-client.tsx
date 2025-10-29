"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, useReducer } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "./header";
import { ChatWindow } from "./chat-window";
import { ChatInput } from "./chat-input";
import { handleUserQuery, getUserProfile } from "@/actions/chat";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "@/lib/types";
import { DisclaimerDialog } from "../legal/disclaimer-dialog";

type State = {
  messages: ChatMessage[];
  isLoading: boolean;
};

type Action =
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_MESSAGES"; payload: ChatMessage[] };

function messagesReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_MESSAGES":
        return {...state, messages: action.payload };
    default:
      return state;
  }
}

export function DashboardClient({
  initialMessages,
}: {
  initialMessages: ChatMessage[];
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const [state, dispatch] = useReducer(messagesReducer, {
    messages: initialMessages,
    isLoading: false,
  });

  useEffect(() => {
    dispatch({ type: "SET_MESSAGES", payload: initialMessages });
  }, [initialMessages]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      startTransition(async () => {
        const profile = await getUserProfile();
        if (profile && !profile.acceptedDisclaimer) {
          setShowDisclaimer(true);
        }
      });
    }
  }, [user]);

  const onDisclaimerAccept = () => {
    setShowDisclaimer(false);
  }

  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: "temp-user-" + Date.now(),
      role: "user",
      content: message,
      createdAt: new Date(),
    };
    dispatch({ type: "ADD_MESSAGE", payload: userMessage });
    dispatch({ type: "SET_LOADING", payload: true });

    startTransition(async () => {
      const result = await handleUserQuery(message);
      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
      // The page will be revalidated, so we don't need to add the AI message manually
      // It will come in through the `initialMessages` prop update.
      dispatch({ type: "SET_LOADING", payload: false });
    });
  };

  if (authLoading || !user) {
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
      <DisclaimerDialog open={showDisclaimer} onAccept={onDisclaimerAccept} />
      <Header user={user} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow messages={state.messages} isLoading={state.isLoading} />
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isPending || state.isLoading}
        />
      </main>
    </div>
  );
}
