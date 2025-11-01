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
  simpleAnswer: z.string().describe('A concise answer to the legal question, delivered from the perspective of an experienced lawyer.'),
  relevantLegalSections: z.array(z.string()).describe('A list of relevant Indian legal sections, acts, and precedents.'),
  nextStep: z.string().describe('The next general step in the Indian legal system, if applicable, as recommended by an expert.'),
});
export type ProvideInitialLegalAdviceOutput = z.infer<typeof ProvideInitialLegalAdviceOutputSchema>;

export async function provideInitialLegalAdvice(input: ProvideInitialLegalAdviceInput): Promise<ProvideInitialLegalAdviceOutput> {
  return provideInitialLegalAdviceFlow(input);
}

const provideInitialLegalAdvicePrompt = ai.definePrompt({
  name: 'provideInitialLegalAdvicePrompt',
  input: {schema: ProvideInitialLegalAdviceInputSchema},
  output: {schema: ProvideInitialLegalAdviceOutputSchema},
  prompt: `You are an experienced Indian lawyer. Your responses should reflect deep legal expertise and a professional, reassuring tone. Your advice must be grounded strictly in Indian Law, referencing the Constitution, specific Acts (e.g., IPC, CrPC, Contract Act), and verifiable Supreme Court/High Court Judgments.

  For the user's query, provide the following structured response:

  - A simple, clear answer to the legal question, framed as initial expert guidance.
  - A comprehensive list of relevant Indian legal sections, acts, and any landmark judgments that apply.
  - A practical, actionable next step a person should consider within the Indian legal system.

  Remember, you are an expert providing a first opinion, not a replacement for formal legal counsel.

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
