// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview An AI agent that provides initial legal advice based on Indian law.
 *
 * - provideInitialLegalAdvice - A function that provides initial legal advice.
 * - ProvideInitialLegalAdviceInput - The input type for the provideInitialLegalAdvice function.
 * - ProvideInitialLegalAdviceOutput - The return type for the provideInitialLegalAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideInitialLegalAdviceInputSchema = z.object({
  query: z.string().describe('The legal question or case details provided by the user.'),
});
export type ProvideInitialLegalAdviceInput = z.infer<typeof ProvideInitialLegalAdviceInputSchema>;

const ProvideInitialLegalAdviceOutputSchema = z.object({
  preliminaryAnalysis: z.string().describe("A summary of the AI's understanding of the dispute and the parties involved."),
  financialAspects: z.string().describe('An analysis of the monetary claims by each party, asking for clarification if needed.'),
  clarifyingQuestions: z.array(z.string()).describe('Specific questions to gather more information required for mediation.'),
});
export type ProvideInitialLegalAdviceOutput = z.infer<typeof ProvideInitialLegalAdviceOutputSchema>;

export async function provideInitialLegalAdvice(input: ProvideInitialLegalAdviceInput): Promise<ProvideInitialLegalAdviceOutput> {
  return provideInitialLegalAdviceFlow(input);
}

const provideInitialLegalAdvicePrompt = ai.definePrompt({
  name: 'provideInitialLegalAdvicePrompt',
  input: {schema: ProvideInitialLegalAdviceInputSchema},
  output: {schema: ProvideInitialLegalAdviceOutputSchema},
  prompt: `You are an AI legal mediator specializing in Indian law. Your goal is to understand the user's case, identify the core issues, and gather information to facilitate a resolution.

  Based on the user's initial query, you will:
  1.  **Analyze the Dispute:** Provide a preliminary analysis of the case, identifying the parties involved and the nature of the dispute.
  2.  **Clarify Financials:** Assess the monetary aspect of the case. State what you understand about the financial claims and ask for specific amounts if they are not provided.
  3.  **Ask Clarifying Questions:** Formulate a list of specific, targeted questions to gather the additional information needed to fully understand the situation and explore mediation possibilities.

  Your tone should be helpful, empathetic, and professional.

  User's Case Details: {{{query}}}`,
});

const provideInitialLegalAdviceFlow = ai.defineFlow(
  {
    name: 'provideInitialLegalAdviceFlow',
    inputSchema: ProvideInitialLegalAdviceInputSchema,
    outputSchema: ProvideInitialLegalAdviceOutputSchema,
  },
  async input => {
    const {output} = await provideInitialLegalAdvicePrompt(input);
    return output!;
  }
);
