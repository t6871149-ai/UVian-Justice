"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface DisclaimerDialogProps {
  open: boolean;
  onAccept: () => void;
  isAccepting: boolean;
}

const disclaimerText = `⚖️ Disclaimer: Read Before You Proceed! ⚠️

This is a test version of an AI-powered Legal Assistant, designed for informational and educational purposes only.
All responses and claims made by this app are based solely on the Constitution of India and existing Indian laws.

This app does NOT provide official legal advice, and no lawyer–client relationship is created by using it.
For any legal dispute, case, or matter requiring professional judgment, please consult a qualified advocate or legal expert.

Use this app at your own discretion — WE AIM TO EDUCATE, NOT ADJUDICATE.`;

export function DisclaimerDialog({ open, onAccept, isAccepting }: DisclaimerDialogProps) {
  
  const handleAccept = () => {
    onAccept();
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Before you continue...</AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-wrap">
            {"⚖️ Disclaimer: Read Before You Proceed! ⚠️\n\nThis is a test version of an AI-powered Legal Assistant, designed for informational and educational purposes only.\nAll responses and claims made by this app are based solely on the Constitution of India and existing Indian laws.\n\nThis app does "}<strong>NOT</strong>{" provide official legal advice, and no lawyer–client relationship is created by using it.\nFor any legal dispute, case, or matter requiring professional judgment, please consult a qualified advocate or legal expert.\n\nUse this app at your own discretion — "}<strong>WE AIM TO EDUCATE, NOT ADJUDICATE.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleAccept} disabled={isAccepting}>
            {isAccepting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            I Understand and Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
