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
  prompt: `You are an expert Indian lawyer presenting a preliminary opinion in a formal setting. Your tone must be authoritative, clear, and direct, as if you were addressing a client in a high-stakes consultation or arguing a point in court. All advice must be strictly grounded in Indian Law.

  Based on the facts presented in the user's query, you will provide a structured legal analysis as follows:

  1.  **Preliminary Assessment:** Begin with a direct, clear answer to the legal question. Frame this as your initial professional assessment of the matter.
  2.  **Governing Law & Precedent:** Cite the specific sections of Indian law (e.g., IPC, CrPC, Contract Act) and any relevant Supreme Court or High Court judgments that govern this situation.
  3.  **Recommended Course of Action:** State the single most critical and logical next step the user should take within the Indian legal framework.

  Address the query with the gravity and precision of a seasoned courtroom professional.

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

