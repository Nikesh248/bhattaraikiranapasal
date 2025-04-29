
'use server';
/**
 * @fileOverview Recommends products based on user's search history.
 *
 * - recommendProducts - A function that handles the product recommendation process.
 * - RecommendProductsInput - The input type for the recommendProducts function.
 * - RecommendProductsOutput - The return type for the recommendProducts function.
 */

import { ai, ensureAiIsConfigured, isAiConfigured } from '@/ai/ai-instance';
import { z } from 'genkit';

const RecommendProductsInputSchema = z.object({
  searchHistory: z.array(z.string()).describe('The user\'s search history.'),
  currentCart: z.array(z.string()).optional().describe('The user\'s current cart.'),
  numberOfRecommendations: z.number().default(3).describe('The number of product recommendations to return.'),
});
export type RecommendProductsInput = z.infer<typeof RecommendProductsInputSchema>;

const RecommendProductsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of product recommendations based on the search history.'),
});
export type RecommendProductsOutput = z.infer<typeof RecommendProductsOutputSchema>;

export async function recommendProducts(input: RecommendProductsInput): Promise<RecommendProductsOutput> {
  // Check if AI is configured before attempting to run the flow
  if (!isAiConfigured) {
      console.warn("Attempted to call recommendProductsFlow, but AI is not configured (GOOGLE_GENAI_API_KEY missing or invalid).");
      // Return empty recommendations or throw a specific error
      return { recommendations: [] };
      // Or: throw new Error("AI features are not available. Please configure the API key.");
  }
  return recommendProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendProductsPrompt',
  input: {
    schema: z.object({
      searchHistory: z
        .array(z.string())
        .describe('The user\'s search history, as a list of search queries.'),
      currentCart: z.array(z.string()).optional().describe('The user\'s current cart.'),
      numberOfRecommendations: z.number().describe('The number of product recommendations to return.'),
    }),
  },
  output: {
    schema: z.object({
      recommendations: z
        .array(z.string())
        .describe('A list of product recommendations based on the search history.'),
    }),
  },
  prompt: `Based on the user's past search history: {{searchHistory}},
  and the items in their current cart (if any): {{currentCart}},
  recommend {{numberOfRecommendations}} relevant products they might be interested in. Return the recommendations as a list of product names, separated by commas.`,
});

const recommendProductsFlow = ai.defineFlow<
  typeof RecommendProductsInputSchema,
  typeof RecommendProductsOutputSchema
>(
  {
    name: 'recommendProductsFlow',
    inputSchema: RecommendProductsInputSchema,
    outputSchema: RecommendProductsOutputSchema,
  },
  async input => {
    try {
        ensureAiIsConfigured(); // Double-check within the flow execution
        const {output} = await prompt(input);
        return output!;
    } catch (error) {
        console.error('Error in recommendProductsFlow:', error);
        // Check if the error message indicates an API key issue
        if (error instanceof Error && /API key not valid/i.test(error.message)) {
             throw new Error("Failed to get recommendations: Invalid API Key. Please check server configuration.");
        }
         if (error instanceof Error && /AI features are not configured/i.test(error.message)) {
            throw new Error("Failed to get recommendations: AI service is not configured.");
        }
        // Throw a more generic error for other issues
        throw new Error("Failed to get recommendations due to an internal error.");
    }
  }
);
