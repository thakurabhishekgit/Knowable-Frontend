
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

export async function answerQuestion(input) {
  const answerQuestionFlow = ai.defineFlow(
    {
      name: 'answerQuestionFlow',
      inputSchema: AnswerQuestionInputSchema,
      outputSchema: z.string(),
    },
    async (input) => {
      const llmResponse = await ai.generate({
        prompt: `You are an expert academic assistant. Your task is to answer the user's question based *only* on the provided document text. 
        Provide only the direct answer as a string, without any introductory phrases or conversational filler. 
        If the answer cannot be found in the text, state that clearly.

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

  return await answerQuestionFlow(input);
}
