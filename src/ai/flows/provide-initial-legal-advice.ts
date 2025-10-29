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
  query: z.string().describe('The legal question asked by the user.'),
});
export type ProvideInitialLegalAdviceInput = z.infer<typeof ProvideInitialLegalAdviceInputSchema>;

const ProvideInitialLegalAdviceOutputSchema = z.object({
  simpleAnswer: z.string().describe('A concise answer to the legal question.'),
  relevantLegalSections: z.array(z.string()).describe('A list of relevant Indian legal sections and acts.'),
  nextStep: z.string().describe('The next general step in the Indian legal system, if applicable.'),
});
export type ProvideInitialLegalAdviceOutput = z.infer<typeof ProvideInitialLegalAdviceOutputSchema>;

export async function provideInitialLegalAdvice(input: ProvideInitialLegalAdviceInput): Promise<ProvideInitialLegalAdviceOutput> {
  return provideInitialLegalAdviceFlow(input);
}

const provideInitialLegalAdvicePrompt = ai.definePrompt({
  name: 'provideInitialLegalAdvicePrompt',
  input: {schema: ProvideInitialLegalAdviceInputSchema},
  output: {schema: ProvideInitialLegalAdviceOutputSchema},
  prompt: `You are an AI legal assistant specializing in Indian law. Your responses must be grounded strictly in Indian Law, referencing the Constitution, specific Acts (e.g., IPC, CrPC, Contract Act), and verifiable Supreme Court/High Court Judgments.

  Provide a response that includes the following:

  - A simple answer to the legal question.
  - A list of relevant Indian legal sections and acts.
  - The next general step in the Indian legal system, if applicable.

  Legal Question: {{{query}}}`, 
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

