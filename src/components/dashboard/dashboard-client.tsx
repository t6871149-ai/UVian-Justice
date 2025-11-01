"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useReducer, useTransition, useRef, useState } from "react";
import { collection, onSnapshot, query, orderBy, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "./header";
import { ChatWindow } from "./chat-window";
import { ChatInput } from "./chat-input";
import { handleUserQuery, createCase } from "@/actions/chat";
import { acceptDisclaimer } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage, Case } from "@/lib/types";
import { DisclaimerDialog } from "../legal/disclaimer-dialog";
import { errorEmitter } from "@/lib/error-emitter";
import { FirestorePermissionError } from "@/lib/firebase-errors";
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { CaseSidebar } from "./case-sidebar";
import { PlusCircle } from "lucide-react";
import { NewCaseDialog } from "./new-case-dialog";
import { Button } from "../ui/button";

type State = {
  messages: ChatMessage[];
  cases: Case[];
  isMessagesLoading: boolean;
  isCasesLoading: boolean;
  userProfile: { acceptedDisclaimer?: boolean } | null;
  isProfileLoading: boolean;
};

type Action =
  | { type: "SET_MESSAGES"; payload: ChatMessage[] }
  | { type: "SET_CASES"; payload: Case[] }
  | { type: "SET_MESSAGES_LOADING"; payload: boolean }
  | { type: "SET_CASES_LOADING"; payload: boolean }
  | { type: "SET_USER_PROFILE"; payload: State["userProfile"] }
  | { type: "ACCEPT_DISCLAIMER" }
  | { type: "SET_PROFILE_LOADING"; payload: boolean };

function dashboardReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_MESSAGES":
      return { ...state, messages: action.payload, isMessagesLoading: false };
    case "SET_CASES":
      return { ...state, cases: action.payload, isCasesLoading: false };
    case "SET_MESSAGES_LOADING":
        return { ...state, isMessagesLoading: action.payload };
    case "SET_CASES_LOADING":
        return { ...state, isCasesLoading: action.payload };
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
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isQueryPending, startQueryTransition] = useTransition();
  const [isDisclaimerPending, startDisclaimerTransition] = useTransition();
  const [isNewCasePending, startNewCaseTransition] = useTransition();

  const [state, dispatch] = useReducer(dashboardReducer, {
    messages: [],
    cases: [],
    isMessagesLoading: true,
    isCasesLoading: true,
    userProfile: null,
    isProfileLoading: true,
  });

  const [isNewCaseDialogOpen, setNewCaseDialogOpen] = useState(false);
  const selectedCaseId = searchParams.get("caseId");

  const showDisclaimer = !state.isProfileLoading && state.userProfile !== null && !state.userProfile.acceptedDisclaimer;
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    dispatch({ type: "SET_PROFILE_LOADING", payload: true });
    dispatch({ type: "SET_CASES_LOADING", payload: true });

    const userDocRef = doc(db, "users", user.uid);
    const unsubProfile = onSnapshot(userDocRef, (doc) => {
      dispatch({ type: "SET_USER_PROFILE", payload: doc.exists() ? doc.data() : { acceptedDisclaimer: false } });
    }, (error) => {
        const permissionError = new FirestorePermissionError({ path: userDocRef.path, operation: 'get' });
        errorEmitter.emit('permission-error', permissionError);
        dispatch({ type: "SET_PROFILE_LOADING", payload: false });
    });

    const caseCollectionRef = collection(db, `users/${user.uid}/cases`);
    const caseQuery = query(caseCollectionRef, orderBy("createdAt", "desc"));
    const unsubCases = onSnapshot(caseQuery, (snapshot) => {
        const cases: Case[] = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: (doc.data().createdAt as any)?.toDate() ?? new Date(),
        } as Case));
        dispatch({ type: "SET_CASES", payload: cases });
        if (!selectedCaseId && cases.length > 0) {
            router.replace(`/dashboard?caseId=${cases[0].id}`);
        }
    }, (error) => {
        const permissionError = new FirestorePermissionError({ path: caseCollectionRef.path, operation: 'list' });
        errorEmitter.emit('permission-error', permissionError);
        dispatch({ type: "SET_CASES_LOADING", payload: false });
    });

    return () => {
      unsubProfile();
      unsubCases();
    };
  }, [user, router, selectedCaseId]);

  useEffect(() => {
    if (!user || !selectedCaseId) {
        dispatch({ type: "SET_MESSAGES", payload: [] });
        dispatch({ type: "SET_MESSAGES_LOADING", payload: false });
        return;
    };

    dispatch({ type: "SET_MESSAGES_LOADING", payload: true });
    
    const messagesCollectionRef = collection(db, `users/${user.uid}/cases/${selectedCaseId}/messages`);
    const messagesQuery = query(messagesCollectionRef, orderBy("createdAt", "asc"));
    
    const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
      const messages: ChatMessage[] = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: (doc.data().createdAt as any)?.toDate() ?? new Date(),
      } as ChatMessage));
      dispatch({ type: "SET_MESSAGES", payload: messages });
    }, (error) => {
        const permissionError = new FirestorePermissionError({ path: messagesCollectionRef.path, operation: 'list' });
        errorEmitter.emit('permission-error', permissionError);
        dispatch({ type: "SET_MESSAGES_LOADING", payload: false });
    });

    return () => unsubMessages();
  }, [user, selectedCaseId]);


  const onDisclaimerAccept = () => {
    if(!user) return;
    startDisclaimerTransition(async () => {
      const result = await acceptDisclaimer(user.uid);
      if (result.success) {
        dispatch({ type: "ACCEPT_DISCLAIMER" }); 
        toast({ title: "Thank you!", description: "You have accepted the disclaimer." });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    });
  }

  const handleNewCase = (title: string, details: string) => {
    if (!user) return;
    startNewCaseTransition(async () => {
        const result = await createCase(user.uid, title, details);
        if (result.success && result.caseId) {
            toast({ title: "Case Created", description: `The case "${title}" has been created.` });
            setNewCaseDialogOpen(false);
            router.push(`/dashboard?caseId=${result.caseId}`);
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
    });
  }

  const handleSendMessage = (message: string) => {
    if(!user || !selectedCaseId) return;

    startQueryTransition(async () => {
      await handleUserQuery(user.uid, selectedCaseId, message);
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
    <SidebarProvider>
      <div className="flex flex-col h-screen">
        <DisclaimerDialog open={showDisclaimer} onAccept={onDisclaimerAccept} isAccepting={isDisclaimerPending} />
        <NewCaseDialog 
            open={isNewCaseDialogOpen} 
            onOpenChange={setNewCaseDialogOpen} 
            onSubmit={handleNewCase}
            isCreating={isNewCasePending}
        />
        <Header user={user} />
        <div className="flex-1 flex overflow-hidden">
            <Sidebar>
                <SidebarContent className="p-0">
                    <SidebarHeader className="p-2">
                        <Button variant="outline" onClick={() => setNewCaseDialogOpen(true)}>
                            <PlusCircle className="mr-2"/>
                            New Case
                        </Button>
                    </SidebarHeader>
                    <CaseSidebar cases={state.cases} selectedCaseId={selectedCaseId} isLoading={state.isCasesLoading} />
                </SidebarContent>
            </Sidebar>
            <SidebarInset className="flex flex-col">
              <main className="flex-1 flex flex-col overflow-hidden">
                  <ChatWindow 
                      messages={state.messages} 
                      isLoading={isQueryPending || state.isMessagesLoading} 
                      caseSelected={!!selectedCaseId}
                      onNewCase={() => setNewCaseDialogOpen(true)}
                  />
                  <ChatInput
                      onSendMessage={handleSendMessage}
                      isLoading={isQueryPending}
                      disabled={!selectedCaseId || isQueryPending}
                  />
              </main>
            </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
