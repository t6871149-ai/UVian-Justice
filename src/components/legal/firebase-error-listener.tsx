'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/lib/error-emitter';

// This is a client component that listens for permission errors and displays them.
// It is intended for development purposes to help debug security rules.
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: any) => {
      // In a production environment, you might want to log this to a service
      // instead of showing a toast to the user.
      console.error("Caught a permission error:", error);

      // We throw the error here to make it visible in the Next.js development overlay.
      // This is the easiest way to see the full contextual error details.
      throw error;
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
