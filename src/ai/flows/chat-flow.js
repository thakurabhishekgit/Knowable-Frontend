
'use server';
/**
 * @fileOverview A Q&A flow for answering questions about a document.
 * 
 * - answerQuestion - A function that answers a question based on document text.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnswerQuestionInputSchema = z.object({
    documentText: z.string().describe('The full text content of the document.'),
    question: z.string().describe('The user\'s question about the document.'),
});

const answerQuestionFlow = ai.defineFlow(
  {
    name: 'answerQuestionFlow',
    inputSchema: AnswerQuestionInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: `You are an expert academic assistant. Your primary task is to answer the user's question based on the provided document text. 
      However, you can also use your general knowledge to provide more comprehensive answers, comparing or contrasting with the information in the document if relevant.
      Provide the answer as a string, without any introductory phrases. If the answer cannot be found in the text and is not general knowledge, state that clearly.

      Document Text:
      ---
      ${input.documentText}
      ---

      Question: ${input.question}`,
      model: 'googleai/gemini-2.0-flash',
      output: {
        format: 'text'
      }
    });

    return llmResponse.text;
  }
);

export async function answerQuestion(input) {
  return await answerQuestionFlow(input);
}
