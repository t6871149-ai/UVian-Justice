// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview An AI agent that summarizes legal documents, extracts key points, relevant sections of Indian law, and suggests potential next steps.
 *
 * - summarizeLegalDocument - A function that summarizes the legal document.
 * - SummarizeLegalDocumentInput - The input type for the summarizeLegalDocument function.
 * - SummarizeLegalDocumentOutput - The return type for the summarizeLegalDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLegalDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The legal document to summarize, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeLegalDocumentInput = z.infer<typeof SummarizeLegalDocumentInputSchema>;

const SummarizeLegalDocumentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the key points in the legal document.'),
  relevantLegalSections: z.array(z.string()).describe('A list of relevant Indian legal sections and acts mentioned in the document.'),
  nextSteps: z.string().describe('Potential next steps based on the document, grounded in Indian law.'),
});
export type SummarizeLegalDocumentOutput = z.infer<typeof SummarizeLegalDocumentOutputSchema>;

export async function summarizeLegalDocument(input: SummarizeLegalDocumentInput): Promise<SummarizeLegalDocumentOutput> {
  return summarizeLegalDocumentFlow(input);
}

const summarizeLegalDocumentPrompt = ai.definePrompt({
  name: 'summarizeLegalDocumentPrompt',
  input: {schema: SummarizeLegalDocumentInputSchema},
  output: {schema: SummarizeLegalDocumentOutputSchema},
  prompt: `You are an AI legal assistant specializing in Indian law. You will summarize a legal document, extract relevant legal sections, and suggest next steps based on Indian law.

  Provide a response that includes the following:

  - A concise summary of the key points in the legal document.
  - A list of relevant Indian legal sections and acts mentioned in the document.
  - Potential next steps based on the document, grounded in Indian law.

  Legal Document: {{media url=documentDataUri}}`,
});

const summarizeLegalDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeLegalDocumentFlow',
    inputSchema: SummarizeLegalDocumentInputSchema,
    outputSchema: SummarizeLegalDocumentOutputSchema,
  },
  async input => {
    const {output} = await summarizeLegalDocumentPrompt(input);
    return output!;
  }
);
