import type { SecurityRuleContext } from './types';

// A custom error class to provide more context on Firestore permission errors.
export class FirestorePermissionError extends Error {
  context: SecurityRuleContext;
  baseError?: Error;

  constructor(context: SecurityRuleContext, baseError?: Error) {
    const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${JSON.stringify(context, null, 2)}`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
    this.baseError = baseError;

    // This is to make the error readable in the Next.js overlay
    this.stack = '';
  }
}
