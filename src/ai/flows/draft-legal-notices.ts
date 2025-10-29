'use server';

/**
 * @fileOverview An AI agent that drafts legal notices based on user input.
 *
 * - draftLegalNotice - A function that drafts a legal notice.
 * - DraftLegalNoticeInput - The input type for the draftLegalNotice function.
 * - DraftLegalNoticeOutput - The return type for the draftLegalNotice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftLegalNoticeInputSchema = z.object({
  partiesInvolved: z.string().describe('The parties involved in the dispute, including names and contact information.'),
  natureOfIssue: z.string().describe('A detailed description of the legal issue or dispute.'),
  desiredOutcome: z.string().describe('The desired outcome or resolution sought by the user.'),
  relevantDocuments: z.string().optional().describe('Any relevant documents pertaining to the case, such as contracts or agreements.'),
});
export type DraftLegalNoticeInput = z.infer<typeof DraftLegalNoticeInputSchema>;

const DraftLegalNoticeOutputSchema = z.object({
  draftNotice: z.string().describe('A draft legal notice suitable for sending to the opposing party.'),
});
export type DraftLegalNoticeOutput = z.infer<typeof DraftLegalNoticeOutputSchema>;

export async function draftLegalNotice(input: DraftLegalNoticeInput): Promise<DraftLegalNoticeOutput> {
  return draftLegalNoticeFlow(input);
}

const draftLegalNoticePrompt = ai.definePrompt({
  name: 'draftLegalNoticePrompt',
  input: {schema: DraftLegalNoticeInputSchema},
  output: {schema: DraftLegalNoticeOutputSchema},
  prompt: `You are an AI legal assistant specializing in drafting legal notices under Indian law.

  Based on the details provided by the user, draft a legal notice suitable for sending to the opposing party. The notice should clearly state the parties involved, the nature of the issue, the desired outcome, and any relevant legal provisions. Ensure the notice is professional, concise, and legally sound under Indian law.

  Parties Involved: {{{partiesInvolved}}}
  Nature of Issue: {{{natureOfIssue}}}
  Desired Outcome: {{{desiredOutcome}}}
  Relevant Documents: {{{relevantDocuments}}}

  Draft Legal Notice:
  `,
});

const draftLegalNoticeFlow = ai.defineFlow(
  {
    name: 'draftLegalNoticeFlow',
    inputSchema: DraftLegalNoticeInputSchema,
    outputSchema: DraftLegalNoticeOutputSchema,
  },
  async input => {
    const {output} = await draftLegalNoticePrompt(input);
    return output!;
  }
);
