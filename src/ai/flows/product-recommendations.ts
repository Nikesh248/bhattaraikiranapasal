
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

// This internal function is called by the Server Action
async function recommendProductsFlowInternal(input: RecommendProductsInput): Promise<RecommendProductsOutput> {
    try {
        // Double-check AI config within the flow execution
        // ensureAiIsConfigured(); // This check can be done in the action or here
        const {output} = await prompt(input);
        if (!output) {
            throw new Error("AI prompt did not return an output.");
        }
        return output;
    } catch (error) {
        console.error('Error in recommendProductsFlowInternal:', error);
        // Re-throw specific errors for the action layer to handle
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


// Exported function to be used by Server Actions. It wraps the flow definition.
// Error handling and AI availability checks are better handled in the calling Server Action.
export async function recommendProducts(input: RecommendProductsInput): Promise<RecommendProductsOutput> {
  // We ensure AI is configured in the action that calls this.
  // If called directly elsewhere, the caller should check isAiConfigured.
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
  // Adjusted prompt for clarity and to potentially handle empty history/cart better
  prompt: `You are a helpful shopping assistant for Bhattarai Kirana Pasal.
Based on the user's recent search history:
{{#if searchHistory}}
{{#each searchHistory}}
- {{{this}}}
{{/each}}
{{else}}
(No search history provided)
{{/if}}

And the items currently in their cart:
{{#if currentCart}}
{{#each currentCart}}
- {{{this}}}
{{/each}}
{{else}}
(Cart is empty)
{{/if}}

Recommend {{numberOfRecommendations}} relevant products available at the store that they might be interested in.
Focus on suggesting items that complement their searches or cart items. If history and cart are empty, suggest popular items.
Return ONLY a list of product names.`,
});

// Define the flow using the internal function for cleaner error propagation
const recommendProductsFlow = ai.defineFlow<
  typeof RecommendProductsInputSchema,
  typeof RecommendProductsOutputSchema
>(
  {
    name: 'recommendProductsFlow',
    inputSchema: RecommendProductsInputSchema,
    outputSchema: RecommendProductsOutputSchema,
  },
  recommendProductsFlowInternal // Use the internal async function
);
