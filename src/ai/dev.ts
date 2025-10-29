import { config } from 'dotenv';
config();

import '@/ai/flows/generate-legal-disclaimer.ts';
import '@/ai/flows/provide-initial-legal-advice.ts';
import '@/ai/flows/summarize-legal-documents.ts';
import '@/ai/flows/draft-legal-notices.ts';
import '@/ai/flows/suggest-relevant-legal-sections.ts';