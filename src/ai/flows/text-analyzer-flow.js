
'use server';
/**
 * @fileOverview A flow for analyzing a snippet of text.
 * 
 * - analyzeText - A function that performs an action (summarize, explain, etc.) on a text snippet.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnalyzeTextInputSchema = z.object({
    text: z.string().describe('The text snippet to analyze.'),
    task: z.string().describe('The analysis task to perform (e.g., "Summarize", "Explain Key Concepts", "Translate to Hindi").'),
});

const analyzeTextFlow = ai.defineFlow(
  {
    name: 'analyzeTextFlow',
    inputSchema: AnalyzeTextInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    try {
      const llmResponse = await ai.generate({
        prompt: `You are an expert academic assistant. Your task is to perform the following action on the provided text snippet: "${input.task}".

        Keep your response concise and directly related to the user's request. If you are translating, only provide the translated text.

        Text Snippet:
        ---
        ${input.text}
        ---`,
        model: 'googleai/gemini-2.0-flash',
        output: {
          format: 'text'
        }
      });
      return llmResponse.text;
    } catch (error) {
        console.error("AI Error in analyzeTextFlow:", error);
        if (error.message && error.message.includes('503')) {
            return "I'm sorry, but the AI service is currently overloaded. Please try again in a few moments.";
        }
        return "An unexpected error occurred while trying to analyze the text. Please try again later.";
    }
  }
);


export async function analyzeText(input) {
  return await analyzeTextFlow(input);
}
