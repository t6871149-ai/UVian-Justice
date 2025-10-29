"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { generateLegalDisclaimer } from "@/ai/flows/generate-legal-disclaimer";
import { Loader2 } from "lucide-react";

interface DisclaimerDialogProps {
  open: boolean;
  onAccept: () => void;
  isAccepting: boolean;
}

export function DisclaimerDialog({ open, onAccept, isAccepting }: DisclaimerDialogProps) {
  const [disclaimerText, setDisclaimerText] = useState("Loading disclaimer...");
  const [isAiLoading, setIsAiLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setIsAiLoading(true);
      generateLegalDisclaimer()
        .then((res) => {
          setDisclaimerText(res.disclaimer);
        })
        .catch(() => {
          setDisclaimerText(
            "Failed to load disclaimer. Please try again."
          );
        })
        .finally(() => {
          setIsAiLoading(false);
        });
    }
  }, [open]);
  
  const handleAccept = () => {
    onAccept();
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Legal Disclaimer</AlertDialogTitle>
          <AlertDialogDescription>
            {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin my-4" /> : disclaimerText}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleAccept} disabled={isAiLoading || isAccepting}>
            {isAccepting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            I Understand and Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
