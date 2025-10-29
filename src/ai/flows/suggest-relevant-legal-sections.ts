// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview An AI agent that suggests relevant legal sections based on the user's query.
 *
 * - suggestRelevantLegalSections - A function that suggests relevant legal sections.
 * - SuggestRelevantLegalSectionsInput - The input type for the suggestRelevantLegalSections function.
 * - SuggestRelevantLegalSectionsOutput - The return type for the suggestRelevantLegalSections function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantLegalSectionsInputSchema = z.object({
  query: z.string().describe('The legal issue described by the user.'),
});
export type SuggestRelevantLegalSectionsInput = z.infer<typeof SuggestRelevantLegalSectionsInputSchema>;

const SuggestRelevantLegalSectionsOutputSchema = z.object({
  relevantLegalSections: z.array(z.object({
    section: z.string().describe('The section of the IPC, CrPC, or other applicable law.'),
    explanation: z.string().describe('A brief explanation of the section.'),
  })).describe('A list of relevant Indian legal sections and acts with explanations.'),
});
export type SuggestRelevantLegalSectionsOutput = z.infer<typeof SuggestRelevantLegalSectionsOutputSchema>;

export async function suggestRelevantLegalSections(input: SuggestRelevantLegalSectionsInput): Promise<SuggestRelevantLegalSectionsOutput> {
  return suggestRelevantLegalSectionsFlow(input);
}

const suggestRelevantLegalSectionsPrompt = ai.definePrompt({
  name: 'suggestRelevantLegalSectionsPrompt',
  input: {schema: SuggestRelevantLegalSectionsInputSchema},
  output: {schema: SuggestRelevantLegalSectionsOutputSchema},
  prompt: `You are an AI legal assistant specializing in Indian law. Your responses must be grounded strictly in Indian Law, referencing the Constitution, specific Acts (e.g., IPC, CrPC, Contract Act), and verifiable Supreme Court/High Court Judgments.

  Based on the user's query, suggest the most relevant sections of the Indian Penal Code (IPC), Criminal Procedure Code (CrPC), or other applicable laws, along with brief explanations, so the user can better understand the legal framework related to their situation.

  Legal Question: {{{query}}}`,
});

const suggestRelevantLegalSectionsFlow = ai.defineFlow(
  {
    name: 'suggestRelevantLegalSectionsFlow',
    inputSchema: SuggestRelevantLegalSectionsInputSchema,
    outputSchema: SuggestRelevantLegalSectionsOutputSchema,
  },
  async input => {
    const {output} = await suggestRelevantLegalSectionsPrompt(input);
    return output!;
  }
);
