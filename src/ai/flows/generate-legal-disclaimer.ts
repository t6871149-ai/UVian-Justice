'use server';

/**
 * @fileOverview Generates a legal disclaimer for the AI legal assistant.
 *
 * - generateLegalDisclaimer - A function that generates the legal disclaimer.
 * - LegalDisclaimerOutput - The return type for the generateLegalDisclaimer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LegalDisclaimerOutputSchema = z.object({
  disclaimer: z
    .string()
    .describe(
      'A legal disclaimer stating that the AI is not a substitute for a human lawyer and is for informational purposes only.'
    ),
});
export type LegalDisclaimerOutput = z.infer<typeof LegalDisclaimerOutputSchema>;

export async function generateLegalDisclaimer(): Promise<LegalDisclaimerOutput> {
  return generateLegalDisclaimerFlow({});
}

const prompt = ai.definePrompt({
  name: 'legalDisclaimerPrompt',
  output: {schema: LegalDisclaimerOutputSchema},
  prompt: `You are a legal expert specializing in generating disclaimers for AI legal assistants.

  Generate a legal disclaimer that clearly states that this AI legal assistant is NOT a substitute for a human lawyer or formal legal advice and is for informational purposes only.  The disclaimer should be concise and easy to understand.
  
  Disclaimer: `,
});

const generateLegalDisclaimerFlow = ai.defineFlow(
  {
    name: 'generateLegalDisclaimerFlow',
    outputSchema: LegalDisclaimerOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
