
'use server';
/**
 * @fileOverview A flow for generating study tools like flashcards and quizzes from a document.
 * 
 * - generateStudyTool - A function that creates study materials based on the document text.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const FlashcardSchema = z.object({
  term: z.string().describe('The key term, concept, or name.'),
  definition: z.string().describe('A concise and clear definition of the term.'),
});

const QuizQuestionSchema = z.object({
  question: z.string().describe('The multiple-choice question.'),
  options: z.array(z.string()).describe('An array of 4-5 possible answers.'),
  correctAnswer: z.string().describe('The correct answer from the options array.'),
});

const StudyToolOutputSchema = z.object({
    flashcards: z.array(FlashcardSchema).optional().describe('An array of generated flashcards.'),
    quiz: z.array(QuizQuestionSchema).optional().describe('An array of generated quiz questions.'),
});

const StudyToolInputSchema = z.object({
    documentText: z.string().describe('The full text content of the document.'),
    toolType: z.enum(['flashcards', 'quiz']).describe('The type of study tool to generate.'),
});

const generateStudyToolFlow = ai.defineFlow(
  {
    name: 'generateStudyToolFlow',
    inputSchema: StudyToolInputSchema,
    outputSchema: StudyToolOutputSchema,
  },
  async (input) => {
    try {
      const llmResponse = await ai.generate({
        prompt: `You are an expert academic assistant specializing in creating study materials. Based on the provided document text, generate the requested study tool.

        Document Text:
        ---
        ${input.documentText}
        ---

        Please generate ${input.toolType} based on the key information in the document.
        - For flashcards, identify 10-15 key terms, concepts, or important names and provide concise definitions.
        - For a quiz, create 5-7 multiple-choice questions that test understanding of the main ideas. Each question should have 4 options and a clearly identified correct answer.
        `,
        model: 'googleai/gemini-2.0-flash',
        output: {
          schema: StudyToolOutputSchema,
        }
      });
      return llmResponse.output || {};
    } catch (error) {
      console.error("AI Error in generateStudyToolFlow:", error);
      // Return a structured error or an empty object. The frontend should handle this.
      if (error.message && error.message.includes('503')) {
          throw new Error("I'm sorry, but the AI service is currently overloaded. Please try again in a few moments.");
      }
      throw new Error("An unexpected error occurred while trying to generate the study tool. Please try again later.");
    }
  }
);


export async function generateStudyTool(input) {
  return await generateStudyToolFlow(input);
}
