"use client";

import { useEffect, useState, useTransition } from "react";
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
import { acceptDisclaimer } from "@/actions/chat";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface DisclaimerDialogProps {
  open: boolean;
  onAccept: () => void;
}

export function DisclaimerDialog({ open, onAccept }: DisclaimerDialogProps) {
  const [disclaimerText, setDisclaimerText] = useState("Loading disclaimer...");
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [isAccepting, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      generateLegalDisclaimer()
        .then((res) => {
          setDisclaimerText(res.disclaimer);
        })
        .catch(() => {
          setDisclaimerText(
            "Failed to load disclaimer. Please refresh the page."
          );
        })
        .finally(() => {
          setIsAiLoading(false);
        });
    }
  }, [open]);
  
  const handleAccept = () => {
    startTransition(async () => {
      const result = await acceptDisclaimer();
      if(result.success) {
        toast({ title: "Thank you!", description: "You have accepted the disclaimer." });
        onAccept();
      } else {
        toast({ title: "Error", description: result.error, variant: 'destructive' });
      }
    });
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
